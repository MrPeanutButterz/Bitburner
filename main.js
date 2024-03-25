/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz 
Proces: this script controls all scripts based on what is needed for next goal */

//Hello World, its me.

import { getSleepTime, getScriptsPath } from "./Default/config.js"

/** @param {NS} ns */
export async function main(ns) {

	//\\ SCRIPT SETTINGS
	ns.disableLog("ALL")

	//\\ GENERAL DATA
	let script = getScriptsPath(ns)
	let speed = getSleepTime(ns)

	const scripts = [
		script.buyHacknet,
		script.buyPrograms,
		script.netStumbler,
		script.buyServers,
		script.buyRam,
		script.findFaction,
		script.buyCore
	]

	//\\ SCRIPT SPECIFIC FUNCTIONS
	//\\ MAIN LOGICA
	for (let i = 0; i < scripts.length;) {
		await ns.sleep(speed.medium)

		if (ns.getServerMaxRam("home") < 64) {

			if (!ns.scriptRunning(script.netStumbler, "home")) { ns.run(script.netStumbler, 1) }
			if (!ns.scriptRunning(script.buyPrograms, "home")) { ns.run(script.buyPrograms, 1) }
			if (!ns.scriptRunning(script.buyRam, "home")) { ns.run(script.buyRam, 1) }

		} else {

			if ((ns.getServerMaxRam("home") - ns.getServerUsedRam("home")) > ns.getScriptRam(scripts[i])) {

				if (!ns.scriptRunning(scripts[i], "home")) { ns.run(scripts[i], 1); i++ }

			} else {

				ns.clearLog()
				ns.print("awaiting ram for " + scripts[i])
			}
		}
	}
}
