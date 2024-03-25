import { consoleLog, sleepTime } from "./lib/scripting-module"

/** @param {NS} ns */
export async function main(ns) {

	//\\ SCRIPT SETTINGS
	consoleLog(ns, "Servers Auto Purchase Running")
	ns.disableLog("ALL")
	ns.clearLog()

	//\\ GENERAL DATA
	const speed = sleepTime(ns)
	const purchaseLimit = ns.getPurchasedServerLimit()

	let pwr = 1
	let baseRam = ns.args[0]
	let maxRam = ns.args[1]
	if (baseRam === undefined) { baseRam = 4, pwr = 2 }
	if (maxRam === undefined) { maxRam = ns.getPurchasedServerMaxRam() }

	//\\ SCRIPT SPECIFIC FUNCTIONS
	function serverPoolSizeGB() {

		//returns total server
		let totalRam = 0
		let servers = ns.getPurchasedServers()

		for (let server of servers) {

			let ram = ns.getServerMaxRam(server)
			totalRam = totalRam + ram
		}
		return totalRam
	}

	function displayStatus(s, r, price, action) {
		ns.clearLog()
		ns.print("Server: \t" + s)
		ns.print("Ram: \t\t" + r + "GB")
		ns.print("Power: \t\t" + 2 + "*" + pwr)
		ns.print("Price: \t\t" + "$" + Math.round(price))
		ns.print("Action: \t" + action)
	}

	//\\ MAIN LOGICA
	while (serverPoolSizeGB() < maxRam * purchaseLimit) {
		await ns.sleep(speed.s1)

		for (let i = 0; i < purchaseLimit;) {

			let server = "NDX_" + i

			//buy or replace servers
			if (!ns.serverExists(server)) {

				if (ns.getPlayer().money > ns.getPurchasedServerCost(baseRam)) {

					ns.purchaseServer(server, baseRam)
					displayStatus(server, baseRam, ns.getPurchasedServerCost(baseRam), "purchased server")
					i++

				} else {

					ns.clearLog()
					displayStatus(server, baseRam, ns.getPurchasedServerCost(baseRam), "awaiting funds")
					await ns.sleep(speed.s1)

				}

			} else if (ns.getServerMaxRam(server) >= baseRam) {

				displayStatus(server, baseRam, 0, "is running equal or more ram")
				i++

			} else if (ns.getServerMaxRam(server) < maxRam) {

				if (ns.getPlayer().money > ns.getPurchasedServerUpgradeCost(server, baseRam)) {

					ns.upgradePurchasedServer(server, baseRam)
					displayStatus(server, baseRam, ns.getPurchasedServerCost(baseRam), "purchased ram upgrade")
					i++

				} else {

					ns.clearLog()
					displayStatus(server, baseRam, ns.getPurchasedServerCost(baseRam), "awaiting funds ")
					await ns.sleep(speed.s1)

				}
			}
		}
		baseRam += baseRam
		pwr += 1
	}
}
