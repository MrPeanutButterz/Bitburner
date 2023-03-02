/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz 
Proces: functions used across all scripts */

import { getScriptsPath, hasCompanyWork } from "./Default/config.js"

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
export function installPackage(ns, host, script, ram, threads, timing, id) {

	//installs scripts in on the servers with ram (make sure there is space avaliable)

	let server = getServersWithRam(ns)

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
export function getStockAccounts(ns) {

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

/** @param {NS} ns */
export function getFactionDetails(ns, faction) {

	return {
		name: faction,
		getMaxRep: getMaxRep(ns, faction),
		completed: factionCompleted(ns, faction),
		hasCompanyWork: hasCompanyWork(ns, faction),
		augmentations: {
			buyList: getBuyList(ns, faction),
			preBuyList: getPreBuyList(ns, faction),
			preRequireInstalled: preRequireInstalled(ns, faction),
			buyAtFaction: buyAtFaction(ns, faction),
		}
	}
}

/** @param {NS} ns */
export function removeInstalledFromList(ns, arr) {

	//removes installed or bought augmentations

	let playerAug = ns.singularity.getOwnedAugmentations(true)

	if (arr.length > 0) {
		for (let i = 0; i < playerAug.length; i++) {

			if (arr.includes(playerAug[i])) {
				arr.splice(arr.indexOf(playerAug[i]), 1)
			}
		}
		return arr
	} else {
		return []
	}
}

/** @param {NS} ns */
export function addPrice(ns, arr) {

	//adds price to augmentation list 

	if (arr.length > 0) {
		return arr = arr.map((item) => { return { name: item, price: Math.ceil(ns.singularity.getAugmentationPrice(item)) }})
	} else {
		return []
	}
}

/** @param {NS} ns */
export function getBuyList(ns, faction) {

	//returns (list) of augmentations sorted on price high/low

	let factionAug = removeInstalledFromList(ns, ns.singularity.getAugmentationsFromFaction(faction))

	if (factionAug.length > 0) {
		let arr = addPrice(ns, factionAug)
		arr.sort((a, b) => { return a.price - b.price })
		arr.reverse()
		return arr
	} else {
		return []
	}

}

/** @param {NS} ns */
export function getPreBuyList(ns, faction) {

	//returns (list) of pre augmentations sorted on price low/high

	let factionAug = getBuyList(ns, faction)
	let arr = []

	factionAug.forEach((item) => {

		let preInstallList = ns.singularity.getAugmentationPrereq(item.name)

		if (preInstallList.length > 0) {
			arr = arr.concat(preInstallList)
		}
	})

	arr = [...new Set(arr)]
	arr = addPrice(ns, arr)
	arr.sort((a, b) => { return a.price - b.price })
	return arr
}

/** @param {NS} ns */
export function factionCompleted(ns, faction) {

	//returns (bool) faction completed

	let buyList = getBuyList(ns, faction)

	if (buyList.length === 0) {
		return true
	} else {
		return false
	}
}

/** @param {NS} ns */
export function getMaxRep(ns, faction) {

	//returns (number) the augmentation with the highest reputation at faction

	let buyList = getBuyList(ns, faction)
	let highestReputation = 0

	for (let item of buyList) {

		if (ns.singularity.getAugmentationRepReq(item.name) > highestReputation) {
			highestReputation = ns.singularity.getAugmentationRepReq(item.name)
		}
	}
	return Math.ceil(highestReputation)
}

/** @param {NS} ns */
export function preRequireInstalled(ns, faction) {

	//returns (bool) pre installed

	let buyList = getPreBuyList(ns, faction)

	if (buyList.length > 0) {
		return true

	} else {
		return false
	}
}

/** @param {NS} ns */
export function buyAtFaction(ns, faction) {

	//returns (bool) pre installs can be bought at this faction

	let factionAug = ns.singularity.getAugmentationsFromFaction(faction)
	let preBuyList = getPreBuyList(ns, faction)
	let count = 0

	preBuyList.forEach((item) => {

		if (factionAug.find(element => element === item.name) == item.name) {
			count++
		}
	})

	if (count === preBuyList.length) {
		return true

	} else {
		return false

	}
}