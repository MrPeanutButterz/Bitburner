import { scriptPath } from "modules/scripting"

/** @param {NS} ns */
export function Nmap(ns) {

	// returns a list of all servers names in the network

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
export function NmapMoneyServers(ns) {

	//returns a list of servers names with money

	let servers = Nmap(ns)
	let list = []

	for (let server of servers) {
		if (ns.getServerMaxMoney(server) > 0) {
			list.push(server)
		}
	}
	return list
}

/** @param {NS} ns */
export function NmapRamServers(ns) {

	//returns a list of servers names with ram

	let servers = Nmap(ns)
	let list = []

	for (let server of servers) {
		if (ns.getServerMaxRam(server) > 0) {
			list.push(server)
		}
	}
	return list
}

/** @param {NS} ns */
export function NmapClear(ns) {

	//clears the network of all running scripts

	let servers = NmapRamServers(ns)

	for (let server of servers) {
		ns.killall(server)
	}
}

/** @param {NS} ns */
export function NmapTotalRam(ns) {

	//returns the total ram in the network

	let ram = 0
	let servers = NmapRamServers(ns)

	for (let server of servers) {
		if (ns.hasRootAccess(server)) {
			ram = ram + ns.getServerMaxRam(server)
		}
	}
	return Math.floor(ram)
}

/** @param {NS} ns */
export function NmapFreeRam(ns) {

	//returns the usable ram in the network

	let ram = 0
	let servers = NmapRamServers(ns)

	for (let server of servers) {
		if (ns.hasRootAccess(server)) {
			ram = ram + ns.getServerMaxRam(server) - ns.getServerUsedRam(server)
		}
	}
	return Math.floor(ram)
}

/** @param {NS} ns */
export function watchForNewServer(ns) {
	Nmap(ns).forEach(server => {
		getRootAccess(ns, server)
		copyHackScripts(ns, server)
	})
}

/** @param {NS} ns */
export function getServerPath(ns, server) {

	// returns the path to a server

	let serverNameList = Nmap(ns)
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
	if (ns.fileExists("BruteSSH.exe", "home")) { programs++ }
	if (ns.fileExists("FTPCrack.exe", "home")) { programs++ }
	if (ns.fileExists("RelaySMTP.exe", "home")) { programs++ }
	if (ns.fileExists("HTTPWorm.exe", "home")) { programs++ }
	if (ns.fileExists("SQLInject.exe", "home")) { programs++ }
	return programs
}

/** @param {NS} ns */
export function copyHackScripts(ns, server) {

	//copy the scripts to the destination server

	const path = scriptPath(ns)
	const files = [path.grow, path.weak, path.hack, path.gwh, path.gw, path.wgh]

	if (!ns.fileExists(path.grow, server)
		|| !ns.fileExists(path.weak, server)
		|| !ns.fileExists(path.hack, server)
		|| !ns.fileExists(path.gwh, server)
		|| !ns.fileExists(path.wgh, server)
		|| !ns.fileExists(path.gw, server)) {
		ns.scp(files, server, "home")
	}
}

/** @param {NS} ns */
export function installPackage(ns, host, script, ram, threads, timing, id) {

	//installs scripts in on the servers with ram (make sure there is space avaliable)

	let server = NmapRamServers(ns)

	for (let i = 0; i < server.length; i++) {

		getRootAccess(ns, server[i])

		let ramAvailable = ns.getServerMaxRam(server[i]) - ns.getServerUsedRam(server[i])
		let threadsAvailable = Math.floor(ramAvailable / ram)

		if (threadsAvailable >= 1) {

			if (threadsAvailable > threads) {
				ns.exec(script, server[i], threads, host, timing, id)
				break
			}

			if (threadsAvailable < threads) {
				ns.exec(script, server[i], threadsAvailable, host, timing, id)
				threads = threads - threadsAvailable
			}
		}
	}
}

/** @param {NS} ns */
export function getUniqueIDs(ns) {

	//returns a single ID

	let s4 = () => {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1)
	}
	return s4() + s4() + s4() + s4() + s4()
}

/** @param {NS} ns */
export function getUniqueIDm(ns) {

	//returns a single ID

	let s4 = () => {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1)
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}