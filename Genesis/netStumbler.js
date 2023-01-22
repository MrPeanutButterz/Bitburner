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
    function calculateThreads(thisServer) {
        
        //calculate threads
        let maxThreads = ns.getServerMaxRam(thisServer)
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
            if (!ns.hasRootAccess(servers[i])) {

                getRootAccess(ns, servers[i])
                copyHackScripts(ns, servers[i])
                
            } else {
                
                //execute hacking
                if (!ns.isRunning(scriptPath.serverExploid, servers[i], target)) {

                    ns.killall(servers[i])
                    ns.exec(scriptPath.serverExploid, servers[i], calculateThreads(servers[i]), target)
                }
            }
        }
    }
}