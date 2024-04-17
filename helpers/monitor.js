import { NmapMoneyServers, NmapFreeRam, NmapTotalRam } from "lib/network"
import { colorPrint } from "lib/scripting";

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ GENERAL DATA
    const hackChance = 0.5

    //\\ MAIN LOGICA
    while (true) {
        await ns.sleep(1000)
        ns.clearLog()
        ns.print("Net Ram: " + NmapFreeRam(ns) + " / " + NmapTotalRam(ns) + " GB")
        ns.print(" ")

        for (let server of NmapMoneyServers(ns)) {

            // green 80% chance
            // yellow 50% chance
            // red 0% chance

            // server name en hackchance 
            if (ns.hackAnalyzeChance(server) > 0.9) {
                colorPrint(ns, "green", server + " " + Math.round(ns.hackAnalyzeChance(server) * 100) + "%")

            } else if (ns.hackAnalyzeChance(server) > 0.7) {
                colorPrint(ns, "cyan", server + " " + Math.round(ns.hackAnalyzeChance(server) * 100) + "%")

            } else if (ns.hackAnalyzeChance(server) > 0.5) {
                colorPrint(ns, "yellow", server + " " + Math.round(ns.hackAnalyzeChance(server) * 100) + "%")

            } else {
                colorPrint(ns, "red", server + " " + Math.round(ns.hackAnalyzeChance(server) * 100) + "%")

            }

            // Grow Weak Hack stats
            colorPrint(ns, "white",
                "G" + Math.ceil(ns.getGrowTime(server) / 1000) + "s " +
                "W" + Math.ceil(ns.getWeakenTime(server) / 1000) + "s " +
                "H" + Math.ceil(ns.getHackTime(server) / 1000) + "s")

            // Money stats
            colorPrint(ns, "white",
                ns.formatNumber(Math.floor(ns.getServerMoneyAvailable(server))) +
                " / " +
                ((Math.floor(ns.getServerMoneyAvailable(server)) / Math.floor(ns.getServerMaxMoney(server))) * 100).toPrecision(3) + "%")

            // Security stats
            colorPrint(ns, "white",
                ns.getServerSecurityLevel(server).toPrecision(3) +
                " / " +
                ns.getServerMinSecurityLevel(server).toPrecision(3)
            )
        }
    }
}