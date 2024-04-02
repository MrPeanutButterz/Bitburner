import { NmapClear, watchForNewServer, NmapMoneyServers, NmapRamServers } from "modules/network"
import { scriptPath } from "modules/scripting"

/** @param {NS} ns */
export async function main(ns) {

    // run list money servers
    // if not working on it, grow money to 100%
    // if not working on it, weak security al low as posible
    // if not working on it, hack the server 

    // threads are efficient timing is not

    //\\ SCRIPT SETTINGS
    ns.tprint("Active")
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    const scripts = scriptPath(ns)
    const hackChance = 0.8
    const hackProcent = 0.8

    //\\ FUNCTIONS
    function growCondition(target) {
        return ns.getServerMoneyAvailable(target) !== ns.getServerMaxMoney(target)
    }

    function weakCondition(target) {
        return ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target) + 2 &&
            ns.getServerMoneyAvailable(target) === ns.getServerMaxMoney(target)
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

    while (true) {

        await ns.sleep(1000)

        ns.clearLog()
        watchForNewServer(ns)

        let targets = NmapMoneyServers(ns)
        for (let target of targets) {

            if (ns.hackAnalyzeChance(target) > hackChance) {

                if (growCondition(target)) {

                    // check in network no script is running with this target
                    // calculate balance to max in threads
                    // distribute across network
                    ns.print("GROW - " + target)

                    if (!checkRunningScript(scripts.grow, target)) {

                        let serverMoneyAvailable = ns.getServerMoneyAvailable(target) ? ns.getServerMoneyAvailable(target) : 1
                        let serverMoneyMax = ns.getServerMaxMoney(target)
                        let mulitplier = serverMoneyMax / serverMoneyAvailable

                        let growThreads = Math.ceil(ns.growthAnalyze(target, (mulitplier * ns.getPlayer().mults.hacking_grow)))


                        distributeAcrossNetwork(scripts.grow, growThreads, target)

                    } else continue

                } else if (weakCondition(target)) {

                    // check in network no script is running with this target
                    // calculate current security level to minimal in threads
                    // distribute across network
                    ns.print("WEAK - " + target)

                    if (!checkRunningScript(scripts.weak, target)) {

                        let serverSecurityMin = Math.ceil(ns.getServerMinSecurityLevel(target) + 2)
                        let serverSecurityNow = Math.ceil(ns.getServerSecurityLevel(target))
                        let serverSecutityDiff = Math.ceil(serverSecurityNow - serverSecurityMin)

                        let effectSingleThread = ns.weakenAnalyze(1)
                        let weakThreads = serverSecutityDiff / effectSingleThread

                        distributeAcrossNetwork(scripts.weak, weakThreads, target)

                    } else continue

                } else {

                    // check in network no script is running with this target
                    // calculate hack amount to threads
                    // distribute across network
                    ns.print("HACK - " + target)

                    if (!checkRunningScript(scripts.hack, target)) {

                        let hackAmount = ns.getServerMaxMoney(target) * hackProcent
                        let hackThreads = Math.ceil(ns.hackAnalyzeThreads(target, hackAmount))

                        distributeAcrossNetwork(scripts.hack, hackThreads, target)

                    } else continue

                }
            }
        }
    }
}
