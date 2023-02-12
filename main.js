/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz 
Proces: this script controls all scripts based on what is needed for next goal */

import { getSleepTime, getScriptsPath } from "./Default/config.js"

/** @param {NS} ns */
export async function main(ns) {

	//\\ SCRIPT SETTINGS
	ns.disableLog("ALL")

	//\\ GENERAL DATA
	let script = getScriptsPath(ns)
	let speed = getSleepTime(ns)

	//\\ SCRIPT SPECIFIC FUNCTIONS
	let scripts = [
		script.buyHacknet,
		script.buyPrograms,
		script.netStumbler,
		script.buyServers,
		script.buyRam,
		script.findFaction,
		script.metaSploit,
		script.buyCore
	]

	//\\ MAIN LOGICA
	for (let i = 0; i < scripts.length;) {

		if ((ns.getServerMaxRam("home") - ns.getServerUsedRam("home")) > ns.getScriptRam(scripts[i])) {
			ns.run(scripts[i], 1)
			i++
		} else {
			ns.clearLog()
			ns.print("awaiting ram for " + scripts[i])
			await ns.sleep(speed.sleeping)
		}
	}
}