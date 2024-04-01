import { NmapTotalRam, NmapFreeRam } from "modules/network";

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    //\\ MAIN LOGIC
    ns.tprint(NmapFreeRam(ns) + " / " + NmapTotalRam(ns) + "gb")

}