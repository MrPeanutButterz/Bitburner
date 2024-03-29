import { NmapMoneyServers, NmapTotalRam } from "modules/network"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ GENERAL DATA
    const hackChance = 0.7

    //\\ MAIN LOGICA
    while (true) {
        await ns.sleep(1000)
        ns.clearLog()
        ns.print("Total Net Ram: " + NmapTotalRam(ns) + "gb")

        for (let server of NmapMoneyServers(ns)) {

            if (ns.hackAnalyzeChance(server) > hackChance) {

                ns.print(" ")

                ns.print(server + " " + (ns.hackAnalyzeChance(server)).toPrecision(3) * 100 + "%")
                ns.print("Money " + Math.floor(ns.getServerMoneyAvailable(server)) + " / " + ((Math.floor(ns.getServerMoneyAvailable(server)) / Math.floor(ns.getServerMaxMoney(server))) * 100).toPrecision(3) + "%")
                ns.print("Secur " + ns.getServerMinSecurityLevel(server).toPrecision(3) + " / " + ns.getServerSecurityLevel(server).toPrecision(3))


                ns.print("G." + Math.ceil(ns.getGrowTime(server) / 1000) + "s / " + 
                "W." + Math.ceil(ns.getWeakenTime(server) / 1000) + "s " +
                "H." + Math.ceil(ns.getHackTime(server) / 1000) + "s")

            }
        }
    }
}