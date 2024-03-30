import { Nmap, getRootAccess, copyHackScripts, NmapMoneyServers, NmapRamServers } from "modules/network"
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
    function watchForNewServer() {
        Nmap(ns).forEach(server => {
            getRootAccess(ns, server)
            copyHackScripts(ns, server)
        })
    }

    function growCondition(target) {
        return ns.getServerMoneyAvailable(target) !== ns.getServerMaxMoney(target)
    }

    function weakCondition(target) {
        return ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target) &&
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

    let homeRamAvailable = ns.getServerMaxRam("home") * 0.85 - ns.getServerUsedRam("home")
    let homeThreadsAvailable = Math.floor(homeRamAvailable / ns.getScriptRam(scripts.gw))
    ns.exec(scripts.gw, "home", homeThreadsAvailable, 0.5)

    while (true) {

        await ns.sleep(1000)

        ns.clearLog()
        watchForNewServer()

        let targets = NmapMoneyServers(ns)
        for (let target of targets) {

            if (ns.hackAnalyzeChance(target) > hackChance) { 

                if (growCondition(target)) {

                    // check in network no script is running with this target
                    // calculate balance to max in threads
                    // distribute across network

                    if (!checkRunningScript(scripts.grow, target)) {

                        let serverMoneyAvailable = ns.getServerMoneyAvailable(target)? ns.getServerMoneyAvailable(target) : 1
                        let serverMoneyMax = ns.getServerMaxMoney(target)
                        let mulitplier = serverMoneyMax / serverMoneyAvailable

                        let growThreads = Math.ceil(ns.growthAnalyze(target, (mulitplier * ns.getPlayer().mults.hacking_grow)))

                        distributeAcrossNetwork(scripts.grow, growThreads, target)
                        ns.print("GROW - " + target)

                    } else continue

                } else if (weakCondition(target)) {

                    // check in network no script is running with this target
                    // calculate current security level to minimal in threads
                    // distribute across network

                    if (!checkRunningScript(scripts.weak, target)) {

                        let effectSingleThread = ns.weakenAnalyze(1)

                        let serverSecurityMin = ns.getServerMinSecurityLevel(target)
                        let serverSecurityNow = ns.getServerSecurityLevel(target)

                        let serverSecutityDiff = Math.ceil(serverSecurityNow - serverSecurityMin)
                        let weakThreads = serverSecutityDiff / effectSingleThread

                        distributeAcrossNetwork(scripts.weak, weakThreads, target)

                    } else continue

                    ns.print("WEAK - " + target)

                } else {

                    // check in network no script is running with this target
                    // calculate hack amount to threads
                    // distribute across network

                    if (!checkRunningScript(scripts.hack, target)) {

                        let hackAmount = ns.getServerMaxMoney(target) * hackProcent
                        let hackThreads = Math.ceil(ns.hackAnalyzeThreads(target, hackAmount))

                        distributeAcrossNetwork(scripts.hack, hackThreads, target)

                    } else continue

                    ns.print("HACK - " + target)

                }
            }
        }
    }
}
