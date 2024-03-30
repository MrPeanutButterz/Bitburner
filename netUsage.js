import { NmapRamServers, NmapTotalRam, NmapFreeRam } from "modules/network"

/** @param {NS} ns */
export async function main(ns) {

    // game starts with 8gb of ram

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ GENERAL DATA
    //\\ SCRIPT SPECIFIC FUNCTIONS
    function fr() {
        //returns the usable ram in the network

        let ram = 0
        let servers = NmapRamServers(ns)


        for (let server of servers) {
            if (ns.hasRootAccess(server)) {
                let free = ns.getServerMaxRam(server) - ns.getServerUsedRam(server)

                ram += free


                ns.tprint(server + " " + free)
            }
        }
        return Math.floor(ram)
    }

    //\\ MAIN LOGIC
    while (true) {

        await ns.sleep(1000)
        ns.clearLog()
        ns.print("Network free: \t" + fr())
        ns.print("Network total: \t" + Math.ceil(NmapTotalRam(ns)))
        ns.print("Network usage: \t" + Math.ceil(NmapFreeRam(ns) / NmapTotalRam(ns) * 100) + "%")
    }

}