import { NmapTotalRam, NmapFreeRam } from "modules/network"

/** @param {NS} ns */
export async function main(ns) {

    // game starts with 8gb of ram

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ GENERAL DATA
    //\\ SCRIPT SPECIFIC FUNCTIONS
    //\\ MAIN LOGIC
    while (true) {

        await ns.sleep(1000)
        ns.clearLog()
        ns.print("Network free ram: \t" + Math.ceil(NmapFreeRam(ns) / NmapTotalRam(ns) * 100) + "%")
    }

}