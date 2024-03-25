import { NmapMoneyServers, NmapRamServers } from "modules/network"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ GENERAL DATA
    //\\ SCRIPT SPECIFIC FUNCTIONS
    //\\ MAIN LOGICA

    // list servers with ram
    // get root if not
    // push scripts
    const ramServers = NmapRamServers(ns)
    for (let server of ramServers) {
        if (!ns.hasRootAccess(server)) {
            getRootAccess(ns, server)
        } else {
            copyHackScripts(ns, server)
        }
    }

    // list servers with money
    // focus 70% grow/weak on one server 
    // focus 30% grow/weak at random 
    // hack from home
} 