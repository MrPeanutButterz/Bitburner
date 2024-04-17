import { scriptStart, scriptPath } from "lib/scripting"
import { NmapClear, watchForNewServer, NmapMoneyServers, NmapRamServers } from "lib/network"

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
    const HACK_CHANCE = 0.8
    const HACK_PROCENT = 0.8
    const SECURITY_PATCH = 3

    //\\ FUNCTIONS
    function growCondition(target) {
        return ns.getServerMoneyAvailable(target) !== ns.getServerMaxMoney(target)
    }

    function weakCondition(target) {
        return ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target) + SECURITY_PATCH &&
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

    function calculateWeakThreads(server) {

        // caculates number of threads for weak
        let serverSecutityDiff = Math.ceil(ns.getServerSecurityLevel(server) - ns.getServerMinSecurityLevel(server))
        return serverSecutityDiff / ns.weakenAnalyze(1)
    }

    function calculateGrowThreads(server) {

        // caculates number of threads for grow
        let serverMoneyAvailable = ns.getServerMoneyAvailable(server) > 0 ? ns.getServerMoneyAvailable(server) : 1
        let serverMoneyMax = ns.getServerMaxMoney(server)
        let mulitplier = (serverMoneyAvailable / serverMoneyMax) * 100
        return Math.ceil(ns.growthAnalyze(server, Math.ceil(100 - mulitplier)))
    }

    function calculateHackThreads(server) {

        // caculates number of threads for hack
        return Math.ceil(ns.hackAnalyzeThreads(server, ns.getServerMaxMoney(server) * HACK_PROCENT))
    }

    function distributeAcrossNetwork(script, threads, target) {

        //installs scripts on the purchased servers

        const ramServers = NmapRamServers(ns)

        for (let server of ramServers) {

            let ramAvailable = ns.getServerMaxRam(server) - ns.getServerUsedRam(server)
            let threadsAvailable = Math.floor(ramAvailable / ns.getScriptRam(script))

            if (threadsAvailable >= 1) {

                if (threadsAvailable > threads && threads > 0) {
                    ns.exec(script, server, threads, target, 0)
                    break
                }

                if (threadsAvailable < threads && threads > 0) {
                    ns.exec(script, server, threadsAvailable, target, 0)
                    threads -= threadsAvailable
                }
            }
        }
    }

    //\\ MAIN LOGICA
    NmapClear(ns)

    let availableRam = (ns.getServerMaxRam("home") / 1.5) - ns.getServerUsedRam("home")
    let availableThreads = Math.floor(availableRam / ns.getScriptRam(SCRIPT.preweak))
    if (availableThreads > 1 && ns.getServerMaxRam("home") > 1024) {
        availableThreads > 6000 ? ns.exec(SCRIPT.preweak, "home", 6000) : ns.exec(SCRIPT.preweak, "home", availableThreads)
    }

    while (true) {

        await ns.sleep(1000)

        ns.clearLog()
        watchForNewServer(ns)

        let targets = NmapMoneyServers(ns)
        for (let target of targets) {

            if (ns.hackAnalyzeChance(target) > HACK_CHANCE) {

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
