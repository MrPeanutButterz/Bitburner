/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz 
Proces: functions used across all scripts */

import { getScriptsPath } from "./conf.js"

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
	let list = [].concat(ns.getPurchasedServers())

	for (let server of servers) {
		if (ns.getServerMaxRam(server) > 0) {
			list.push(server)
		}
	}
	return list
}

/** @param {NS} ns */
export function getRootAccess(ns, server) {

	//cracks ports to gain access

	let openPorts = 0
	if (ns.hasRootAccess(server) == false) {
		if (ns.fileExists("BruteSSH.exe", "home")) { ns.brutessh(server); openPorts++ }
		if (ns.fileExists("FTPCrack.exe", "home")) { ns.ftpcrack(server); openPorts++ }
		if (ns.fileExists("RelaySMTP.exe", "home")) { ns.relaysmtp(server); openPorts++ }
		if (ns.fileExists("HTTPWorm.exe", "home")) { ns.httpworm(server); openPorts++ }
		if (ns.fileExists("SQLInject.exe", "home")) { ns.sqlinject(server); openPorts++ }
		if (ns.getServerNumPortsRequired(server) <= openPorts) { ns.nuke(server) }
	}
}

/** @param {NS} ns */
export function numOfPrograms(ns) {
	var numberOfPrograms = 0
	if (ns.fileExists("BruteSSH.exe", "home") == true) { numberOfPrograms++ }
	if (ns.fileExists("FTPCrack.exe", "home") == true) { numberOfPrograms++ }
	if (ns.fileExists("RelaySMTP.exe", "home") == true) { numberOfPrograms++ }
	if (ns.fileExists("HTTPWorm.exe", "home") == true) { numberOfPrograms++ }
	if (ns.fileExists("SQLInject.exe", "home") == true) { numberOfPrograms++ }
	return numberOfPrograms
}

/** @param {NS} ns */
export function copyHackScripts(ns, server) {

	//copy the scripts to the destination server

	let script = getScriptsPath(ns)
	const files = [script.serverExploid, script.serverWeak, script.serverGrow, script.serverHack]

	if (ns.fileExists("/Genesis/serverHack.js", server) == false) {
		ns.scp(files, server, "home")
		ns.tprint("SUCCES: Files copied to " + server)
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