/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz 
Proces: functions used across all scripts */

import { getScriptsPath } from "./Default/config.js"

/** @param {NS} ns */
export function networkScanner(ns) {

	//returns (string array) a list of all servers names in the network

	let servers = []
	let serversToScan = ns.scan("home")
	while (serversToScan.length > 0) {

		let server = serversToScan.shift()
		if (!servers.includes(server) && server !== "home") {
			servers.push(server)
			serversToScan = serversToScan.concat(ns.scan(server))
		}
	}
	return servers
}

/** @param {NS} ns */
export function getServersWithMoney(ns) {

	//returns (string array) a list of servers names with money

	let servers = networkScanner(ns)
	let list = []

	for (let server of servers) {
		if (ns.getServerMaxMoney(server) > 0) {
			list.push(server)
		}
	}
	return list
}

/** @param {NS} ns */
export function getServersWithRam(ns) {

	//returns (string array) a list of servers names with ram

	let servers = networkScanner(ns)
	let list = []

	for (let server of servers) {
		if (ns.getServerMaxRam(server) > 0) {
			list.push(server)
		}
	}
	return list
}


/** @param {NS} ns */
export function networkCleaner(ns) {

	//clears the network of all running scripts

	let servers = getServersWithRam(ns)

	for (let server of servers) {
		ns.killall(server)
	}
}

/** @param {NS} ns */
export function getRootAccess(ns, server) {

	//cracks ports to gain access

	let portsOpen = 0
	if (!ns.hasRootAccess(server)) {
		if (ns.fileExists("BruteSSH.exe", "home")) { ns.brutessh(server); portsOpen++ }
		if (ns.fileExists("FTPCrack.exe", "home")) { ns.ftpcrack(server); portsOpen++ }
		if (ns.fileExists("RelaySMTP.exe", "home")) { ns.relaysmtp(server); portsOpen++ }
		if (ns.fileExists("HTTPWorm.exe", "home")) { ns.httpworm(server); portsOpen++ }
		if (ns.fileExists("SQLInject.exe", "home")) { ns.sqlinject(server); portsOpen++ }
		if (ns.getServerNumPortsRequired(server) <= portsOpen) { ns.nuke(server) }
	}
}

/** @param {NS} ns */
export function getProgramCount(ns) {

	//returns the number of programs owned

	var programs = 0
	if (ns.fileExists("BruteSSH.exe", "home") == true) { programs++ }
	if (ns.fileExists("FTPCrack.exe", "home") == true) { programs++ }
	if (ns.fileExists("RelaySMTP.exe", "home") == true) { programs++ }
	if (ns.fileExists("HTTPWorm.exe", "home") == true) { programs++ }
	if (ns.fileExists("SQLInject.exe", "home") == true) { programs++ }
	return programs
}

/** @param {NS} ns */
export function copyHackScripts(ns, server) {

	//copy the scripts to the destination server

	let script = getScriptsPath(ns)
	const files = [script.serverExploid, script.serverWeak, script.serverGrow, script.serverHack]

	if (!ns.fileExists(script.serverExploid, server)
		|| !ns.fileExists(script.serverWeak, server)
		|| !ns.fileExists(script.serverGrow, server)
		|| !ns.fileExists(script.serverHack, server)) {

		ns.scp(files, server, "home")

	}
}

/** @param {NS} ns */
export function getTotalNetRam(ns) {

	//returns (number) the total ram in the network

	let ram = 0
	let servers = getServersWithRam(ns)

	for (let server of servers) {
		if (ns.hasRootAccess(server)) {
			ram = ram + ns.getServerMaxRam(server)
		}
	}
	return ram
}

/** @param {NS} ns */
export function getUsableNetRam(ns) {

	//returns (number) the usable ram in the network

	let ram = 0
	let servers = getServersWithRam(ns)

	for (let server of servers) {
		if (ns.hasRootAccess(server)) {
			ram = ram + ns.getServerMaxRam(server) - ns.getServerUsedRam(server)
		}
	}
	return Math.floor(ram)
}

/** @param {NS} ns */
export function getUniqueID(ns) {

	//returns (string) a single ID

	let s4 = () => {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1)
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

/** @param {NS} ns */
export function checkStockAccounts(ns) {

	//checks if we have all accounts (boolean)

	if (ns.stock.purchaseWseAccount() == true
		&& ns.stock.purchase4SMarketData() == true
		&& ns.stock.purchaseTixApi() == true
		&& ns.stock.purchase4SMarketDataTixApi() == true) {
		return true
	} else {
		return false
	}
}

/** @param {NS} ns */
export function getFactionShopList(ns, faction) {

	//returns (array) an orderd list based on price from hi / low, with pre installs before the required augmentation

	let f_augmentations = ns.singularity.getAugmentationsFromFaction(faction)
	let p_augmentations = ns.singularity.getOwnedAugmentations(true)

	for (let i = 0; i < p_augmentations.length; i++) {

		if (f_augmentations.includes(p_augmentations[i])) {
			f_augmentations.splice(f_augmentations.indexOf(p_augmentations[i]), 1)
		}
	}

	f_augmentations.sort(function (a, b) { return a.price - b.price })

	let buyList = []
	for (let item of f_augmentations) {

		if (ns.singularity.getAugmentationPrereq(item).length > 0) {

			let preRequired = ns.singularity.getAugmentationPrereq(item)
			for (let preRequire of preRequired) {

				buyList.push(preRequire)
			}
		}
		buyList.push(item)
	}
	return buyList
}

/** @param {NS} ns */
export function getServerPath(ns, server) {

	// returns the path to a server

	var serverNameList = networkScanner(ns)
	let serverPathList = generatePathList(ns, serverNameList)

	if (ns.serverExists(server)) {
		let path = [server]

		while (path[path.length - 1] != "home") {
			let lasthop = path[path.length - 1]
			let nexthop = serverPathList[serverNameList.indexOf(lasthop)]
			path.push(nexthop)
		}
		path.reverse()
		return path
	}

	function generatePathList(ns, serverNameList) {

		let serverPathList = serverNameList.map(function () {
			return ""
		})

		let visited = []
		let queue = ["home"]

		while (queue.length > 0) {
			let node = queue.shift()
			visited.push(node)
			let neighbours = ns.scan(node)
			for (let server of neighbours) {
				if (!visited.includes(server)) {
					serverPathList[serverNameList.indexOf(server)] = node
					queue.push(server)
				}
			}
		}
		return serverPathList
	}
}