import { scriptStart, scriptExit } from "lib/settings"

/** @param {NS} ns */
export async function main(ns) {

	//\\ SCRIPT SETTINGS
	scriptStart(ns)

	//\\ GENERAL DATA
	let nodes = ns.args[0] || 4
	let level = ns.args[1] > 200 ? 200 : ns.args[1] || 25
	let ram = ns.args[0] > 64 ? 64 : ns.args[0] || 2
	let core = ns.args[0] > 16 ? 16 : ns.args[0] || 1

	//\\ FUNCTIONS
	function displayStatus() {
		ns.clearLog()
		ns.print("Objective")
		ns.print("Nodes: \t" + nodes)
		ns.print("Level: \t" + level)
		ns.print("Ram: \t" + ram)
		ns.print("Core: \t" + core)
	}

	function exit() {
		if (ns.hacknet.numNodes() >= nodes && ns.hacknet.getNodeStats(nodes - 1).level >= level
			&& ns.hacknet.getNodeStats(nodes - 1).ram >= ram && ns.hacknet.getNodeStats(nodes - 1).cores >= core) {
			scriptExit(ns)
		}
	}

	//\\ MAIN LOGICA
	while (true) {

		await ns.sleep(1000)
		displayStatus()

		if (ns.hacknet.numNodes() === 0) { if (ns.getPlayer().money > ns.hacknet.getPurchaseNodeCost()) { ns.hacknet.purchaseNode() } }

		for (let i = 0; i < ns.hacknet.numNodes(); i++) {
			if (ns.hacknet.numNodes() < nodes && ns.getPlayer().money > ns.hacknet.getPurchaseNodeCost()) { ns.hacknet.purchaseNode() }
			if (ns.hacknet.getNodeStats(i).level < level && ns.getPlayer().money > ns.hacknet.getLevelUpgradeCost(i, 1)) { ns.hacknet.upgradeLevel(i, 1) }
			if (ns.hacknet.getNodeStats(i).ram < ram && ns.getPlayer().money > ns.hacknet.getRamUpgradeCost(i, 1)) { ns.hacknet.upgradeRam(i, 1) }
			if (ns.hacknet.getNodeStats(i).cores < core && ns.getPlayer().money > ns.hacknet.getCoreUpgradeCost(i, 1)) { ns.hacknet.upgradeCore(i, 1) }
			exit()
		}
	}
}