import { scriptStart } from "lib/settings"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ MAIN LOGICA
    while (true) {
        await ns.sleep(1000)
        if (ns.getServerMoneyAvailable("home") > ns.singularity.getUpgradeHomeCoresCost() &&
            ns.singularity.upgradeHomeCores()) {
            ns.tprint("Upgrade")
        }
    }
}