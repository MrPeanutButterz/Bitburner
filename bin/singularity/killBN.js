import { settings } from "../../lib/settings"
import { scriptStart } from "/lib/settings.js"
import { installBackdoor } from "lib/network"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA
    const SETTINGS = settings(ns)
    let SERVER = "w0r1d_d43m0n"

    //\\ MAIN LOGICA
    ns.tprint("Final server required hacking skill: " + ns.getServer(SERVER).requiredHackingSkill)

    while (true) {
        await ns.sleep(1000)
        if (SETTINGS.killBitnode) {
            await installBackdoor(ns, SERVER)

        } else {
            ns.exit()
        }
    }
}