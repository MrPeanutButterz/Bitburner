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
        ns.print("NetRam: " + ns.formatRam(NmapFreeRam(ns)) + "/" + ns.formatRam(NmapTotalRam(ns)))
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

            // Grow Weak Hack stats | Security stats | Money
            colorPrint(ns, "white",
                "G" + Math.ceil(ns.getGrowTime(server) / 1000) + "s " +
                "W" + Math.ceil(ns.getWeakenTime(server) / 1000) + "s " +
                "H" + Math.ceil(ns.getHackTime(server) / 1000) + "s" + " | " +

                // Security
                (ns.getServerSecurityLevel(server) - ns.getServerMinSecurityLevel(server)).toPrecision(3) + " | " +

                // Money
                ns.formatNumber(Math.floor(ns.getServerMoneyAvailable(server))) +
                " / " +
                ((Math.floor(ns.getServerMoneyAvailable(server)) / Math.floor(ns.getServerMaxMoney(server))) * 100).toPrecision(3) + "%"
            )
        }
    }
}