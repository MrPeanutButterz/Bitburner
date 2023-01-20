/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz 
Proces: This script runs with 4 arguments, 1:max nodes, 2:max levels, 3:max ram, 4: max cores. */

import { getSleepTime } from "./conf.js"

/** @param {NS} ns */
export async function main(ns) {

	//\\ SCRIPT SETTINGS
	ns.disableLog("ALL")
	ns.clearLog()
	ns.tail()

	//\\ GENERAL DATA
	let speed = getSleepTime(ns)

	let maxNode = ns.args[0]
	let maxLevel = ns.args[1]
	let maxRam = ns.args[2]
	let maxCore = ns.args[3]

    //\\ MAIN LOGICA
	while (true) {
		await ns.sleep(speed.medium)

		for (var i = 0; i < maxNode; i++) {

			//buy nodes
			if (ns.hacknet.numNodes() < maxNode) {
				if (ns.getPlayer().money > ns.hacknet.getPurchaseNodeCost()) {
					ns.hacknet.purchaseNode();
				}
			}

			//updrage levels
			if (ns.hacknet.getNodeStats(i).level < maxLevel) {
				if (ns.getPlayer().money > ns.hacknet.getLevelUpgradeCost(i, 1)) {
					ns.hacknet.upgradeLevel(i, 1);
				}
			}

			//upgrade ram
			if (ns.hacknet.getNodeStats(i).ram < maxRam) {
				if (ns.getPlayer().money > ns.hacknet.getRamUpgradeCost(i, 1)) {
					ns.hacknet.upgradeRam(i, 1);
				}
			}

			//upgrade core
			if (ns.hacknet.getNodeStats(i).cores < maxCore) {
				if (ns.getPlayer().money > ns.hacknet.getRamUpgradeCost(i, 1)) {
					ns.hacknet.upgradeCore(i, 1);
				}
			}

			//shutdown script
			if (ns.hacknet.numNodes() === maxNode) {
				if (ns.hacknet.getNodeStats(maxNode - 1).level === maxLevel 
				&& ns.hacknet.getNodeStats(maxNode - 1).ram === maxRam
				&& ns.hacknet.getNodeStats(maxNode - 1).cores === maxCore) {
					ns.exit()
				}	
			}
		}
	}
}