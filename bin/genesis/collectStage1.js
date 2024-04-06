import { NmapClear, watchForNewServer, NmapTotalRam, NmapRamServers } from "modules/network"
import { scriptPath } from "/modules/scripting"

/** @param {NS} ns */
export async function main(ns) {

    // get root access to all servers
    // find servers with free ram
    // copy hack scripts to severs with ram
    // start hacking servers n00dles
    // repeat process 

    //\\ SCRIPT SETTINGS
    ns.tprint("Active")
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    let TARGET = ns.args[0]
    const SCRIPT = scriptPath(ns)

    //\\ MAIN LOGICA
    if (TARGET === undefined) { TARGET = "n00dles" }
    NmapClear(ns)

    while (true) {

        await ns.sleep(1000)
        watchForNewServer(ns)
        let servers

        // todo: finetune switch point 
        if (NmapTotalRam(ns) > 2500 && ns.getServerMaxRam("home") >= 128) { ns.spawn("bin/genesis/collectStage2.js", { spawnDelay: 200 }) }

        servers = NmapRamServers(ns)
        servers.forEach(server => {

            // (get server max ram > subtract server used ram) > devide by script ram
            // run script on server with thread pointed at target

            if (ns.hasRootAccess(server) && !ns.isRunning(SCRIPT.gwh, server)) {

                let serverMaxRam = ns.getServerMaxRam(server)
                let serverUsedRam = ns.getServerUsedRam(server)
                let threads = Math.floor((serverMaxRam - serverUsedRam) / ns.getScriptRam(SCRIPT.gwh))

                if (threads >= 1 && threads < 9999999999) { 
                    ns.exec(SCRIPT.gwh, server, threads, TARGET) 
                }
            }
        })
    }
} 
