/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz
Proces: basic hacking script */

import { getScriptsPath, getSleepTime } from "./conf.js"
import { getServersWithRam, getServersWithMoney, getRootAccess, copyHackScripts } from "./lib.js"

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
    function execScript(thisServer) {

        //calculate threads
        let threads = Math.floor(ns.getServerMaxRam(thisServer) / ns.getScriptRam(script.serverExploid))

        if (threads >= 1) {

            ns.killall(thisServer)
            ns.exec(script.serverExploid, thisServer, threads, target)
        }
    }

    function hackThisServer() {

        let list = []
        let servers = getServersWithMoney(ns)

        for (let server of servers) {

            if (ns.hackAnalyzeChance(server) * 100 > 99) {
                list.push(server)
            }
        }

        if (list.length === 0) {
            return "n00dles"
        } else {
            return list[list.length - 1]
        }
    }

    //\\ MAIN LOGICA
    
    while (true) {
        await ns.sleep(speed.medium)
        
        let servers = getServersWithRam(ns)
        for (let server of servers) {
            
            if (target !== hackThisServer()) {

                ns.killall(server)
                
            } else if (!ns.hasRootAccess(server)) {
                
                getRootAccess(ns, server)
                
            } else if (!ns.isRunning(script.serverExploid, server, target)) {
                
                copyHackScripts(ns, server)
                execScript(server)
                
            }
        }
        target = hackThisServer()
    }
}