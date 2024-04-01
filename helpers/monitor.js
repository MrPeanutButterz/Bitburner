import { NmapMoneyServers, NmapFreeRam, NmapTotalRam } from "modules/network"

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

        for (let server of NmapMoneyServers(ns)) {

            if (ns.hackAnalyzeChance(server) > hackChance) {

                ns.print(" ")

                ns.print(server + " " + Math.round(ns.hackAnalyzeChance(server) * 100) + "% ---- " +
                    "T^ " +
                    "G" + Math.ceil(ns.getGrowTime(server) / 1000) + "s " +
                    "W" + Math.ceil(ns.getWeakenTime(server) / 1000) + "s " +
                    "H" + Math.ceil(ns.getHackTime(server) / 1000) + "s")



                ns.print("M^ " + Math.floor(ns.getServerMoneyAvailable(server)) + " / " + ((Math.floor(ns.getServerMoneyAvailable(server)) / Math.floor(ns.getServerMaxMoney(server))) * 100).toPrecision(3) + "%  ----" +
                    "  S^ " + ns.getServerMinSecurityLevel(server).toPrecision(3) + " / " + ns.getServerSecurityLevel(server).toPrecision(3) + " / " + ns.getServerBaseSecurityLevel(server))

            }
        }
    }
}