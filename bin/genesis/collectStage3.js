import { scriptStart, scriptPath } from "modules/scripting"
import { NmapClear, watchForNewServer, NmapMoneyServers, NmapRamServers } from "modules/network"

/** @param {NS} ns */
export async function main(ns) {

    // run list money servers
    // if not working on it, grow money to 100%
    // if not working on it, weak security al low as posible
    // if not working on it, hack the server 

    // threads are efficient timing is not

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA
    const SCRIPT = scriptPath(ns)
    const HACKCHANCE = 0.8
    const HACKPROCENT = 0.8

    //\\ FUNCTIONS
    function growCondition(target) {
        return ns.getServerMoneyAvailable(target) !== ns.getServerMaxMoney(target)
    }

    function weakCondition(target) {
        return ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target) + 2 &&
            ns.getServerMoneyAvailable(target) !== ns.getServerMaxMoney(target)
    }

    function checkRunningScript(script, target) {

        let isRunning = false
        const ramServers = NmapRamServers(ns)

        ramServers.forEach(server => {

            if (ns.isRunning(script, server, target, 0)) {
                isRunning = true
            }

        })
        return isRunning
    }

    function calculateWeakThreads(target) {

        // caculates number of threads for weak

        let serverSecurityMin = ns.getServerMinSecurityLevel(target) + 2
        let serverSecurityNow = ns.getServerSecurityLevel(target)
        let serverSecutityDiff = Math.ceil(serverSecurityNow - serverSecurityMin)
        let weakThreads = serverSecutityDiff / ns.weakenAnalyze(1)
        return weakThreads
    }

    function calculateGrowThreads(target) {

        // caculates number of threads for grow

        let serverMoneyAvailable = ns.getServerMoneyAvailable(target) ? ns.getServerMoneyAvailable(target) : 1
        let serverMoneyMax = ns.getServerMaxMoney(target)
        let mulitplier = serverMoneyMax / serverMoneyAvailable

        let growThreads = Math.ceil(ns.growthAnalyze(target, (mulitplier * ns.getPlayer().mults.hacking_grow)))
        return growThreads
    }

    function calculateHackThreads(target) {

        // caculates number of threads for hack

        let hackAmount = ns.getServerMaxMoney(target) * HACKPROCENT
        let hackThreads = Math.ceil(ns.hackAnalyzeThreads(target, hackAmount))
        return hackThreads
    }

    function distributeAcrossNetwork(script, threads, target) {

        //installs scripts on the purchased servers

        const ramServers = NmapRamServers(ns)

        for (let server of ramServers) {

            let ramAvailable = ns.getServerMaxRam(server) - ns.getServerUsedRam(server)
            let threadsAvailable = Math.floor(ramAvailable / ns.getScriptRam(script))

            if (threadsAvailable >= 1) {

                if (threadsAvailable > threads) {
                    ns.exec(script, server, threads, target, 0)
                    break
                }
 
                if (threadsAvailable < threads) {
                    ns.exec(script, server, threadsAvailable, target, 0)
                    threads -= threadsAvailable
                }
            }
        }
    }

    //\\ MAIN LOGICA
    NmapClear(ns)

    let availableRam = (ns.getServerMaxRam("home") - 100) - ns.getServerUsedRam("home")
    let availableThreads = Math.floor(availableRam / ns.getScriptRam(SCRIPT.w))
    availableThreads > 6000 ? ns.exec(SCRIPT.w, "home", 6000) : ns.exec(SCRIPT.w, "home", availableThreads)

    while (true) {

        await ns.sleep(1000)

        ns.clearLog()
        watchForNewServer(ns)

        let targets = NmapMoneyServers(ns)
        for (let target of targets) {

            if (ns.hackAnalyzeChance(target) > HACKCHANCE) {

                // check in network no script is running with this target
                // calculate threads
                // distribute across network

                if (weakCondition(target)) {

                    ns.print("WEAK - " + target)
                    if (!checkRunningScript(SCRIPT.weak, target)) {

                        let weakThreads = calculateWeakThreads(target)
                        distributeAcrossNetwork(SCRIPT.weak, weakThreads, target)

                    } else continue

                } else if (growCondition(target)) {

                    ns.print("GROW - " + target)
                    if (!checkRunningScript(SCRIPT.grow, target)) {

                        let growThreads = calculateGrowThreads(target)
                        distributeAcrossNetwork(SCRIPT.grow, growThreads, target)

                    } else continue

                } else {

                    ns.print("HACK - " + target)
                    if (!checkRunningScript(SCRIPT.hack, target)) {

                        let hackThreads = calculateHackThreads(target)
                        distributeAcrossNetwork(SCRIPT.hack, hackThreads, target)

                    } else continue

                }
            }
        }
    }
}
