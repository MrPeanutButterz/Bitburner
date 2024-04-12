import { Nmap, getServerPath } from "modules/network"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    let server = ns.args[0]

    //\\ FUNCTIONS
    //\\ MAIN LOGIC
    server === undefined ? Nmap(ns).forEach(server => ns.tprint(server)) : getServerPath(ns, server).forEach(node => { ns.singularity.connect(node) })

}