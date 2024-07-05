import { NmapFreeRam, NmapMoneyServers, NmapTotalRam, NmapRamServers, watchForNewServer } from "/lib/network"
import { scriptStart, scriptPath, getHomeReservedRam } from "/lib/settings"

/** @param {NS} ns */
export async function main(ns) {

    /**
    *  _____                          _       
    * |  ___|__  _ __ _ __ ___  _   _| | __ _ 
    * | |_ / _ \| '__| '_ ` _ \| | | | |/ _` |
    * |  _| (_) | |  | | | | | | |_| | | (_| |
    * |_|  \___/|_|  |_| |_| |_|\__,_|_|\__,_|
    * 
    * log info to console
    * create list of server with hacking stats
    * update all variables
    * 
    * stage 0 > hacking based on minimal home/network ram
    * stage 1 > hacking based on throughput 
    * stage 2 > hacking in timed packages
    */

    //\\ SCRIPT SETTINGS
    scriptStart(ns, true)

    //\\ GENERAL DATA
    const SCRIPT = scriptPath(ns)
    const STAGE = 0
    const SECURITY_PATCH = 5
    const HACK_CHANCE = 0.8
    const HACK_PROCENT = 0.7

    let TARGET_LIST = []
    let homeRamReq = 0
    let netRamReq = 0

    //\\ FUNCTIONS
    function info() {

        // log basic info
        ns.print(`Home ram \t ${ns.formatRam(ns.getServerMaxRam("home"))} / ${ns.formatRam(getHomeRam())}`)
        ns.print(`Netw ram \t ${ns.formatRam(NmapTotalRam(ns))} / ${ns.formatRam(NmapFreeRam(ns))}`)
        ns.print(`Stage \t\t ${STAGE}`)
        ns.print(`Home req \t ${ns.formatRam(homeRamReq)}`)
        ns.print(`Netw req \t ${ns.formatRam(netRamReq)}`)
        ns.print(`Targets \t ${TARGET_LIST.length}\n\n`)
    }

    function getHomeRam() {
        return ns.getServerMaxRam("home") - ns.getServerUsedRam("home") - getHomeReservedRam(ns)
    }

    function growCondition(server) {
        return ns.getServerMoneyAvailable(server) !== ns.getServerMaxMoney(server)
    }

    function weakCondition(server) {
        return ns.getServerSecurityLevel(server) > ns.getServerMinSecurityLevel(server) + SECURITY_PATCH
    }

    function calculateWeakThreads(server, cores) {

        // caculates number of threads for weak
        let serverSecutityDiff = Math.ceil(ns.getServerSecurityLevel(server) - ns.getServerMinSecurityLevel(server))
        return serverSecutityDiff / ns.weakenAnalyze(1, cores)
    }

    function calculateGrowThreads(server, cores) {

        // caculates number of threads for grow
        let serverMoneyAvailable = ns.getServerMoneyAvailable(server) > 0 ? ns.getServerMoneyAvailable(server) : 1
        let serverMoneyMax = ns.getServerMaxMoney(server)
        let mulitplier = (serverMoneyAvailable / serverMoneyMax) * 100
        return Math.ceil(ns.growthAnalyze(server, Math.ceil(100 - mulitplier)), cores)
    }

    function calculateHackThreads(server) {

        // caculates number of threads for hack
        return Math.ceil(ns.hackAnalyzeThreads(server, ns.getServerMaxMoney(server) * HACK_PROCENT))
    }

    function createTargetList() {

        // create list 
        TARGET_LIST = []
        homeRamReq = 0
        netRamReq = 0

        for (let server of NmapMoneyServers(ns)) {

            if (ns.hackAnalyzeChance(server) >= HACK_CHANCE) {

                if (weakCondition(server)) {

                    let th = calculateWeakThreads(server, ns.getServer("home").cpuCores)
                    let tn = calculateWeakThreads(server, 1)

                    homeRamReq += ns.getScriptRam(SCRIPT.weak) * th
                    netRamReq += ns.getScriptRam(SCRIPT.weak) * tn

                    TARGET_LIST.push({
                        name: server,
                        script: "weak",
                        threadsHome: th,
                        threadsNetw: tn,
                        ramHome: ns.getScriptRam(SCRIPT.weak) * th,
                        ramNetw: ns.getScriptRam(SCRIPT.weak) * tn,
                    })

                } else if (growCondition(server)) {

                    let th = calculateGrowThreads(server, ns.getServer("home").cpuCores)
                    let tn = calculateGrowThreads(server, 1)

                    homeRamReq += ns.getScriptRam(SCRIPT.grow) * th
                    netRamReq += ns.getScriptRam(SCRIPT.grow) * tn

                    TARGET_LIST.push({
                        name: server,
                        script: "grow",
                        threadsHome: th,
                        threadsNetw: tn,
                        ramHome: ns.getScriptRam(SCRIPT.grow) * th,
                        ramNetw: ns.getScriptRam(SCRIPT.grow) * tn,
                    })

                } else {

                    let th = calculateHackThreads(server, ns.getServer("home").cpuCores)
                    let tn = calculateHackThreads(server, 1)

                    homeRamReq += ns.getScriptRam(SCRIPT.hack) * th
                    netRamReq += ns.getScriptRam(SCRIPT.hack) * tn

                    TARGET_LIST.push({
                        name: server,
                        script: "hack",
                        threadsHome: th,
                        threadsNetw: tn,
                        ramHome: ns.getScriptRam(SCRIPT.hack) * th,
                        ramNetw: ns.getScriptRam(SCRIPT.hack) * tn,
                    })
                }
            }
        }

        TARGET_LIST.sort(function (a, b) { return a.threadsHome - b.threadsHome })
        // TARGET_LIST.forEach(server => { ns.print(server) })
    }

    function checkRunningScript(script, target) {

        // check if script is running on any server
        // @return boolean

        let isRunning = false
        const ramServers = NmapRamServers(ns)
        ramServers.push("home")
        ramServers.forEach(server => { if (ns.isRunning(script, server, target, 0)) { isRunning = true } })
        return isRunning
    }

    function distributeAcrossNetwork(script, threads, target) {

        // installs scripts on the purchased servers 
        // @return boolean complete install

        if (threads === 0) { threads = 5 }
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

    function installHome(target) {


        if (target.script === "weak") {

            if (!checkRunningScript(SCRIPT.weak, target.name)) {

                ns.print("H:WEAK " + target.name)
                ns.run(SCRIPT.weak, target.threadsHome, target.name, 0)
            }

        } else if (target.script === "grow") {

            if (!checkRunningScript(SCRIPT.grow, target.name)) {

                ns.print("H:GROW " + target.name)
                ns.run(SCRIPT.grow, target.threadsHome, target.name, 0)
            }

        } else {

            if (!checkRunningScript(SCRIPT.hack, target.name)) {

                ns.print("H:HACK " + target.name)
                ns.run(SCRIPT.hack, target.threadsHome, target.name, 0)
            }
        }
    }

    function installNetw(target) {


        if (target.script === "weak") {

            if (!checkRunningScript(SCRIPT.weak, target.name)) {

                ns.print("N:GROW " + target.name)
                distributeAcrossNetwork(SCRIPT.weak, target.threadsNetw, target.name)
            }

        } else if (target.script === "grow") {

            if (!checkRunningScript(SCRIPT.grow, target.name)) {

                ns.print("N:WEAK " + target.name)
                distributeAcrossNetwork(SCRIPT.grow, target.threadsNetw, target.name)
            }

        } else {

            if (!checkRunningScript(SCRIPT.hack, target.name)) {

                ns.print("N:HACK " + target.name)
                distributeAcrossNetwork(SCRIPT.hack, target.threadsNetw, target.name)
            }
        }
    }

    function installScripts() {

        if (TARGET_LIST.length === 0) {

            TARGET_LIST.push({
                name: "n00dles",
                script: "grow",
                threadsHome: 0,
                threadsNetw: calculateGrowThreads("n00dles", 1),
                ramHome: ns.getScriptRam(SCRIPT.grow) * calculateGrowThreads("n00dles", 1),
                ramNetw: ns.getScriptRam(SCRIPT.grow) * calculateGrowThreads("n00dles", 1),
            })
        }

        for (let target of TARGET_LIST) {

            if (getHomeRam() > target.ramHome) {

                installHome(target)

            } else {

                installNetw(target)

            }
        }
    }

    //\\ LOGIC
    while (true) {

        await ns.sleep(1000)
        ns.clearLog()

        info()
        watchForNewServer(ns)
        createTargetList()
        installScripts()

    }
}
