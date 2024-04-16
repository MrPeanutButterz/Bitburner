import { scriptStart, scriptPath } from "modules/scripting"
import { NmapClear, watchForNewServer, NmapFreeRam, NmapTotalRam, NmapRamServers, NmapMoneyServers } from "modules/network"

/** @param {NS} ns */
export async function main(ns) {

    // get root access to all servers
    // find servers with free ram
    // copy hack scripts to severs with ram
    // start hacking 1 server
    // any ram in the network left can be spend on server 2

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA
    const SCRIPT = scriptPath(ns)
    const SECURITY_PATCH = 3
    const HACK_PROCENT = 0.7

    //\\ FUNCTIONS
    function switchScript() {
        if (NmapTotalRam(ns) > 1e4 && ns.getServerMaxRam("home") >= 128) {
            ns.closeTail()
            ns.spawn(SCRIPT.collectStage2, { spawnDelay: 200 })
        }
    }

    function growCondition(server) {
        return ns.getServerMoneyAvailable(server) !== ns.getServerMaxMoney(server)
    }

    function weakCondition(server) {
        return ns.getServerSecurityLevel(server) > ns.getServerMinSecurityLevel(server) + SECURITY_PATCH
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

    function createServerList() {

        let list = []
        for (let server of NmapMoneyServers(ns)) {

            if (ns.getServerNumPortsRequired(server) === 0 && ns.hackAnalyzeChance(server) > 0.95) {

                if (weakCondition(server)) {
                    list.push({ hostname: server, action: "weak", threads: calculateWeakThreads(server) })

                } else if (growCondition(server)) {
                    list.push({ hostname: server, action: "grow", threads: calculateGrowThreads(server) })

                } else {
                    list.push({ hostname: server, action: "hack", threads: calculateHackThreads(server) })
                }
            }
        }
        list.sort(function (a, b) { return a.threads - b.threads })
        return list
    }

    function distributeAcrossNetwork(script, threads, target) {

        //installs scripts on the purchased servers

        let servers = NmapRamServers(ns)

        for (let server of servers) {

            if (threads > 0 && ns.hasRootAccess(server)) {

                let ramAvailable = ns.getServerMaxRam(server) - ns.getServerUsedRam(server)
                let threadsAvailable = Math.floor(ramAvailable / ns.getScriptRam(script))

                if (threadsAvailable > 0) {

                    if (threadsAvailable > threads) {

                        ns.exec(script, server, threads, target, 0)
                        threads -= threads

                    } else {

                        ns.exec(script, server, threadsAvailable, target, 0)
                        threads -= threadsAvailable
                    }
                }
            }
        }
        return threads === 0
    }

    //\\ MAIN LOGICA
    NmapClear(ns)
    distributeAcrossNetwork(SCRIPT.weak, 250, "n00dles")

    while (true) {

        let list = []
        switchScript()
        await ns.sleep(1000)
        watchForNewServer(ns)

        if (NmapFreeRam(ns) === NmapTotalRam(ns)) {
            await ns.sleep(500)

            list = createServerList()
            ns.clearLog()

            for (let i of list) {

                if (i.action === "weak") {

                    if (!distributeAcrossNetwork(SCRIPT.weak, i.threads, i.hostname)) {
                        ns.print("W... - " + i.hostname)
                        break

                    } else {
                        ns.print("WEAK - " + i.hostname)
                    }

                } else if (i.action === "grow") {

                    if (!distributeAcrossNetwork(SCRIPT.grow, i.threads, i.hostname)) {
                        ns.print("G... - " + i.hostname)
                        break

                    } else {
                        ns.print("GROW - " + i.hostname)
                    }

                } else if (i.action === "hack") {

                    if (!distributeAcrossNetwork(SCRIPT.hack, i.threads, i.hostname)) {
                        ns.print("H... - " + i.hostname)
                        break

                    } else {
                        ns.print("HACK - " + i.hostname)
                    }
                }

            }
        }
    }
}
