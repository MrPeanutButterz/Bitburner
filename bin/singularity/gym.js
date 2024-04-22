import { scriptStart, scriptExit } from "lib/scripting"
import { installBackdoor } from "lib/network"

/** @param {NS} ns */
export async function main(ns) {

    /**
     * When starting this script, you are required to specify via the arguments how much skills you want to acquire. 
     * Upon starting the script, it will first attempt to install a backdoor on the gym server for a small discount. 
     * Then, you will be directed to the correct location. Afterward, you will begin building up your skills to the point you have specified. 
     * Once the goal is reached, the script will automatically close itself.
    */

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA
    const FOCUS = false
    const TRAVEL_COST = 2e5
    const GYM = "Iron Gym"
    const SERVER = "iron-gym"
    const GYM_LOCATION = ns.enums.CityName.Sector12

    const STRENGHT = ns.args[0]
    const DEFENCE = ns.args[1]
    const DEXTERITY = ns.args[2]
    const AGILITY = ns.args[3]

    //\\ FUNCTIONS 
    function workout() {

        // go to location
        // work on stats
        // exit when done

        let player = ns.getPlayer()

        if (player.city !== GYM_LOCATION && player.money > TRAVEL_COST) {

            ns.print("Traveling to " + GYM_LOCATION)
            ns.singularity.travelToCity(GYM_LOCATION)

        } else if (player.skills.strength < STRENGHT) {

            ns.singularity.gymWorkout(GYM, ns.enums.GymType.strength, FOCUS)

        } else if (player.skills.defense < DEFENCE) {

            ns.singularity.gymWorkout(GYM, ns.enums.GymType.defense, FOCUS)

        } else if (player.skills.dexterity < DEXTERITY) {

            ns.singularity.gymWorkout(GYM, ns.enums.GymType.dexterity, FOCUS)

        } else if (player.skills.agility < AGILITY) {

            ns.singularity.gymWorkout(GYM, ns.enums.GymType.agility, FOCUS)

        } else {

            ns.singularity.stopAction()
            scriptExit(ns)
        }
    }

    //\\ MAIN LOGIC
    while (true) {

        await ns.sleep(1000)
        ns.clearLog()

        await installBackdoor(ns, SERVER)

        if (ns.singularity.isBusy()) {

            let work = ns.singularity.getCurrentWork()

            if (work.type === "CREATE_PROGRAM") {

                ns.print("Creating " + work.programName)

            } else if (work.type === "FACTION") {

                ns.print("Working with " + work.factionName)

            } else if (work.type === "CLASS") {

                ns.print("Taking a class at " + work.location)
                workout()

            } else if (work.type === "COMPANY") {

                ns.print("Working a job at " + work.companyName)
                workout()

            } else if (work.type === "CRIME") {

                ns.print("Attempting to " + work.crimeType)
                workout()

            }

        } else {

            workout()
        }
    }
}
