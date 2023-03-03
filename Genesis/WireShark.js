/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz
Proces: find a server to continualy hack, hack all other servers */

import { getScriptsPath, getSleepTime } from "Default/config"
import { getServersWithMoney, getServersWithRam, getTotalNetRam, getUsableNetRam, copyHackScripts, getRootAccess } from "Default/library"

export async function main(ns) {

    //\\ SCRIPT SETTINGS
    //ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ GENERAL DATA
    const script = getScriptsPath(ns)
    const speed = getSleepTime(ns)

    //\\ SCRIPT SPECIFIC FUNCTIONS
    function tail() {

        //displays ram used/total

        ns.clearLog()
        ns.print("netRam: " + getUsableNetRam(ns) + " / " + getTotalNetRam(ns) + " Gb")
    }

    function getFilterServers() {

        //returns a list of servers to work on

        let servers = getServersWithMoney(ns)
        servers = servers.filter((server) => {
            return ns.hasRootAccess(server) && ns.hackAnalyzeChance(server) === 1
        })
        return servers
    }

    function getProfitableServer() {

        //returns most profitable server

        let servers = getFilterServers()
        if (servers.length === 0) { return "n00dles" }
        else { return servers[servers.length - 1] }
    }

    function getServersToDrain() {

        //returns servers to drain

        let servers = getFilterServers()
        servers.pop()
        return servers
    }

    //\\ MAIN LOGICA
    while (true) {
        await ns.sleep(1000)
        tail()

        let loopThisServer = getProfitableServer()
        let drainThisServers = getServersToDrain()

        //loop on this server

    }
}