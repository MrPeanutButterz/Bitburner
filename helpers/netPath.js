import { getServerPath } from "modules/network"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ GENERAL DATA
    let server = ns.args[0]

    //\\ FUNCTIONS
    //\\ MAIN LOGIC
    ns.tprint(getServerPath(ns, server))

}