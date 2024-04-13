import { scriptStart, scriptExit } from "modules/scripting"
import { NmapTotalRam, NmapFreeRam } from "modules/network"

/** @param {NS} ns */
export async function main(ns) {

	//\\ SCRIPT SETTINGS
	scriptStart(ns)

	//\\ GENERAL DATA
	const NET_GB_BASE = 10
	const POOL_GB_BASE = 64
	const SERVER_LIMIT = ns.getPurchasedServerLimit()
	const SERVER_GB_LIMIT = ns.getPurchasedServerMaxRam()

	let PUR_BASE_RAM = 4

	//\\ FUNCTIONS
	function poolRam() {

		// calculate purchased server pool ram
		let poolRam = 0
		for (let server of ns.getPurchasedServers()) {
			poolRam += ns.getServerMaxRam(server)
		}
		return poolRam
	}

	function buyUpgradeServer(server, i, ram) {

		// buy if not exist, upgrade, continue
		let credit = ns.getServerMoneyAvailable("home")
		ns.print(server)

		if (!ns.serverExists(server)) {

			if (credit > ns.getPurchasedServerCost(ram)) {

				// buy ++
				ns.purchaseServer(server, ram)
				ns.print("Purchased " + ram + "gb ")
				return i += 1

			} else {

				return i
			}

		} else if (ns.getServerMaxRam(server) < ram) {

			if (credit > ns.getPurchasedServerUpgradeCost(server, ram)) {

				// upgrade ++
				ns.upgradePurchasedServer(server, ram)
				ns.print("Upgrade to " + ram + "gb ")
				return i += 1

			} else {

				return i
			}

		} else {

			// next server
			ns.print("Running on " + ram + "gb ")
			return i += 1
		}
	}

	//\\ MAIN LOGICA
	if (ns.serverExists("NDX_00")) { PUR_BASE_RAM = ns.getServerMaxRam("NDX_00") }


	while (poolRam() < SERVER_LIMIT * SERVER_GB_LIMIT) {

		await ns.sleep(100)

		for (let i = 0; i < SERVER_LIMIT;) {

			await ns.sleep(1000)
			ns.clearLog()

			let server = i < 10 ? "NDX_0" + i : "NDX_" + i
			let netUsage = Math.ceil(NmapFreeRam(ns) / NmapTotalRam(ns) * 100)

			if (poolRam() < SERVER_LIMIT * POOL_GB_BASE) {

				// keep buying as long as the pool < 25 * 64
				i = buyUpgradeServer(server, i, PUR_BASE_RAM)

			} else if (netUsage < NET_GB_BASE) {

				// only buy if network usage > 90%
				i = buyUpgradeServer(server, i, PUR_BASE_RAM)

			} else {

				// display log
				ns.print("Next purchase is below 10%")
				ns.print("Current network free ram is " + netUsage + "%")
			}
		}

		// log 2 
		PUR_BASE_RAM += PUR_BASE_RAM

	}
	scriptExit(ns)
}
