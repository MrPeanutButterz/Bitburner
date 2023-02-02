/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz 
Proces: finds servers with money, creates a timed package to hack, and installs it on servers that have ram. */

import { getScriptsPath, getSleepTime } from "./Default/config.js"
import { getRootAccess, copyHackScripts, getServersWithMoney, getServersWithRam, getTotalNetRam, getUsableNetRam, getUniqueID } from "./Default/library.js"


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

		ns.clearLog()
		ns.print("Target: \t" + target)
		ns.print("BatchSize: \t" + batchSize + "GB")
		ns.print("Dynamic: \t" + version)
		ns.print("Action: \t" + action)

	}
	function getDynamicNetwork() {

		let netRam = getTotalNetRam(ns)

		if (netRam < 1000) {
			return { growth: 1.030, steal: 0.010, defence: 8, chance: 0.8, version: "Level 01", }

		} else if (netRam < 1450) {
			return { growth: 1.063, steal: 0.017, defence: 7, chance: 0.8, version: "Level 02", }

		} else if (netRam < 3000) {
			return { growth: 1.096, steal: 0.033, defence: 6, chance: 0.7, version: "Level 03", }

		} else if (netRam < 4600) {
			return { growth: 1.129, steal: 0.049, defence: 5, chance: 0.7, version: "Level 04", }

		} else if (netRam < 7800) {
			return { growth: 1.162, steal: 0.065, defence: 4, chance: 0.6, version: "Level 05", }

		} else if (netRam < 11000) {
			return { growth: 1.195, steal: 0.081, defence: 4, chance: 0.6, version: "Level 06", }

		} else {
			return { growth: 1.327, steal: 0.145, defence: 2, chance: 0.1, version: "Level 07", }

		}
	}

	function installPackage(host, script, ram, threads, timing, id) {

		let server = getServersWithRam(ns)

		for (let i = 0; i < server.length; i++) {

			getRootAccess(ns, server[i])


			let ramAvailable = ns.getServerMaxRam(server[i]) - ns.getServerUsedRam(server[i])
			let threadsAvailable = Math.floor(ramAvailable / ram)

			if (threadsAvailable >= 1) {

				if (threadsAvailable > threads) {
					ns.exec(script, server[i], threads, host, timing, id)
					break
				}

				if (threadsAvailable < threads) {
					ns.exec(script, server[i], threadsAvailable, host, timing, id)
					threads = threads - threadsAvailable
				}
			}
		}
	}

	//\\ MAIN LOGICA
	while (true) {

		await ns.sleep(speed.medium)
		let servers = getServersWithMoney(ns)

		for (let server of servers) {

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

					var dynamic = getDynamicNetwork()

					var fase1 = {
						threads: Math.ceil((ns.getServerSecurityLevel(server) - ns.getServerMinSecurityLevel(server) + dynamic.defence) / ns.weakenAnalyze(1)),
						time: Math.ceil(ns.getWeakenTime(server)),
					}
					var fase2 = {
						threads: Math.ceil(ns.growthAnalyze(server, dynamic.growth, 1)),
						time: Math.ceil(ns.getGrowTime(server)),
					}
					var fase3 = {
						threads: Math.ceil(ns.growthAnalyzeSecurity(fase2.threads, server, 1) / ns.weakenAnalyze(1)),
						time: Math.ceil(ns.getWeakenTime(server)),
					}
					var fase4 = {
						threads: Math.ceil(ns.hackAnalyzeThreads(server, (ns.getServerMoneyAvailable(server) * dynamic.steal))),
						time: Math.ceil(ns.getHackTime(server)),
					}

					if (fase1.threads < 1) { fase1.threads = 1 }
					if (fase2.threads < 1) { fase2.threads = 1 }
					if (fase3.threads < 1) { fase3.threads = 1 }
					if (fase4.threads < 1) { fase4.threads = 1 }

					const spacer = 500
					var fase1Start = 0
					var fase1End = fase1.time
					var fase2Start = (fase1End + spacer) - fase2.time
					var fase2End = fase2Start + fase2.time
					var fase3Start = (fase2End + spacer) - fase3.time
					var fase3End = fase3Start + fase3.time
					var fase4Start = (fase3End + spacer) - fase4.time

					var ramWeak = ns.getScriptRam(script.serverWeak)
					var ramGrow = ns.getScriptRam(script.serverGrow)
					var ramHack = ns.getScriptRam(script.serverHack)

					var fullPackageRam = (fase1.threads * ramWeak) + (fase2.threads * ramGrow) + (fase3.threads * ramWeak) + (fase4.threads * ramHack)

				}

				if (ns.hackAnalyzeChance(server) >= dynamic.chance && getTotalNetRam(ns) > fullPackageRam) {

					while (true) {

						if (getUsableNetRam(ns) < fullPackageRam) {

							await ns.sleep(speed.fast)
							displayStats(server, Math.floor(fullPackageRam), dynamic.version, "awaiting free space")

						} else {

							let id = getUniqueID()
							displayStats(server, Math.floor(fullPackageRam), dynamic.version, "installing")
							installPackage(server, script.serverWeak, ramWeak, fase1.threads, fase1Start, id)
							installPackage(server, script.serverGrow, ramGrow, fase2.threads, fase2Start, id)
							installPackage(server, script.serverWeak, ramWeak, fase3.threads, fase3Start, id)
							installPackage(server, script.serverHack, ramHack, fase4.threads, fase4Start, id)
							break

						}
					}
				}
			}
		}
	}
}