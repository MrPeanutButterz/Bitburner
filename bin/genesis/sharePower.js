import { NmapClear, NmapRamServers } from "modules/network"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.tprint("Active")
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    const SCRIPT = "helpers/share.js"

    //\\ MAIN LOGICA
    NmapClear(ns)
    NmapRamServers(ns).forEach(server => {

        if (ns.hasRootAccess(server)) {
            if (ns.scp(SCRIPT, server, "home")) {

                let ramAvailable = ns.getServerMaxRam(server) - ns.getServerUsedRam(server)
                let threadsAvailable = Math.floor(ramAvailable / ns.getScriptRam(SCRIPT))
                ns.exec(SCRIPT, server, threadsAvailable)

            } else {
                ns.tprint("unable to share on " + server)
            }
        }
    })
} 
