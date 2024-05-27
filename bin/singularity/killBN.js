import { scriptStart } from "/lib/settings.js"
import { installBackdoor } from "lib/network"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA
    let SERVER = "w0r1d_d43m0n"

    //\\ MAIN LOGICA
    ns.tprint("Final server required hacking skill: " + ns.getServer(SERVER).requiredHackingSkill)

    while (true) {
        await ns.sleep(1000)
        await installBackdoor(ns, SERVER)
    }
}