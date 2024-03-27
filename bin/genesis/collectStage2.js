import { Nmap, NmapClear, NmapMoneyServers, copyHackScripts, getRootAccess, NmapTotalRam } from "modules/network"

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
    const hackchance = 0.9
    let activeGrow = []
    let activeHack = []

    //\\ FUNCTIONS
    //\\ MAIN LOGICA
    //NmapClear(ns)
    while (true) {
        await ns.sleep(1000)

        let servers
        ns.tprint(NmapTotalRam(ns))

        servers = Nmap(ns)
        servers.forEach(server => {
            getRootAccess(ns, server)
            copyHackScripts(ns, server)
        })

        servers = NmapMoneyServers(ns)
        servers.forEach(server => {
            if (ns.hackAnalyzeChance(server) > hackchance) {

                // check if server is already calculated 
                // create object server
                // push to active grow

                if (!Boolean(activeGrow.find(o => o.name === server))) {
                    let balance = ns.getServerMoneyAvailable(server)
                    let goal = balance * 1.02
                    let tGrow = Math.ceil(ns.growthAnalyze(server, 2, 1))
                    let tHack = Math.ceil(ns.hackAnalyzeThreads(server, (goal - balance) / 2))
                    let time = Math.ceil(ns.getGrowTime(server))
                    activeGrow.push({ "name": server, "balance": balance, "goal": goal, "tGrow": tGrow, "tHack": tHack, "time": time / 1000 })
                }



            }
        })
        ns.tprint(activeGrow)

    }
}
