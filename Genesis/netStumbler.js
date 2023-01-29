/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz
Proces: basic hacking script */

import { getScriptsPath, getSleepTime } from "./Default/config.js"
import { getServersWithRam, getServersWithMoney, getRootAccess, copyHackScripts } from "./Default/library.js"

/** @param {NS} ns **/
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.toast("netStumbler online", "success", 2000)
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    let script = getScriptsPath(ns)
    let speed = getSleepTime(ns)
    let target = "n00dles"

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

    //\\ MAIN LOGICA
    while (true) {
        await ns.sleep(speed.medium)

        let thisHack = hackThisServer()
        let servers = getServersWithRam(ns)

        for (let server of servers) {

            getRootAccess(ns, server)
            copyHackScripts(ns, server)
            serverCheck(server, thisHack)

        }
    }
}