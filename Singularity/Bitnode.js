/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz 
Proces: Destroys the bitnode bij installing a backdoor on the World Deamon server */

import { numOfPrograms, getRootAccess, getServerPath } from "./Default/library.js"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.toast("findFaction online", "success", 2000)
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    let server = "w0r1d_d43m0n"

    //\\ SCRIPT SPECIFIC FUNCTIONS

    //\\ MAIN LOGICA
    while (true) {
        await ns.sleep(1000)

        if (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(server)) {

            //awaits hack level
            ns.clearLog()
            ns.print("Hacking level: \t\t" + ns.getHackingLevel() + "/" + ns.getServerRequiredHackingLevel(server))

        } else if (numOfPrograms(ns) < ns.getServerNumPortsRequired(server)) {

            //awaits number of programs to breach
            ns.clearLog()
            ns.print("Awaiting programs to hack server")

        } else if (ns.hasRootAccess(server) == false) {

            //get root access
            ns.clearLog()
            ns.print("Analyzing root access")
            getRootAccess(ns)

        } else if (ns.getServer(server).backdoorInstalled == false) {

            //connect via path
            var path = getServerPath(ns, server)
            for (var i = 0; i < path.length; i++) { ns.singularity.connect(path[i]) }

            //install backdoor
            ns.clearLog()
            ns.print("installing backdoor on " + server)
            await ns.singularity.installBackdoor(server)

        }
    }
}