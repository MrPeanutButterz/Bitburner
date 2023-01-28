/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz 
Proces: keeps buying more home cores */

import { getSleepTime } from "./Default/library.js"

/** @param {NS} ns */
export async function main(ns) {

	//\\ SCRIPT SETTINGS
	ns.disableLog("ALL")

	//\\ GENERAL DATA
	var speed = getSleepTime(ns)

	//\\ MAIN LOGICA
	while (true) {
		await ns.sleep(speed.superSlow)
		ns.clearLog()

		if (ns.getPlayer().money > ns.singularity.getUpgradeHomeCoresCost()) {

			ns.singularity.upgradeHomeCores()
			ns.toast("Core upgrade", "info", speed.superSlow)

		} else {

			ns.print(Math.round(ns.getPlayer().money / ns.singularity.getUpgradeHomeCoresCost() * 100) + "% until core upgrade")

		}
	}
}