/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz 
Proces: this script controls all scripts based on what is needed for next goal */

import { getSleepTime, getScriptsPath } from "./Default/config.js"
import { getProgramCount, getTotalNetRam } from "./Default/library.js"

/** @param {NS} ns */
export async function main(ns) {

	//\\ SCRIPT SETTINGS
	ns.disableLog("ALL")
	ns.clearLog()

	//\\ GENERAL DATA
	let speed = getSleepTime(ns)
	let script = getScriptsPath(ns)

	let factionScript = true
	let hackScript = true

	//\\ SCRIPT SPECIFIC FUNCTIONS
	function runScript(thisScript) {

		//awaits free ram, then runs script

		let freeRam = ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
		let scriptRam = ns.getScriptRam(thisScript)

		if (!ns.scriptRunning(thisScript, "home") && freeRam > scriptRam) {

			ns.run(thisScript, 1)
		}
	}

	function basicPrograms() {

		//checks if the basic programs are available

		if (getProgramCount(ns) < 5) {

			runScript(script.buyPrograms)
		}
	}

	function Genesis() {

		//awaits free ram, then runs hack scripts

		let freeRam = ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
		let scriptRam = ns.getScriptRam(script.findFaction, "home")

		if (freeRam > scriptRam && hackScript) {

			if (!ns.scriptRunning(script.netStumbler, "home") || !ns.scriptRunning(script.netSparker, "home")) {

				ns.run(script.netStumbler, 1)
				hackScript = false
			}
		}
	}

	function singularity() {

		//awaits free ram, then runs faction script

		let freeRam = ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
		let scriptRam = ns.getScriptRam(script.findFaction, "home")

		if (freeRam > scriptRam && factionScript) {

			if (!ns.scriptRunning(script.findFaction, "home") || !ns.scriptRunning(script.requirements, "home") || !ns.scriptRunning(script.reputation, "home") || !ns.scriptRunning(script.installation, "home")) {

				ns.run(script.findFaction, 1)
				factionScript = false
			}
		}
	}

	//\\ MAIN LOGICA
	while (true) {

		if (ns.getServerMaxRam("home") < 128) {

			runScript(script.buyRam)
			basicPrograms()

			Genesis()

		} else {

			runScript(script.buyRam)
			basicPrograms()

			Genesis()
			singularity()

		}

		await ns.sleep(speed.superSlow)
	}

}