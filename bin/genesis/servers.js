import { NmapTotalRam, NmapFreeRam } from "modules/network"

/** @param {NS} ns */
export async function main(ns) {

	//\\ SCRIPT SETTINGS
	ns.tprint("Active")
	ns.disableLog("ALL")
	ns.clearLog()

	//\\ GENERAL DATA
	const PURCHASE_LIMIT = ns.getPurchasedServerLimit()
	const FREE_NET_RAM = 10

	let LEVEL_RAM_BASE = 4
	let LEVEL_RAM_MAX = ns.getPurchasedServerMaxRam()
	let GB_LIMIT = ns.args[0]

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

		// display current status

		ns.clearLog()
		ns.print("Server: \t" + s)
		ns.print("Ram: \t\t" + r + "GB")
		ns.print("Price: \t\t" + "$" + Math.round(price))
		ns.print("Action: \t" + action)
	}

	//\\ MAIN LOGICA
	if (GB_LIMIT !== undefined) { LEVEL_RAM_MAX = GB_LIMIT }

	while (serverPoolSizeGB() < LEVEL_RAM_MAX * PURCHASE_LIMIT) {
		await ns.sleep(1000)

		for (let i = 0; i < PURCHASE_LIMIT;) {

			await ns.sleep(250)

			let server = "NDX_" + i

			if (Math.ceil(NmapFreeRam(ns) / NmapTotalRam(ns) * 100) >= FREE_NET_RAM && GB_LIMIT === undefined) {

				displayStatus(server, LEVEL_RAM_BASE, ns.getPurchasedServerCost(LEVEL_RAM_BASE), "network load " + (100 - Math.ceil(NmapFreeRam(ns) / NmapTotalRam(ns) * 100)) + "%")

			} else if (!ns.serverExists(server)) {

				if (ns.getPlayer().money > ns.getPurchasedServerCost(LEVEL_RAM_BASE)) {

					ns.purchaseServer(server, LEVEL_RAM_BASE)
					displayStatus(server, LEVEL_RAM_BASE, ns.getPurchasedServerCost(LEVEL_RAM_BASE), "purchased server")
					i++

				} else {

					displayStatus(server, LEVEL_RAM_BASE, ns.getPurchasedServerCost(LEVEL_RAM_BASE), "LACK OF FUNDS...")
					await ns.sleep(250)

				}

			} else if (ns.getServerMaxRam(server) >= LEVEL_RAM_BASE) {

				displayStatus(server, LEVEL_RAM_BASE, 0, "is running equal or more ram")
				i++

			} else if (ns.getServerMaxRam(server) < LEVEL_RAM_MAX) {

				if (ns.getPlayer().money > ns.getPurchasedServerUpgradeCost(server, LEVEL_RAM_BASE)) {

					ns.upgradePurchasedServer(server, LEVEL_RAM_BASE)
					displayStatus(server, LEVEL_RAM_BASE, ns.getPurchasedServerCost(LEVEL_RAM_BASE), "purchased ram upgrade")
					i++

				} else {

					displayStatus(server, LEVEL_RAM_BASE, ns.getPurchasedServerCost(LEVEL_RAM_BASE), "LACK OF FUNDS...")
					await ns.sleep(250)

				}
			}
		}
		LEVEL_RAM_BASE += LEVEL_RAM_BASE
	}
	ns.tprint("Server auto purchase completed")
}
