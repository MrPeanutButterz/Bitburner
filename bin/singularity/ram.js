import { scriptStart } from "lib/scripting"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA   
    //\\ MAIN LOGICA
    while (true) {
        await ns.sleep(1000)
        ns.clearLog()

        if (ns.getPlayer().money > ns.singularity.getUpgradeHomeRamCost()) {

            ns.singularity.upgradeHomeRam()
            ns.toast("Ram upgrade", "success", 6000)

        } else {

            ns.print("Next ram upgrade cost $" + Math.ceil(ns.singularity.getUpgradeHomeRamCost()))
            ns.print(Math.round(ns.getPlayer().money / ns.singularity.getUpgradeHomeRamCost() * 100) + "% of money is avaliable")

        }
    }
}