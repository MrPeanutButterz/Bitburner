/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    let servers = ns.getPurchasedServers()

    //\\ FUNCTIONS
    //\\ MAIN LOGIC
    servers.forEach(server => { 
        ns.killall(server)
        ns.deleteServer(server)
    })

}