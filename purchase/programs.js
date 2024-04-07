/** @param {NS} ns */
export async function main(ns) {

	//\\ SCRIPT SETTINGS
	ns.tprint("Active")
	ns.disableLog("ALL")
	ns.clearLog()

	//\\ GENERAL DATA
	const essential = [
		{ name: "BruteSSH.exe", lvl: 50 },
		{ name: "FTPCrack.exe", lvl: 100 },
		{ name: "relaySMTP.exe", lvl: 250 },
		{ name: "HTTPWorm.exe", lvl: 500 },
		{ name: "SQLInject.exe", lvl: 750 },
	]

	const nonEssential = [
		{ name: "AutoLink.exe", lvl: 25 },
		{ name: "ServerProfiler.exe", lvl: 75 },
		{ name: "DeepscanV1.exe", lvl: 75 },
		{ name: "DeepscanV2.exe", lvl: 400 },
		{ name: "Formulas.exe", lvl: 1000 },
	]

	//\\ SCRIPT SPECIFIC FUNCTIONS
	//\\ MAIN LOGIC
	const program = essential
	for (let i = 0; i < program.length; i++) {

		let exe = program[i].name
		let lvl = program[i].lvl
		let cost = ns.singularity.getDarkwebProgramCost(exe)

		while (!ns.fileExists(exe)) {

			await ns.sleep(500)
			ns.clearLog()
			ns.print("Progr - " + exe)
			ns.print("Level - " + lvl)
			ns.print("Price - " + cost)

			if (ns.singularity.purchaseTor() &&
				ns.getServerMoneyAvailable("home") > cost) {

				// buy, cauz money fix everything...

				if (ns.singularity.purchaseProgram(exe)) {
					ns.print("Bought " + exe)

				}

			} else if (ns.getHackingLevel() >= lvl) {

				// check bussyness
				// what ya working on?
				// if not programs, start!

				if (ns.singularity.isBusy()) {

					let work = ns.singularity.getCurrentWork()
					if (work.type != "CREATE_PROGRAM") {
						ns.singularity.stopAction()
					}

				} else {
					ns.singularity.createProgram(exe, false)

				} 
			}
		}
	}
	ns.tprint("Programs purchase completed")
	ns.closeTail()
}
