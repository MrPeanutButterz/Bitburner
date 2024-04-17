import { NmapClear } from "lib/network"

/** @param {NS} ns */
export async function main(ns) {

    // kill all script in the network

    ns.tprint("Kill all scripts")
    ns.disableLog("ALL")
    ns.clearLog()
    NmapClear(ns)

}