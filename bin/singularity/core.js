import { scriptStart } from "lib/scripting"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ MAIN LOGICA
    while (true) {
        await ns.sleep(1000)
        if (ns.getPlayer().money > ns.singularity.getUpgradeHomeCoresCost() &&
            ns.singularity.upgradeHomeCores()) {
            ns.tprint("Core upgraded")
        }
    }
}