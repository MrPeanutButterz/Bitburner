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
	ns.run(script.buyHacknet, 1, 15, 100, 8, 1)
	ns.run(script.buyServers, 1)
	ns.run(script.buyPrograms, 1)
	ns.run(script.netStumbler, 1)
	ns.run(script.findFaction, 1)
	ns.run(script.metaSploit, 1)
}

/* 
if home ram is less than 2097152 Gb run it (2PetaBytes)
if home core is less than 8 cores run it

hacknet always run
servers always run 
programs always run 
netStumbler always run
findFaction always run
metaSploit always run 
*/