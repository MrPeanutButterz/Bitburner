/* Creator: https://github.com/MrPeanutbutterz 
Proces: buys tor router, if money avaliable buys program on darkweb of creates program */

/** @param {NS} ns */
export async function main(ns) {

	//\\ SCRIPT SETTINGS
	ns.toast("buyPrograms online", "success", 2000)
	ns.disableLog("ALL")
	ns.clearLog()

	//\\ GENERAL DATA

	//essential
	const programs = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"]
	const levels = [50, 100, 250, 500, 750]

	//non essential 
	const programsPlus = ["AutoLink.exe", "ServerProfiler.exe", "DeepscanV1.exe", "DeepscanV2.exe", "Formulas.exe"]
	const levelsPlus = [25, 75, 75, 400, 1000]

	//\\ MAIN LOGICA
	for (var i = 0; i < programs.length; i++) {

		//depending on tor router print info
		if (ns.singularity.purchaseTor() == true) {

			ns.print("To create " + programs[i] + " hack level " + levels[i] + " is needed")
			ns.print("To buy " + programs[i] + " we need $" + ns.singularity.getDarkwebProgramCost(programs[i]))

		} else {

			ns.print("To create " + programs[i] + " hack level " + levels[i] + " is needed")
			
		}

		//if the program does not exist
		while (ns.fileExists(programs[i]) == false) {
			await ns.sleep(2000)

			if (ns.singularity.purchaseTor() == true && ns.getPlayer().money > ns.singularity.getDarkwebProgramCost(programs[i])) {

				//buy
				ns.singularity.purchaseProgram(programs[i])
				ns.print("Bought program " + programs[i])

			} else if (ns.getHackingLevel() >= levels[i] && ns.singularity.isBusy() == false) {

				//create program
				ns.singularity.createProgram(programs[i], false)
				ns.print("Creating program " + programs[i])

			}
		}
	}
}