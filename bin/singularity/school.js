import { scriptStart, scriptExit } from "modules/scripting"
import { installBackdoor } from "modules/network"

/** @param {NS} ns */
export async function main(ns) {

    // studie at university

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA
    const FOCUS = false
    const TRAVEL_COST = 2e5
    const CHARISMA = ns.args[0]
    const SERVER = "rothman-uni"
    const UNIVERSITY = "Rothman University"
    const UNIVERSITY_LOCATION = ns.enums.CityName.Sector12
    const LEADERSHIP_COURSE = ns.enums.UniversityClassType.leadership

    //\\ FUNCTIONS 
    //\\ MAIN LOGIC
    ns.resizeTail(500, 160)
    while (true) {

        await ns.sleep(1000)
        ns.clearLog()

        let player = ns.getPlayer()
        await installBackdoor(ns, SERVER)

        if (ns.singularity.isBusy()) {

            let work = ns.singularity.getCurrentWork()

            if (work.type === "CREATE_PROGRAM") {

                // programs before faction en uni 
                ns.print("Creating " + work.programName + " can't follow class")

            } else if (work.type === "FACTION") {

                // faction work before uni 
                ns.print("Working with " + work.factionName + " can't follow class")

            } else if (work.type === "CLASS") {

                if (!work.classType === ns.enums.UniversityClassType.leadership) {

                    ns.print("Taking a class at " + work.location)
                    if (player.skills.charisma > CHARISMA) {

                        ns.singularity.stopAction()
                        scriptExit(ns)

                    } else {

                        ns.singularity.universityCourse(UNIVERSITY, LEADERSHIP_COURSE, FOCUS)

                    }
                }

            } else if (work.type === "COMPANY") {

                // stop company work 
                ns.print("Working a job at " + work.companyName)
                ns.singularity.stopAction()

            } else if (work.type === "CRIME") {

                // stop crime work 
                ns.print("Attempting to " + work.crimeType)
                ns.singularity.stopAction()

            }

        } else {

            // if nothing to do start uni
            if (player.city !== UNIVERSITY_LOCATION && player.money > TRAVEL_COST) {

                ns.print("Traveling to " + UNIVERSITY_LOCATION)
                ns.singularity.travelToCity(UNIVERSITY_LOCATION)

            } else {

                ns.singularity.universityCourse(UNIVERSITY, LEADERSHIP_COURSE, FOCUS)

            }
        }
    }
}
