
import { scriptPath } from "modules/scripting"
import { NmapClear, watchForNewServer, NmapFreeRam, NmapTotalRam, NmapRamServers, NmapMoneyServers } from "modules/network"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ FLAGS & DATA
    const SCRIPT = scriptPath(ns)
    const flags = ns.flags([
        ["go", false]
    ])

    const arg = ns.args[0]
    ns.tprint(arg + "  GGGGGGG" )

    //\\ FUNCTIONS
    //\\ MAIN LOGICA
    if (flags.go) {

        ns.tprint("WORKS ")

    } else {

        ns.tprint("NOPE ")
    }

}
