/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz
Proces: basic hacking script */

import { getScriptsPath, getSleepTime } from "./conf.js"
import { getServersWithRam, getRootAccess, copyHackScripts } from "./lib.js"

/** @param {NS} ns **/
export async function main(ns) {

    /* make this script more dynamic, it only runs on n00dles!? */

    //\\ SCRIPT SETTINGS
    ns.toast("netStumbler online", "success", 2000)
    ns.disableLog("ALL")
    ns.clearLog()
    
    //\\ GENERAL DATA
    let scriptPath = getScriptsPath(ns)
    let speed = getSleepTime(ns)
    let target = ns.args[0]

    if (target == null) { target = "n00dles" }
    
    //\\ SCRIPT SPECIFIC FUNCTIONS
    function calculateThreads(server) {
        
        //calculate threads
        let maxThreads = ns.getServerMaxRam(server)
        let threads = Math.floor(maxThreads / ns.getScriptRam(scriptPath.serverExploid))
        return threads
    }
    
    //\\ MAIN LOGICA
    while (true) {
        await ns.sleep(speed.medium)
        
        //list all servers
        let servers = getServersWithRam(ns)

        for (var i = 0; i < servers.length; i++) {

            //get access en copy scripts
            var server = servers[i]
            
            if (!ns.hasRootAccess(server)) {

                getRootAccess(ns, server)
                copyHackScripts(ns, server)
                
            } else {
                
                //execute hacking
                if (!ns.isRunning(scriptPath.serverExploid, server, target)) {

                    ns.killall(server)
                    let threads = calculateThreads(server)
                    ns.exec(scriptPath.serverExploid, server, threads, target)
                }
            }
        }
    }
}