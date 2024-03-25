import { consoleLog, sleepTime } from "./lib/scripting-module"

export async function main(ns) {

    //\\ SCRIPT SETTINGS
    consoleLog(ns, "Core Auto Purchase Running")
    ns.disableLog("ALL")
    ns.clearLog()
    
    //\\ GENERAL DATA
    const speed = sleepTime(ns)

    //\\ MAIN LOGICA
    while (true) {
        await ns.sleep(speed.s1)
        ns.clearLog()

		if (ns.getPlayer().money > ns.singularity.getUpgradeHomeCoresCost()) {

			ns.singularity.upgradeHomeCores()
			ns.toast("Core upgrade", "success", speed.toast)

		} else {

            ns.print("Next core upgrade cost $" + Math.ceil(ns.singularity.getUpgradeHomeCoresCost()))
            ns.print(Math.round(ns.getPlayer().money / ns.singularity.getUpgradeHomeCoresCost() * 100) + "% of money is avaliable")
			
		}
    }
}