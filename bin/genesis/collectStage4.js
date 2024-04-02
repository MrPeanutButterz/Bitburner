import { scriptPath } from "modules/scripting"
import { getRootAccess, copyHackScripts, NmapMoneyServers, NmapRamServers, NmapTotalRam, NmapFreeRam, getUniqueIDs } from "modules/network"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.toast("netSparker online", "success", 2000)
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    let script = scriptPath(ns)

    //\\ SCRIPT SPECIFIC FUNCTIONS
    function displayStats(target, batchSize, version, action) {

        //display status in log

        ns.clearLog()
        ns.print("netRam: \t" + NmapFreeRam(ns) + "/" + NmapTotalRam(ns) + "Gb")
        ns.print("Target: \t" + target)
        ns.print("BatchSize: \t" + batchSize + "Gb")
        ns.print("Dynamic: \t" + version)
        ns.print("Action: \t" + action)

    }

    function getDynamicNetwork(netRam) {

        //returns (array) of settings for hacking

        if (netRam < 20000) {
            return { growth: 1.030, steal: 0.010, defence: 8, chance: 0.8, version: "lvl.1", }

        } else if (netRam < 22500) {
            return { growth: 1.063, steal: 0.017, defence: 7, chance: 0.8, version: "lvl.2", }

        } else if (netRam < 35000) {
            return { growth: 1.096, steal: 0.033, defence: 6, chance: 0.7, version: "lvl.3", }

        } else if (netRam < 50000) {
            return { growth: 1.129, steal: 0.049, defence: 5, chance: 0.7, version: "lvl.4", }

        } else if (netRam < 80000) {
            return { growth: 1.162, steal: 0.065, defence: 4, chance: 0.6, version: "lvl.5", }

        } else if (netRam < 150000) {
            return { growth: 1.195, steal: 0.081, defence: 4, chance: 0.6, version: "lvl.6", }

        } else {
            return { growth: 1.327, steal: 0.145, defence: 2, chance: 0.1, version: "lvl.7", }

        }
    }

    function getHackPackage(server) {

        //creates a package for hacking servers

        let dynamic = getDynamicNetwork(NmapTotalRam(ns))

        let fase1threads = Math.ceil((ns.getServerSecurityLevel(server) - ns.getServerMinSecurityLevel(server) + dynamic.defence) / ns.weakenAnalyze(1))
        let fase2threads = Math.ceil(ns.growthAnalyze(server, dynamic.growth, 1))
        let fase3threads = Math.ceil(ns.growthAnalyzeSecurity(fase2threads, server, 1) / ns.weakenAnalyze(1))
        let fase4threads = Math.ceil(ns.hackAnalyzeThreads(server, (ns.getServerMoneyAvailable(server) * dynamic.steal)))

        if (fase1threads < 1) { fase1threads = 1 }
        if (fase2threads < 1) { fase2threads = 1 }
        if (fase3threads < 1) { fase3threads = 1 }
        if (fase4threads < 1) { fase4threads = 1 }

        let fase1Start = 0
        let fase1End = Math.ceil(ns.getWeakenTime(server))
        let fase2Start = (fase1End + 500) - Math.ceil(ns.getGrowTime(server))
        let fase2End = fase2Start + Math.ceil(ns.getGrowTime(server))
        let fase3Start = (fase2End + 500) - Math.ceil(ns.getWeakenTime(server))
        let fase3End = fase3Start + Math.ceil(ns.getWeakenTime(server))
        let fase4Start = (fase3End + 500) - Math.ceil(ns.getHackTime(server))

        let fullPackageRam = (
            fase1threads * ns.getScriptRam(script.weak)) +
            (fase2threads * ns.getScriptRam(script.grow)) +
            (fase3threads * ns.getScriptRam(script.weak)) +
            (fase4threads * ns.getScriptRam(script.hack))

        let hackPackage = {
            threads1: fase1threads,
            threads2: fase2threads,
            threads3: fase3threads,
            threads4: fase4threads,
            timer1: fase1Start,
            timer2: fase2Start,
            timer3: fase3Start,
            timer4: fase4Start,
            size: fullPackageRam,
            id: getUniqueIDs(ns)
        }
        return hackPackage
    }

    function installPackage(host, script, ram, threads, timing, id) {

        //installs scripts in on the servers with ram (make sure there is space avaliable)

        let server = NmapRamServers(ns)

        for (let i = 0; i < server.length; i++) {

            getRootAccess(ns, server[i])

            let ramAvailable = ns.getServerMaxRam(server[i]) - ns.getServerUsedRam(server[i])
            let threadsAvailable = Math.floor(ramAvailable / ram)

            if (threadsAvailable >= 1) {

                if (threadsAvailable > threads) {
                    ns.exec(script, server[i], threads, host, timing, id)
                    break
                }

                if (threadsAvailable < threads) {
                    ns.exec(script, server[i], threadsAvailable, host, timing, id)
                    threads = threads - threadsAvailable
                }
            }
        }
    }

    //\\ MAIN LOGICA
    while (true) {

        await ns.sleep(1000)
        let servers = NmapMoneyServers(ns)

        for (let server of servers) {

            let batch = {}

            if (!ns.hasRootAccess(server)) {

                getRootAccess(ns, server)

            } else {

                copyHackScripts(ns, server)

                if (ns.fileExists("formulas.exe")) {

                    ns.toast("Update formulas in netSparker.js !", "error", 10000)

                    /*
                    weakenTime(server, player)					Calculate weaken time. 
                    growPercent(server, threads, player, cores)	Calculate the percent a server would grow to. (Ex: 3.0 would would grow the server to 300% of its current value.)
                    growTime(server, player)					Calculate grow time.
                    hackChance(server, player)					Calculate hack chance. (Ex: 0.25 would indicate a 25% chance of success.)
                    hackPercent(server, player)					Calculate hack percent for one thread. (Ex: 0.25 would steal 25% of the server's current value.)
                    hackTime(server, player)					Calculate hack time.
                    */

                } else {

                    batch = getHackPackage(server)

                }
            }

            let dynamic = getDynamicNetwork(ns, NmapTotalRam(ns))

            if (ns.hackAnalyzeChance(server) >= dynamic.chance &&
                ns.getHackingLevel() > ns.getServerRequiredHackingLevel(server) &&
                NmapTotalRam(ns) > batch.size) {

                while (true) {

                    if (NmapFreeRam(ns) < batch.size) {

                        await ns.sleep(200)
                        displayStats(server, Math.floor(batch.size), dynamic.version, "awaiting space")

                    } else {

                        displayStats(server, Math.floor(batch.size), dynamic.version, "installing")

                        installPackage(server, script.weak, ns.getScriptRam(script.weak), batch.threads1, batch.timer1, batch.id)
                        installPackage(server, script.grow, ns.getScriptRam(script.grow), batch.threads2, batch.timer2, batch.id)
                        installPackage(server, script.weak, ns.getScriptRam(script.weak), batch.threads3, batch.timer3, batch.id)
                        installPackage(server, script.hack, ns.getScriptRam(script.hack), batch.threads4, batch.timer4, batch.id)
                        break

                    }
                }
            }
        }
    }
}