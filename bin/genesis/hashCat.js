import { Nmap, getRootAccess, copyHackScripts } from "modules/network"

/** @param {NS} ns */
export async function main(ns) {

    // find servers with money
    // find servers with free ram
    // get root access to all servers
    // copy script (sequence) to severs with ram
    // start hacking servers with money
    // repeat process

    //\\ SCRIPT SETTINGS
    ns.tprint("HashCat active")
    ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ GENERAL DATA
    const hackScript = "bin/genesis/sequence.js"


    //\\ SCRIPT SPECIFIC FUNCTIONS
    //\\ MAIN LOGICA
    while (true) {
        await ns.sleep(1000)

        let servers = Nmap(ns)
        servers.forEach(server => {

            getRootAccess(ns, server)
            copyHackScripts(ns, server)

            if (ns.hasRootAccess(server) && ns.getServerMaxRam(server) > 0 && !ns.isRunning(hackScript, server)) {

                // get server max ram
                // subtract server used ram
                // devide by script ram
                // run script on server with thread

                let serverMaxRam = ns.getServerMaxRam(server)
                let serverUsedRam = ns.getServerUsedRam(server)
                let threads = Math.floor((serverMaxRam - serverUsedRam) / ns.getScriptRam(hackScript))

                if (threads != 0) { ns.exec(hackScript, server, threads, "n00dles") }
            }
        })
    }
} 