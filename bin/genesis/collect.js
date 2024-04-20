import { NmapClear, NmapRamServers, NmapMoneyServers, NmapTotalRam, NmapFreeRam, watchForNewServer } from "lib/network"
import { scriptPath, scriptStart, colorPrint } from "lib/scripting"

/** @param {NS} ns */
export async function main(ns) {

    /** 
     * Stage 1: operates based on minimal threads. 
     * It records necessary details such as hostname, required action (weak, grow, hack), and the threads needed for each action. 
     * Once the list is complete, it is sorted based on thread count, and then all entries in the network are installed. 
     * If any entry fails to install completely, the script halts and waits until the network is empty again before proceeding with the next installation round.
     * 
     * Stage2: operates based on probability. 
     * In this process, the script will iterate through the server list, and if there's more than an 80% probability, 
     * it will calculate the necessary steps to launch an attack on the server. This, in turn, is installed within the network. 
     * Unlike collectstage1, the script doesn't verify whether the installation was successful; thus, it adopts a somewhat more aggressive approach. 
     * It will never utilize more threads than necessary to keep the network available for running as many scripts as possible. 
     * Additionally, alongside focusing on the 80% probability, another script called pre_weak.js is initiated on the home server. 
     * This script assists in bringing servers that fall outside the probability threshold back within the 80% range.
    */

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA
    const SCRIPT = scriptPath(ns)
    const SECURITY_PATCH = 5, HACK_CHANCE = 0.8, HACK_PROCENT = 0.7

    let CHANCE_UPPERBAND = HACK_CHANCE, CHANCE_LOWERBAND = 0.79
    let PRE_WEAK_HAS_RUN = false

    //\\ FUNCTIONS 
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

        // creates treads based sorted list 
        // @return array of obj

        let list = []
        for (let server of NmapMoneyServers(ns)) {

            if (ns.getServerNumPortsRequired(server) === 0) {

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

    function checkRunningScript(script, target) {

        // check if script is running on any server
        // @return boolean

        let isRunning = false
        const ramServers = NmapRamServers(ns)
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

    function preWeak() {

        // runs pre weak of not runnning 

        if (!ns.scriptRunning(SCRIPT.preweak, "home") && !PRE_WEAK_HAS_RUN) {

            let availableRam = (ns.getServerMaxRam("home") / 1.5) - ns.getServerUsedRam("home")
            let availableThreads = Math.floor(availableRam / ns.getScriptRam(SCRIPT.preweak))

            if (availableThreads > 1 && ns.getServerMaxRam("home") > 1024) {
                availableThreads > 6000 ? ns.exec(SCRIPT.preweak, "home", 6000) : ns.exec(SCRIPT.preweak, "home", availableThreads)
                PRE_WEAK_HAS_RUN = true
            }
        }
    }

    function stage1() {

        // get thread sorted list of targets
        // when network is clear of scripts
        // apply action to list 
        // install incomplete ? restart : continue


        if (NmapFreeRam(ns) === NmapTotalRam(ns)) {

            ns.clearLog()
            ns.print("Stage 1\n\n")
            let targets = createServerList()

            for (let target of targets) {

                if (target.action === "weak") {

                    if (!distributeAcrossNetwork(SCRIPT.weak, target.threads, target.hostname)) {
                        ns.print("W... - " + target.hostname); break

                    } else { ns.print("WEAK - " + target.hostname) }

                } else if (target.action === "grow") {

                    if (!distributeAcrossNetwork(SCRIPT.grow, target.threads, target.hostname)) {
                        ns.print("G... - " + target.hostname); break

                    } else { ns.print("GROW - " + target.hostname) }

                } else if (target.action === "hack") {

                    if (!distributeAcrossNetwork(SCRIPT.hack, target.threads, target.hostname)) {
                        colorPrint(ns, "white", "H... - " + target.hostname); break

                    } else { colorPrint(ns, "white", "HACK - " + target.hostname) }
                }
            }
        }
    }

    function stage2() {

        // run pre weak once
        // get targets
        // hack chance > 80% ? action : single pre weak
        // script running ? run : continue

        preWeak()
        ns.clearLog()
        ns.print("Stage 2\n\n")

        let targets = NmapMoneyServers(ns)

        for (let target of targets) {

            if (ns.hackAnalyzeChance(target) > HACK_CHANCE) {

                if (weakCondition(target)) {

                    ns.print("WEAK - " + target)
                    if (!checkRunningScript(SCRIPT.weak, target)) {
                        distributeAcrossNetwork(SCRIPT.weak, calculateWeakThreads(target), target)
                    }

                } else if (growCondition(target)) {

                    ns.print("GROW - " + target)
                    if (!checkRunningScript(SCRIPT.grow, target)) {
                        distributeAcrossNetwork(SCRIPT.grow, calculateGrowThreads(target), target)
                    }

                } else {

                    colorPrint(ns, "white", "HACK - " + target)
                    if (!checkRunningScript(SCRIPT.hack, target)) {
                        distributeAcrossNetwork(SCRIPT.hack, calculateHackThreads(target), target)
                    }
                }
            }
        }
    }

    //\\ LOGIC
    NmapClear(ns)

    // run init grow for hack level
    distributeAcrossNetwork(SCRIPT.grow, 250, "n00dles")

    while (true) {

        // run stage 1 or 2 
        await ns.sleep(1000)
        watchForNewServer(ns)
        NmapTotalRam(ns) < 1e4 ? stage1() : stage2()
    }
}
