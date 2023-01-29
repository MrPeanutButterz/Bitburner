/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz 
Proces: buys en/or replace servers */

import { getSleepTime } from "./Default/config.js"

/** @param {NS} ns */
export async function main(ns) {

	//\\ SCRIPT SETTINGS
	ns.toast("buyServers online", "success", 2000)
	ns.disableLog("ALL")
	ns.clearLog()
	ns.tail()

	//\\ GENERAL DATA
	let baseRam = ns.args[0]
	let maxRam = ns.args[1]
	let speed = getSleepTime(ns)
	let purchaseLimit = ns.getPurchasedServerLimit()

	if (baseRam === undefined) { baseRam = 4}
	if (maxRam === undefined) { maxRam = ns.getPurchasedServerMaxRam()}

	//\\ SCRIPT SPECIFIC FUNCTIONS
	function serverPoolSize() {

		//returns total server

		let totalRam = 0
		let servers = ns.getPurchasedServers()

		for (let server of servers) {

			let ram = ns.getServerMaxRam(server)
			totalRam = totalRam + ram
		}
		return totalRam
	}

	function displayStatus(s, r, action) {
		ns.print(s + " " + r + "GB \t" + action)
	}

	//\\ MAIN LOGICA
	while (serverPoolSize() < maxRam * 24) {
		await ns.sleep(speed.average)
		ns.clearLog()

		for (let i = 1; i <= purchaseLimit;) {

			let server = "Heavy-indexer-" + i

			//buy or replace servers
			if (!ns.serverExists(server)) {

				if (ns.getPlayer().money > ns.getPurchasedServerCost(baseRam)) {

					ns.purchaseServer(server, baseRam)
					displayStatus(server, baseRam, "purchased")
					i++

				} else {

					ns.clearLog()
					displayStatus(server, baseRam, "insufficient funds for purchase")
					await ns.sleep(speed.average)

				}

			} else if (ns.getServerMaxRam(server) >= baseRam) {

				displayStatus(server, baseRam, "is up to date")
				i++

			} else if (ns.getServerMaxRam(server) < maxRam) {

				if (ns.getPlayer().money > ns.getPurchasedServerUpgradeCost(server, baseRam)) {

					ns.upgradePurchasedServer(server, baseRam)
					displayStatus(server, baseRam, "ram upgrade")
					i++

				} else {

					ns.clearLog()
					displayStatus(server, baseRam, "insufficient funds for upgrade")
					await ns.sleep(speed.average)

				}

			}
		}
		baseRam = baseRam + baseRam
	}
	ns.closeTail()
}