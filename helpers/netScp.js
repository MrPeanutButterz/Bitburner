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
        if (ns.scp(script, server, "home")) {
            ns.tprint("Copied instance " + script + " on " + server)

        } else {
            ns.tprint("Unable to copie to " + server)
        }
    })

}