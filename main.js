/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz 
Proces: this script controls all scripts based on what is needed for next goal */

import { getScriptsPath, getSleepTime } from "./conf.js"

/** @param {NS} ns */
export async function main(ns) {

	//\\ SCRIPT SETTINGS
	ns.disableLog("ALL")
	ns.clearLog()

	//\\ GENERAL DATA
	let speed = getSleepTime(ns)
	let script = getScriptsPath(ns)
	
    //\\ SCRIPT SPECIFIC FUNCTIONS
	function basicScripts(thisScript) {

		//awaits free ram, then runs script

		let freeRam = ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
		let scriptRam = ns.getScriptRam(thisScript, "home")

		if (!ns.scriptRunning(thisScript, "home") && freeRam > scriptRam) {

			ns.tprint("Booting: " + thisScript)
			ns.run(thisScript, 1)
		}
	}
	
    //\\ MAIN LOGICA
	while(true) {
		
		if (ns.getServerMaxRam("home") < 128) {
			
			//hacking, programs, ram - 30GB
			basicScripts(script.netStumbler)
			basicScripts(script.buyPrograms)
			basicScripts(script.buyRam)
			
		} else {
			
			//hacking, programs, ram, faction 
			basicScripts(script.netStumbler)
			basicScripts(script.buyPrograms)
			basicScripts(script.buyRam)
			//faction.js
			
		}
		
		await ns.sleep(speed.superSlow)
	}

}