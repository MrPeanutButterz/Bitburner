import { scriptStart, scriptExit } from "lib/scripting"

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
        ns.print("karma  \t" + player.karma.toPrecision(3))

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

        await ns.sleep(T + 200)
        ns.clearLog()

        if (ns.singularity.isBusy()) {

            let work = ns.singularity.getCurrentWork()

            if (work.type === "CREATE_PROGRAM") {

                ns.print("Creating " + work.programName + " can't do crime")

            } else if (work.type === "FACTION") {

                ns.print("Working with " + work.factionName + " can't do crime")

            } else if (work.type === "CLASS") {

                ns.print("Taking a class at " + work.location + " can't do crime")

            } else if (work.type === "COMPANY") {

                ns.print("Working a job at " + work.companyName + " can't do crime")

            } else if (work.type === "CRIME") {

                ns.print("Attempting to " + work.crimeType)
                T = commitCrime()

            }

        } else {

            T = commitCrime()
        }
    }
}
