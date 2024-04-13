import { scriptStart, scriptExit } from "modules/scripting"
import { installBackdoor } from "modules/network"

/** @param {NS} ns */
export async function main(ns) {

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

        let player = ns.getPlayer()

        if (player.skills.strength < STRENGHT) {

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

    // backdoor
    // powerhouse-fitness 
    // iron-gym

    while (true) {

        await ns.sleep(1000)
        ns.clearLog()

        let player = ns.getPlayer()
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
                ns.singularity.stopAction()

            } else if (work.type === "CRIME") {

                ns.print("Attempting to " + work.crimeType)
                ns.singularity.stopAction()

            }

        } else {

            if (player.city !== GYM_LOCATION && player.money > TRAVEL_COST) {

                ns.print("Traveling to " + UNIVERSITY_LOCATION)
                ns.singularity.travelToCity(UNIVERSITY_LOCATION)

            } else {

                workout()
            }
        }
    }
}
