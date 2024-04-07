import { getServerPath } from "modules/network"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    let server = ns.args[0]

    //\\ FUNCTIONS
    //\\ MAIN LOGIC
    let path = getServerPath(ns, server)
    path.forEach(node => { ns.singularity.connect(node) })

}