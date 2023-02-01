/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz
Proces: basic hacking script */

import { getScriptsPath, getSleepTime } from "./Default/config.js"
import { getServersWithRam, getServersWithMoney, getRootAccess, copyHackScripts, getTotalNetRam } from "./Default/library.js"

/** @param {NS} ns **/
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.toast("netStumbler online", "success", 2000)
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    let script = getScriptsPath(ns)
    let speed = getSleepTime(ns)

    //\\ SCRIPT SPECIFIC FUNCTIONS
    function hackThisServer() {

        let list = []
        let servers = getServersWithMoney(ns)

        for (let server of servers) {

            if (ns.hackAnalyzeChance(server) * 100 > 99) {
                list.push(server)
            }
        }

        if (list.length === 0) { return "n00dles" } else { return list[list.length - 1] }

    }

    function serverCheck(thisServer, thisHack) {

        //checks server on script & ram 

        let avaliableRam = Math.floor(ns.getServerMaxRam(thisServer) - ns.getServerUsedRam(thisServer))
        let threads = avaliableRam / ns.getScriptRam(script.serverExploid)

        if (!ns.getRunningScript(script.serverExploid, thisServer, thisHack)) {

            ns.killall(thisServer)
            if (avaliableRam > ns.getScriptRam(script.serverExploid)) { ns.exec(script.serverExploid, thisServer, threads, thisHack) }

        } else {

            if (avaliableRam > ns.getScriptRam(script.serverExploid)) { ns.exec(script.serverExploid, thisServer, threads, thisHack) }

        }
    }

    function clearUpNetwork() {

        //cleans up the network of any scripts

        let netRamServers = getServersWithRam(ns)

        for (let netRamServ of netRamServers) {
            ns.killall(netRamServ)
        }
    }

    function switchToScript() {

        //awaits free ram, then runs script

        let freeRam = ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
        let scriptRam = ns.getScriptRam(script.netSparker)

        if (freeRam > scriptRam) {

            clearUpNetwork()
            ns.run(script.netSparker, 1)
            ns.exit()
        }

    }

    //\\ MAIN LOGICA
    while (true) {
        await ns.sleep(speed.medium)

        if (getTotalNetRam(ns) > 10000) { switchToScript() }

        let servers = getServersWithRam(ns)
        for (let server of servers) {

            getRootAccess(ns, server)
            copyHackScripts(ns, server)
            if (ns.hasRootAccess(server)) { serverCheck(server, hackThisServer()) }

        }
    }
}