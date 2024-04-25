import { installBackdoor } from "lib/network"
import { scriptStart } from "/lib/scripting.js"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA
    let SERVER = "w0r1d_d43m0n"

    //\\ SCRIPT SPECIFIC FUNCTIONS

    //\\ MAIN LOGICA
    while (true) {

        await ns.sleep(1000)
        if (ns.getServer(SERVER).backdoorInstalled == false) {

            //connect via path
            installBackdoor(ns, SERVER)

        }
    }
}