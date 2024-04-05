import { watchForNewServer, NmapMoneyServers, NmapRamServers } from "modules/network"
import { scriptPath } from "modules/scripting"

/** @param {NS} ns */
export async function main(ns) {

    /* 
    run list money servers
    if not working on it, grow money to 100%
    if not working on it, weak security al low as posible
    if not working on it, hack the server 
    dont loop to next target if threads are incompleet
    */

    //\\ SCRIPT SETTINGS\
    ns.tprint("Active")
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    const SCRIPTS = scriptPath(ns)
    const HACKCHANCE = 0.8
    const HACKPROCENT = 0.7

    //\\ FUNCTIONS
    function growCondition(target) {
        return ns.getServerMoneyAvailable(target) !== ns.getServerMaxMoney(target)
    }

    function weakCondition(target) {
        return ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target) + 2 &&
            ns.getServerMoneyAvailable(target) !== ns.getServerMaxMoney(target)
    }

    function sortMoneyServerByThreads() {

        let sort = []
        let unsort = NmapMoneyServers(ns)

        unsort.forEach(server => {
            sort.push({ server: server, threads: Math.ceil(ns.growthAnalyze(server, 2)) })
        })

        sort.sort(function (a, b) {
            return a.threads - b.threads
        })

        return sort
    }

    function calculateWeakThreads(target) {

        // caculates number of threads for weak

        let serverSecurityMin = Math.ceil(ns.getServerMinSecurityLevel(target) + 2)
        let serverSecurityNow = Math.ceil(ns.getServerSecurityLevel(target))
        let serverSecutityDiff = Math.ceil(serverSecurityNow - serverSecurityMin)

        let effectSingleThread = ns.weakenAnalyze(1)
        let weakThreads = serverSecutityDiff / effectSingleThread
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

        if (threads > 0) { return false } else { return true }
    }


    //\\ MAIN LOGIC
    while (true) {

        await ns.sleep(50)
        ns.clearLog()

        let list = sortMoneyServerByThreads()

        for (let i = 0; i < list.length;) {

            await ns.sleep(50)
            watchForNewServer(ns)
            let target = list[i]

            if (ns.hackAnalyzeChance(target) > HACKCHANCE) {

                // check in network no script is running with this target
                // calculate threads
                // distribute across network

                if (weakCondition(target)) {

                    ns.print("WEAK - " + target)
                    if (!checkRunningScript(SCRIPTS.weak, target)) {

                        let weakThreads = calculateWeakThreads(target)
                        if (distributeAcrossNetwork(SCRIPTS.weak, weakThreads, target)) {
                            i++
                        }

                    }

                } else if (growCondition(target)) {

                    ns.print("GROW - " + target)
                    if (!checkRunningScript(SCRIPTS.grow, target)) {

                        let growThreads = calculateGrowThreads(target)
                        if (distributeAcrossNetwork(SCRIPTS.grow, growThreads, target)) {
                            i++
                        }

                    }

                } else {

                    ns.print("HACK - " + target)
                    if (!checkRunningScript(SCRIPTS.hack, target)) {

                        let hackThreads = calculateHackThreads(target)
                        if (distributeAcrossNetwork(SCRIPTS.hack, hackThreads, target)) {
                            i++
                        }

                    }

                }
            }


        }
    }
}
