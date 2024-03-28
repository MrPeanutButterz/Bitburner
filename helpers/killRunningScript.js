import { NmapRamServers } from "modules/network";

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    let script = ns.args[0]

    //\\ MAIN LOGIC
    NmapRamServers(ns).forEach(server => {
        ns.rm(script, server)
    })

    ns.tprint("Removed instance " + script + " on every server...")
}