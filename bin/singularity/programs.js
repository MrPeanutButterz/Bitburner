import { scriptStart, scriptExit } from "modules/scripting"

/** @param {NS} ns */
export async function main(ns) {

	//\\ SCRIPT SETTINGS
	scriptStart(ns)

	//\\ GENERAL DATA
	let PROGRAM = 0
	const FOCUS = false

	const ESSENTIAL = [
		{ name: "BruteSSH.exe", lvl: 50 },
		{ name: "FTPCrack.exe", lvl: 100 },
		{ name: "relaySMTP.exe", lvl: 250 },
		{ name: "HTTPWorm.exe", lvl: 500 },
		{ name: "SQLInject.exe", lvl: 750 },
	]

	const NON_ESSENTIAL = [
		{ name: "AutoLink.exe", lvl: 25 },
		{ name: "ServerProfiler.exe", lvl: 75 },
		{ name: "DeepscanV1.exe", lvl: 75 },
		{ name: "DeepscanV2.exe", lvl: 400 },
		{ name: "Formulas.exe", lvl: 1000 },
	]

	//\\ FUNCTIONS 
	function getProgram() {

		let player = ns.getPlayer()

		if (PROGRAM > ESSENTIAL.length -1) {

			ns.singularity.stopAction()
			scriptExit(ns)

		} else if (!ns.fileExists(ESSENTIAL[PROGRAM].name)) {

			if (ns.singularity.purchaseTor() &&
				player.money > ns.singularity.getDarkwebProgramCost(ESSENTIAL[PROGRAM].name)) {

				ns.singularity.purchaseProgram(ESSENTIAL[PROGRAM].name)

			} else if (player.skills.hacking > ESSENTIAL[PROGRAM].lvl) {

				ns.singularity.createProgram(ESSENTIAL[PROGRAM].name, FOCUS)

			}

		} else {

			PROGRAM++
		}
	}


	//\\ MAIN LOGIC
	ns.resizeTail(500, 160)
	while (true) {

		await ns.sleep(500)
		ns.clearLog()

		if (ns.singularity.isBusy()) {

			let work = ns.singularity.getCurrentWork()

			if (work.type === "CREATE_PROGRAM") {

				ns.print("Creating " + work.programName)

				getProgram()

			} else if (work.type === "FACTION") {

				ns.print("Working with " + work.factionName)
				ns.singularity.stopAction()

			} else if (work.type === "CLASS") {

				ns.print("Taking a class at " + work.location)
				ns.singularity.stopAction()

			} else if (work.type === "COMPANY") {

				ns.print("Working a job at " + work.companyName)
				ns.singularity.stopAction()

			} else if (work.type === "CRIME") {

				ns.print("Attempting to " + work.crimeType)
				ns.singularity.stopAction()

			}

		} else {

			getProgram()

		}
	}
}
