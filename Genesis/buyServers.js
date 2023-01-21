/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz 
Proces: buys en/or replace servers */

import { getSleepTime } from "./conf.js"

/** @param {NS} ns */
export async function main(ns) {

	//\\ SCRIPT SETTINGS
	ns.disableLog("ALL")
	ns.clearLog()
	ns.tail()

	//\\ GENERAL DATA
	let baseRam = ns.args[0]
	let maxRam = ns.args[1]
	let speed = getSleepTime(ns)

	//\\ SCRIPT SPECIFIC FUNCTIONS

	//\\ MAIN LOGICA
	while (ns.getServerMaxRam("server-node-24") < maxRam) {
		await ns.sleep(speed.medium)
		ns.clearLog()

		for (let i = 0; i < ns.getPurchasedServerLimit();) {
			await ns.sleep(speed.medium)

			let server = "server-node-" + i
			
			//buy or replace servers
			if (ns.serverExists(server) == false) {

				if (ns.getPlayer().money > ns.getPurchasedServerCost(baseRam)) {
					ns.purchaseServer(server, baseRam)
					ns.print("PURCHASED " + server + " " + baseRam)
					i++
				} else {
					ns.clearLog()
					ns.print("insufficient funds\n" + server + " is being installed " + baseRam + "GB")
					await ns.sleep(speed.medium)
				}
				
			} else if (ns.getServerMaxRam(server) >= baseRam) {

				i++
				ns.print(server + " is already has at least " + baseRam + "GB")

			} else if (ns.getServerMaxRam(server) < maxRam) {
				
				if (ns.getPlayer().money > ns.getPurchasedServerUpgradeCost(server, baseRam)) {
					ns.upgradePurchasedServer(server, baseRam)
					ns.print(server + " is upgraded to " + baseRam + "GB")
					i++
				} else {
					ns.clearLog()
					ns.print("insufficient funds\n" + server + " is awaiting upgrade " + baseRam + "GB")
					await ns.sleep(speed.medium)
				}
					
			} else {
				ns.print("server-node-" + i + " : " + baseRam)
			}
		}

		baseRam = baseRam + baseRam
	}
}


/* 
getPurchasedServerLimit()								Returns the maximum number of servers you can purchase.
getPurchasedServers()									Returns an array with the hostnames of all of the servers you have purchased.

NEW
getPurchasedServerCost(ram)								Get cost of purchasing a server.
purchaseServer(hostname, ram)							Purchase a server.

REPLACE
getPurchasedServerUpgradeCost(hostname, ram)			Get cost of upgrading a purchased server to the given ram.
upgradePurchasedServer(hostname, ram)					Upgrade a purchased server's RAM.

getPurchasedServerMaxRam()								Returns the maximum RAM that a purchased server can have.

renamePurchasedServer(hostname, newName)				Rename a purchased server.
deleteServer(host)										Delete a purchased server.
*/