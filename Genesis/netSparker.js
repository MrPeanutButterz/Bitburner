/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz 
Proces: finds servers with money, creates a timed package to hack, and installs it on servers that have ram. */

import { getScriptsPath, getSleepTime, getDynamicNetwork } from "./Default/config.js"
import { getRootAccess, copyHackScripts, getServersWithMoney, getTotalNetRam, getUsableNetRam, getUniqueID, installPackage, getStockAccounts } from "./Default/library.js"


/** @param {NS} ns */
export async function main(ns) {

	//\\ SCRIPT SETTINGS
	ns.toast("netSparker online", "success", 2000)
	ns.disableLog("ALL")
	ns.clearLog()

	//\\ GENERAL DATA
	let speed = getSleepTime(ns)
	let script = getScriptsPath(ns)

	//\\ SCRIPT SPECIFIC FUNCTIONS
	function displayStats(target, batchSize, version, action) {

		//display status in log

		ns.clearLog()
		ns.print("netRam: \t" + getUsableNetRam(ns) + "/" + getTotalNetRam(ns) + "Gb")
		ns.print("Target: \t" + target)
		ns.print("BatchSize: \t" + batchSize + "Gb")
		ns.print("Dynamic: \t" + version)
		ns.print("Action: \t" + action)

	}

	function getHackPackage(server) {

		//creates a package for hacking servers

		let dynamic = getDynamicNetwork(ns, getTotalNetRam(ns))

		let fase1threads = Math.ceil((ns.getServerSecurityLevel(server) - ns.getServerMinSecurityLevel(server) + dynamic.defence) / ns.weakenAnalyze(1))
		let fase2threads = Math.ceil(ns.growthAnalyze(server, dynamic.growth, 1))
		let fase3threads = Math.ceil(ns.growthAnalyzeSecurity(fase2threads, server, 1) / ns.weakenAnalyze(1))
		let fase4threads = Math.ceil(ns.hackAnalyzeThreads(server, (ns.getServerMoneyAvailable(server) * dynamic.steal)))

		if (fase1threads < 1) { fase1threads = 1 }
		if (fase2threads < 1) { fase2threads = 1 }
		if (fase3threads < 1) { fase3threads = 1 }
		if (fase4threads < 1) { fase4threads = 1 }

		let fase1Start = 0
		let fase1End = Math.ceil(ns.getWeakenTime(server))
		let fase2Start = (fase1End + 500) - Math.ceil(ns.getGrowTime(server))
		let fase2End = fase2Start + Math.ceil(ns.getGrowTime(server))
		let fase3Start = (fase2End + 500) - Math.ceil(ns.getWeakenTime(server))
		let fase3End = fase3Start + Math.ceil(ns.getWeakenTime(server))
		let fase4Start = (fase3End + 500) - Math.ceil(ns.getHackTime(server))

		let fullPackageRam = (
			fase1threads * ns.getScriptRam(script.serverWeak)) +
			(fase2threads * ns.getScriptRam(script.serverGrow)) +
			(fase3threads * ns.getScriptRam(script.serverWeak)) +
			(fase4threads * ns.getScriptRam(script.serverHack))

		let hackPackage = {
			threads1: fase1threads,
			threads2: fase2threads,
			threads3: fase3threads,
			threads4: fase4threads,
			timer1: fase1Start,
			timer2: fase2Start,
			timer3: fase3Start,
			timer4: fase4Start,
			size: fullPackageRam,
			id: getUniqueID(ns)
		}
		return hackPackage
	}

	function addScript() {

		//awaits free ram, then runs script

		let freeRam = ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
		let scriptRam = ns.getScriptRam(script.metaSploit)

		if (freeRam > scriptRam
			&& !ns.getRunningScript(script.metaSploit, "home")
			&& !ns.getRunningScript(script.installation, "home")) {

			ns.run(script.metaSploit, 1)
		}
	}

	//\\ MAIN LOGICA
	while (true) {

		await ns.sleep(speed.medium)
		let servers = getServersWithMoney(ns)
		if (getStockAccounts(ns)) { addScript() }

		for (let server of servers) {

			let batch = {}

			if (!ns.hasRootAccess(server)) {

				getRootAccess(ns, server)

			} else {

				copyHackScripts(ns, server)

				if (ns.fileExists("formulas.exe")) {

					ns.toast("Update formulas in netSparker.js !", "error", 10000)

					/*
					weakenTime(server, player)					Calculate weaken time. 
					growPercent(server, threads, player, cores)	Calculate the percent a server would grow to. (Ex: 3.0 would would grow the server to 300% of its current value.)
					growTime(server, player)					Calculate grow time.
					hackChance(server, player)					Calculate hack chance. (Ex: 0.25 would indicate a 25% chance of success.)
					hackPercent(server, player)					Calculate hack percent for one thread. (Ex: 0.25 would steal 25% of the server's current value.)
					hackTime(server, player)					Calculate hack time.
					*/

				} else {

					batch = getHackPackage(server)

				}
			}

			let dynamic = getDynamicNetwork(ns, getTotalNetRam(ns))

			if (ns.hackAnalyzeChance(server) >= dynamic.chance &&
				ns.getHackingLevel() > ns.getServerRequiredHackingLevel(server) &&
				getTotalNetRam(ns) > batch.size) {

				while (true) {

					if (getUsableNetRam(ns) < batch.size) {

						await ns.sleep(speed.fast)
						displayStats(server, Math.floor(batch.size), dynamic.version, "awaiting space")

					} else {

						displayStats(server, Math.floor(batch.size), dynamic.version, "installing")

						installPackage(ns, server, script.serverWeak, ns.getScriptRam(script.serverWeak), batch.threads1, batch.timer1, batch.id)
						installPackage(ns, server, script.serverGrow, ns.getScriptRam(script.serverGrow), batch.threads2, batch.timer2, batch.id)
						installPackage(ns, server, script.serverWeak, ns.getScriptRam(script.serverWeak), batch.threads3, batch.timer3, batch.id)
						installPackage(ns, server, script.serverHack, ns.getScriptRam(script.serverHack), batch.threads4, batch.timer4, batch.id)
						break

					}
				}
			}
		}
	}
}