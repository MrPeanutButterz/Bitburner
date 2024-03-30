import { NmapTotalRam, NmapFreeRam } from "modules/network"

/** @param {NS} ns */
export async function main(ns) {

	//\\ SCRIPT SETTINGS
	ns.tprint("Active")
	ns.disableLog("ALL")
	ns.clearLog()
	ns.tail()

	//\\ GENERAL DATA
	const speed = 1000
	const purchaseLimit = ns.getPurchasedServerLimit()
	const networkLoadMoreThan = 10

	let baseRam = 4
	let maxRam = ns.getPurchasedServerMaxRam()

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
		ns.print("Price: \t\t" + "$" + Math.round(price))
		ns.print("Action: \t" + action)
	}

	//\\ MAIN LOGICA
	while (serverPoolSizeGB() < maxRam * purchaseLimit) {
		await ns.sleep(500)

		for (let i = 0; i < purchaseLimit;) {

			await ns.sleep(500)

			let server = "NDX_" + i

			if (Math.ceil(NmapFreeRam(ns) / NmapTotalRam(ns) * 100) >= networkLoadMoreThan) {

				ns.clearLog()
				ns.print("Action: \t" + "network handles load @" + Math.ceil(NmapFreeRam(ns) / NmapTotalRam(ns) * 100) + "% free")

			} else if (!ns.serverExists(server)) {

				if (ns.getPlayer().money > ns.getPurchasedServerCost(baseRam)) {

					ns.purchaseServer(server, baseRam)
					displayStatus(server, baseRam, ns.getPurchasedServerCost(baseRam), "purchased server")
					i++

				} else {

					ns.clearLog()
					displayStatus(server, baseRam, ns.getPurchasedServerCost(baseRam), "awaiting funds")
					await ns.sleep(speed)

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
					await ns.sleep(speed)

				}
			}
		}
		baseRam += baseRam
	}
	ns.tprint("Server auto purchase completed")
}
