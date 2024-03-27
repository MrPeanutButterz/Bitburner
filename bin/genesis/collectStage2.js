import { Nmap, NmapClear, NmapMoneyServers, NmapRamServers, copyHackScripts, getRootAccess, NmapTotalRam } from "modules/network"
import { scriptPath } from "modules/scripting"

/** @param {NS} ns */
export async function main(ns) {

    // check for new server en copy hack scripts 
    // find money servers whit 90% hackchange
    // hack if server money grown by 1%
    // calculate grow threads for 2%, weaken wil be handled by sqn_gw.js script
    // execute on servers with ram 

    //\\ SCRIPT SETTINGS
    ns.tprint("Active")
    ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ GENERAL DATA
    const script = scriptPath(ns)
    const hackchance = 0.9
    let hackable = []

    //\\ FUNCTIONS
    //\\ MAIN LOGICA
    NmapClear(ns)
    ns.tprint(NmapTotalRam(ns))

    while (true) {
        await ns.sleep(1000)

        let servers

        servers = Nmap(ns)
        servers.forEach(server => {
            getRootAccess(ns, server)
            copyHackScripts(ns, server)
        })

        servers = NmapMoneyServers(ns)
        servers.forEach(server => {
            if (ns.hackAnalyzeChance(server) > hackchance) {

                ns.print(server)
                ns.print(ns.getServerMaxMoney(server))
                ns.print(ns.getServerMoneyAvailable(server))

                ns.print(ns.getServerMaxMoney(server) - ns.getServerMoneyAvailable(server))



            }
        })
    }
}
