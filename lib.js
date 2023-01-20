/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz 
Proces: functions used across all scripts */

import { getScriptsPath } from "./conf.js"

/* HACKING */

/** @param {NS} ns */
export function networkScanner(ns) {

	//returns a list of all servers on the network

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

	//returns a list of servers with money

	var servers = networkScanner(ns)
	var list = []

	for (var i = 0; i < servers.length; i++) {
		if (ns.getServerMaxMoney(servers[i]) > 0) {
			list.push(servers[i])
		}
	}
	return list
}

/** @param {NS} ns */
export function getServersWithRam(ns) {

	//returns a list of servers with ram

	var servers = networkScanner(ns)
	var list = []

	for (var i = 0; i < servers.length; i++) {
		if (ns.getServerMaxRam(servers[i]) > 0) {
			list.push(servers[i])
		}
	}
	return list
}

/** @param {NS} ns */
export function getRootAccess(ns, server) {

	//cracks as many ports as possible to gain access

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
export function copyScripts(ns, server) {

	//copy the scripts to the destination server

	let script = getScriptsPath(ns)
	const files = [script.serverExploid, script.serverWeak, script.serverGrow, script.serverHack]

	let scriptExists = false
	let scriptsOnServer = ns.ls(server)

	for (let i = 0; i < scriptsOnServer.length; i++) {

		if (scriptsOnServer[i] === "/Genesis/serverHack.js") {
			scriptExists = true
		}
	}

	if (!scriptExists) {
		ns.scp(files, server, "home")
		ns.print("SUCCES: Files copied to " + server)
	}
}