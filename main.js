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
	ns.run(script.buffer, 1, script.buyRam, script.buyHacknet, script.buyPrograms, script.netStumbler, script.buyServers, script.findFaction, script.metaSploit, script.buyCore)
}