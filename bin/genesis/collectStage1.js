import { Nmap, NmapClear, getRootAccess, copyHackScripts, NmapRamServers } from "modules/network"
import { scriptPath } from "/modules/scripting"

/** @param {NS} ns */
export async function main(ns) {

    // get root access to all servers
    // find servers with free ram
    // copy script (sequence) to severs with ram
    // start hacking servers n00dles
    // repeat process 

    //\\ SCRIPT SETTINGS
    ns.tprint("Active")
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    let target = ns.args[0]
    const hackScript = scriptPath(ns).gwh

    //\\ MAIN LOGICA
    if (target === undefined) { target = "n00dles" }
    NmapClear(ns)

    while (true) {
        await ns.sleep(1000)
        let servers

        // todo: if net ram is more than x, kill script en go to collectStage2 for more profit

        servers = Nmap(ns)
        servers.forEach(server => {
            getRootAccess(ns, server)
            copyHackScripts(ns, server)
        })

        servers = NmapRamServers(ns)
        servers.forEach(server => {

            // (get server max ram > subtract server used ram) > devide by script ram
            // run script on server with thread pointed at target

            if (ns.hasRootAccess(server) && !ns.isRunning(hackScript, server)) {
                let serverMaxRam = ns.getServerMaxRam(server)
                let serverUsedRam = ns.getServerUsedRam(server)
                let threads = Math.floor((serverMaxRam - serverUsedRam) / ns.getScriptRam(hackScript))
                if (threads >= 1 && threads < 9999999999) { ns.exec(hackScript, server, threads, target) }
            }
        })
    }
} 
