import { NmapRamServers, NmapClear } from "lib/network";

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    let script = ns.args[0]

    //\\ MAIN LOGIC
    NmapClear(ns)
    NmapRamServers(ns).forEach(server => {
        if (ns.rm(script, server)) {
            ns.tprint("Removed instance " + script + " on " + server)

        } else {
            ns.tprint("Script not present on " + server)
        }
    })

}