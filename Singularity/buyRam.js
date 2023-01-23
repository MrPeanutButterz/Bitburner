/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz 
Proces: keeps buying more home ram */

import { getSleepTime } from "./conf.js"

/** @param {NS} ns */
export async function main(ns) {

	//\\ SCRIPT SETTINGS
	ns.toast("buyRam online", "success", 2000)
	ns.disableLog("ALL")

	//\\ GENERAL DATA
	var speed = getSleepTime(ns)

	//\\ MAIN LOGICA
	while (true) {
		await ns.sleep(speed.superSlow)
		ns.clearLog()

		if (ns.getPlayer().money > ns.singularity.getUpgradeHomeRamCost()) {

			ns.singularity.upgradeHomeRam()
			ns.toast("Ram upgrade", "info", speed.superSlow)

		} else {

			ns.print(Math.round(ns.getPlayer().money / ns.singularity.getUpgradeHomeRamCost() * 100) + "% until ram upgrade")
			
		}
	}
}