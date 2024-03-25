import { NmapMoneyServers, NmapRamServers } from "modules/network"

/** @param {NS} ns */
export async function main(ns) {

    // find servers with money
    // find servers with free ram
    // get root access to all
    // copy script to severs with ram
    // start hacking servers with money
    // repeat process

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ GENERAL DATA
    let ramServers = NmapRamServers()
    let monServers = NmapMoneyServers()

    //\\ SCRIPT SPECIFIC FUNCTIONS
    //\\ MAIN LOGICA

} 