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
    let script = getScriptsPath(ns)
    let speed = getSleepTime(ns)
    let target = ns.args[0]

    if (target == null) { target = "n00dles" }

    //\\ SCRIPT SPECIFIC FUNCTIONS
    function execScript(thisServer) {

        //calculate threads
        let threads = Math.floor(ns.getServerMaxRam(thisServer) / ns.getScriptRam(script.serverExploid))

        if (threads >= 1) {

            ns.killall(thisServer)
            ns.exec(script.serverExploid, thisServer, threads, target)
        }
    }

    //\\ MAIN LOGICA
    while (true) {
        await ns.sleep(speed.medium)

        //list all servers
        let servers = getServersWithRam(ns)
        for (let server of servers) {

            //get access en copy scripts en start hacking
            if (!ns.hasRootAccess(server)) {

                getRootAccess(ns, server)

            } else if (!ns.isRunning(script.serverExploid, server, target)) {

                copyHackScripts(ns, server)
                execScript(server)

            }
        }
    }
}