/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz 
Proces: this script controls all scripts based on what is needed for next goal */

import { getScriptsPath } from "./Default/config.js"

/** @param {NS} ns */
export async function main(ns) {

	//\\ SCRIPT SETTINGS
	ns.disableLog("ALL")
	ns.clearLog()

	//\\ GENERAL DATA
	let script = getScriptsPath(ns)

	//\\ SCRIPT SPECIFIC FUNCTIONS

	//\\ MAIN LOGICA
	ns.run(script.buyRam, 1)
	ns.run(script.buyCore, 1)
	ns.run(script.buyHacknet, 1)
	ns.run(script.buyServers, 1)
	ns.run(script.buyPrograms, 1)

	ns.run(script.netStumbler, 1)
	ns.run(script.findFaction, 1)
}