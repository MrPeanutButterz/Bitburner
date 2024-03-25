import { consoleLog, sleepTime } from "./lib/scripting-module"

/** @param {NS} ns */
export async function main(ns) {

	//\\ SCRIPT SETTINGS
	consoleLog(ns, "Progams Auto Purchase Running")
	ns.disableLog("ALL")
	ns.clearLog()

	//\\ GENERAL DATA
    const sleep = sleepTime()

	const program = [
		{name: "BruteSSH.exe", lvl: 50},
		{name: "FTPCrack.exe", lvl: 100},
		{name: "relaySMTP.exe", lvl: 250},
		{name: "HTTPWorm.exe", lvl: 500},
		{name: "SQLInject.exe", lvl: 750},
	]

	const nonEssential = [
		{name: "AutoLink.exe", lvl: 25},
		{name: "ServerProfiler.exe", lvl: 75},
		{name: "DeepscanV1.exe", lvl: 75},
		{name: "DeepscanV2.exe", lvl: 400},
		{name: "Formulas.exe", lvl: 1000},
	]

    //\\ SCRIPT SPECIFIC FUNCTIONS

	//\\ MAIN LOGIC
	for (let i = 0; i < program.length; i++) {
		while (!ns.fileExists(program[i].name)) {
			await ns.sleep(sleep.s1)

			if (ns.singularity.purchaseTor() && ns.getPlayer().money > ns.singularity.getDarkwebProgramCost(program[i].name)) {

				//buy
				ns.singularity.purchaseProgram(program[i].name)
				ns.print("Bought " + program[i].name)

			} else if (ns.getHackingLevel() >= program[i].lvl && !ns.singularity.isBusy()) {

				//create
				ns.singularity.createProgram(program[i].name, false)
				ns.print("Created " + program[i].name)
				
			}
		}
	}
}
