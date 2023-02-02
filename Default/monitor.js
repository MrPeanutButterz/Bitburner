/*Creator: Charles, add me on github ==> https://github.com/MrPeanutbutterz 
Proces: network monitor  */

import { getSleepTime } from "./config.js"
import { getServersWithMoney, } from "./library.js"

/** @param {NS} ns */
export async function main(ns) {

	//\\ SCRIPT SETTINGS
	ns.disableLog("ALL")
	ns.clearLog()
	ns.tail()

	//\\ GENERAL DATA
	let speed = getSleepTime(ns)
	let servers = getServersWithMoney(ns)

	//\\ SCRIPT SPECIFIC FUNCTIONS    

	//\\ MAIN LOGICA
	while (true) {
		await ns.sleep(speed.medium)

		ns.clearLog()
		ns.print(" Network monitor ")
		//ns.print(" Ram use: \t\t" + getAvailableNetworkRam(ns) + " / " + getTotalNetworkRam(ns) + "Gb")
		ns.print(" ")

		for (let server of servers) {

			ns.print(" "
				+ Math.round(ns.getServerMoneyAvailable(server) / ns.getServerMaxMoney(server) * 100) + "%$ "
				+ Math.round(ns.getServerSecurityLevel(server)) + "%d "
				+ Math.round(ns.hackAnalyzeChance(server) * 100) + "%c "
				+ "$" + Math.round(ns.getServerMoneyAvailable(server)) + " "
				+ server + " "
			)
		}
	}
}