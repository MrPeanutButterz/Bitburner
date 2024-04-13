import { scriptStart, scriptPath } from "modules/scripting"
import { NmapClear, watchForNewServer, NmapTotalRam, NmapRamServers, NmapMoneyServers } from "modules/network"

/** @param {NS} ns */
export async function main(ns) {

    // get root access to all servers
    // find servers with free ram
    // copy hack scripts to severs with ram
    // start hacking 1 server

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA
    const SCRIPT = scriptPath(ns)
    const SECURITY_PATCH = 5
    const HACK_PROCENT = 0.5

    let TARGET = ns.args[0]
    if (TARGET === undefined) { TARGET = "n00dles" }

    //\\ FUNCTIONS
    function switchScript() {
        if (NmapTotalRam(ns) > 2500 && ns.getServerMaxRam("home") >= 128) {
            ns.spawn(SCRIPT.collectStage2, { spawnDelay: 200 })
        }
    }

    function growCondition(server) {
        return ns.getServerMoneyAvailable(server) !== ns.getServerMaxMoney(server)
    }

    function weakCondition(server) {
        return ns.getServerSecurityLevel(server) > ns.getServerMinSecurityLevel(server) + SECURITY_PATCH
    }

    function checkRunningScript(script, target) {

        let isRunning = false
        const ramServers = NmapRamServers(ns)
        ramServers.forEach(server => { if (ns.isRunning(script, server, target, 0)) { isRunning = true } })
        return isRunning
    }

    function calculateWeakThreads(server) {

        // caculates number of threads for weak
        let serverSecutityDiff = Math.ceil(ns.getServerSecurityLevel(server) - ns.getServerMinSecurityLevel(server) + 2)
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
        for (let server of NmapRamServers(ns)) {

            let ramAvailable = ns.getServerMaxRam(server) - ns.getServerUsedRam(server)
            let threadsAvailable = Math.floor(ramAvailable / ns.getScriptRam(script))

            if (threadsAvailable > 0 && threads > 0) {

                if (threadsAvailable > threads) {
                    ns.exec(script, server, threads, target, 0)
                    break

                } else {
                    ns.exec(script, server, threadsAvailable, target, 0)
                    threads -= threadsAvailable
                }
            }
        }
    }

    //\\ MAIN LOGICA
    NmapClear(ns)
    while (true) {

        await ns.sleep(1500)
        ns.clearLog()

        watchForNewServer(ns)
        switchScript()

        if (weakCondition(TARGET)) {

            ns.print("WEAK - " + TARGET)
            if (!checkRunningScript(SCRIPT.weak, TARGET)) {

                distributeAcrossNetwork(SCRIPT.weak, calculateWeakThreads(TARGET), TARGET)
            }

        } else if (growCondition(TARGET)) {

            ns.print("GROW - " + TARGET)
            if (!checkRunningScript(SCRIPT.grow, TARGET)) {

                distributeAcrossNetwork(SCRIPT.grow, calculateGrowThreads(TARGET), TARGET)
            }

        } else {

            ns.print("HACK - " + TARGET)
            if (!checkRunningScript(SCRIPT.hack, TARGET)) {

                distributeAcrossNetwork(SCRIPT.hack, calculateHackThreads(TARGET), TARGET)
            }

        }
    }
}
