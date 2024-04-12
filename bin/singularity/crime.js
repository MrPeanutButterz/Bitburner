import { scriptStart, scriptExit } from "modules/scripting"

/** @param {NS} ns */
export async function main(ns) {

    // make list of crimes 
    // sort on chance
    // sort chance to max profit 
    // commit crime 

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA
    let T = 1000

    const FOCUS = false
    const CRIMECHANCE = 0.8
    const KILLS_REQUIRED = ns.args[0]
    const KARMA_REQUIRED = ns.args[1]

    //\\ FUNCTIONS 
    function commitCrime() {

        // check hp
        // kills
        // karma 

        let player = ns.getPlayer()

        ns.print("Health \t" + player.hp.current + " / " + player.hp.max)
        ns.print("Killed \t" + player.numPeopleKilled)
        ns.print("karma  \t" + Math.round(player.karma))

        if (player.hp.current < player.hp.max) {

            ns.singularity.hospitalize()

        } else if (player.numPeopleKilled < KILLS_REQUIRED) {

            ns.singularity.commitCrime(ns.enums.CrimeType.homicide, FOCUS)
            return ns.singularity.getCrimeStats(ns.enums.CrimeType.homicide).time

        } else if (player.karma > KARMA_REQUIRED) {

            ns.singularity.commitCrime(ns.enums.CrimeType.robStore, FOCUS)
            return ns.singularity.getCrimeStats(ns.enums.CrimeType.robStore).time

        } else {

            ns.singularity.stopAction()
            scriptExit(ns)
            
        }

    }

    //\\ MAIN LOGIC
    ns.resizeTail(500, 160)
    while (true) {

        await ns.sleep(T)
        ns.clearLog()


        if (ns.singularity.isBusy()) {

            let work = ns.singularity.getCurrentWork()

            if (work.type === "CREATE_PROGRAM") {

                ns.print("Creating " + work.programName)

            } else if (work.type === "FACTION") {

                ns.print("Working with " + work.factionName)

            } else if (work.type === "CLASS") {

                ns.print("Taking a class at " + work.location)

            } else if (work.type === "COMPANY") {

                ns.print("Working a job at " + work.companyName)

            } else if (work.type === "CRIME") {

                ns.print("Attempting to " + work.crimeType)
                T = commitCrime()

            }

        } else {

            T = commitCrime()
        }
    }
}

// commitCrime(crime, focus)	Commit a crime.
// getCrimeChance(crime)	Get chance to successfully commit a crime.
// getCrimeStats(crime)	Get stats related to a crime.
// hospitalize()	Hospitalize the player.


// goToLocation(locationName)	Go to a location.
// getCurrentServer()	Get the current server.
// getCurrentWork()	Get the current work the player is doing.
// getOwnedSourceFiles()	Get a list of acquired Source-Files.
// getUpgradeHomeCoresCost()	Get the price of upgrading home cores.
// getUpgradeHomeRamCost()	Get the price of upgrading home RAM.
// installBackdoor()	Run the backdoor command in the terminal.
// connect(hostname)	Connect to a server.
// isBusy()	Check if the player is busy.
// isFocused()	Check if the player is focused.
// upgradeHomeCores()	Upgrade home computer cores.
// upgradeHomeRam()	Upgrade home computer RAM.
// stopAction()	Stop the current action.
// manualHack()	Run the hack command in the terminal.
// purchaseProgram(programName)	Purchase a program from the dark web.
// purchaseTor()	Purchase the TOR router.
// setFocus(focus)	Set the players focus.
// softReset(cbScript)	Soft reset the game.
// travelToCity(city)	Travel to another city.

