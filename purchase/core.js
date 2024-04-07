/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.tprint("Active")
    ns.disableLog("ALL")
    ns.clearLog()
    
    //\\ GENERAL DATA
    //\\ MAIN LOGICA
    while (true) {
        await ns.sleep(1000)
        ns.clearLog()

		if (ns.getPlayer().money > ns.singularity.getUpgradeHomeCoresCost()) {

			ns.singularity.upgradeHomeCores()
			ns.toast("Core upgrade", "success", 6000)

		} else {

            ns.print("Next core upgrade cost $" + Math.ceil(ns.singularity.getUpgradeHomeCoresCost()))
            ns.print(Math.round(ns.getPlayer().money / ns.singularity.getUpgradeHomeCoresCost() * 100) + "% of money is avaliable")
			
		}
    }
}