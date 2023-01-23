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
	function runScript(thisScript) {

		//awaits free ram, then runs script

		let freeRam = ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
		let scriptRam = ns.getScriptRam(thisScript, "home")

		if (!ns.scriptRunning(thisScript, "home") && freeRam > scriptRam) {

			ns.tprint("Run: " + thisScript)
			ns.run(thisScript, 1)
		}
	}

	function basicPrograms() {
		var numberOfPrograms = 0
		if (ns.fileExists("BruteSSH.exe", "home") == true) { numberOfPrograms++ }
		if (ns.fileExists("FTPCrack.exe", "home") == true) { numberOfPrograms++ }
		if (ns.fileExists("RelaySMTP.exe", "home") == true) { numberOfPrograms++ }
		if (ns.fileExists("HTTPWorm.exe", "home") == true) { numberOfPrograms++ }
		if (ns.fileExists("SQLInject.exe", "home") == true) { numberOfPrograms++ }
		return numberOfPrograms
	}

	//\\ MAIN LOGICA
	while (true) {

		if (ns.getServerMaxRam("home") < 128) {

			//hacking, programs, ram - 30GB
			runScript(script.buyRam)
			runScript(script.netStumbler)

			if (basicPrograms < 5) { runScript(script.buyPrograms) }

		} else {

			//hacking, programs, ram, faction 
			runScript(script.buyRam)
			runScript(script.netStumbler)

			if (basicPrograms < 5) { runScript(script.buyPrograms) }
			//faction.js

		}

		await ns.sleep(speed.superSlow)
	}

}