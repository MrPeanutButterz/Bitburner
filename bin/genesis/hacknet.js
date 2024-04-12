/** @param {NS} ns */
export async function main(ns) {

	//\\ SCRIPT SETTINGS
	ns.tprint("Active")
	ns.disableLog("ALL")
	ns.clearLog()

	//\\ GENERAL DATA
	let maxNode = ns.args[0]
	let maxLevel = ns.args[1]
	let maxRam = ns.args[2]
	let maxCore = ns.args[3]

	if (maxNode === undefined) { maxNode = 4 }
	if (maxLevel === undefined) { maxLevel = 25 }
	if (maxRam === undefined) { maxRam = 2 }
	if (maxCore === undefined) { maxCore = 1 }
	if (maxLevel > 200) { maxLevel = 200 }
	if (maxRam > 64) { maxRam = 64 }
	if (maxCore > 16) { maxCore = 16 }

	//\\ SCRIPT SPECIFIC FUNCTIONS
	function displayStatus() {
		ns.clearLog()
		ns.print("Objective")
		ns.print("Nodes: \t" + maxNode)
		ns.print("Level: \t" + maxLevel)
		ns.print("Ram: \t" + maxRam)
		ns.print("Core: \t" + maxCore)
	}

	//\\ MAIN LOGICA
	while (true) {
		await ns.sleep(1000)
		displayStatus()

		if (ns.hacknet.numNodes() === 0) {
			if (ns.getPlayer().money > ns.hacknet.getPurchaseNodeCost()) { ns.hacknet.purchaseNode() }
		}

		for (let i = 0; i < ns.hacknet.numNodes(); i++) {

			//buy nodes
			if (ns.hacknet.numNodes() < maxNode) {
				if (ns.getPlayer().money > ns.hacknet.getPurchaseNodeCost()) { ns.hacknet.purchaseNode() }
			}

			//updrage levels
			if (ns.hacknet.getNodeStats(i).level < maxLevel) {
				if (ns.getPlayer().money > ns.hacknet.getLevelUpgradeCost(i, 1)) { ns.hacknet.upgradeLevel(i, 1) }
			}

			//upgrade ram
			if (ns.hacknet.getNodeStats(i).ram < maxRam) {
				if (ns.getPlayer().money > ns.hacknet.getRamUpgradeCost(i, 1)) { ns.hacknet.upgradeRam(i, 1) }
			}

			//upgrade core
			if (ns.hacknet.getNodeStats(i).cores < maxCore) {
				if (ns.getPlayer().money > ns.hacknet.getCoreUpgradeCost(i, 1)) { ns.hacknet.upgradeCore(i, 1) }
			}

			//shutdown script
			if (ns.hacknet.numNodes() >= maxNode) {
				if (ns.hacknet.getNodeStats(maxNode - 1).level >= maxLevel
					&& ns.hacknet.getNodeStats(maxNode - 1).ram >= maxRam
					&& ns.hacknet.getNodeStats(maxNode - 1).cores >= maxCore) {
					ns.tprint("Hacknet auto purchase completed")
					ns.exit()
				}
			}
		}
	}
}