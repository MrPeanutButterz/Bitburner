import { scriptStart, scriptExit } from "lib/settings"
import { installBackdoor } from "lib/network"
import { focusType, focusPrio } from "/lib/focus"

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
    const FOCUSTYPE = focusType(ns)

    //\\ FUNCTIONS 
    async function followClass() {

        // go to location 
        // follow class
        // stop when completed

        let player = ns.getPlayer()
        await installBackdoor(ns, SERVER)

        if (player.city !== UNIVERSITY_LOCATION && player.money > TRAVEL_COST) {

            ns.print("Traveling to " + UNIVERSITY_LOCATION)
            ns.singularity.travelToCity(UNIVERSITY_LOCATION)

        } if (player.skills.charisma < CHARISMA) {

            ns.singularity.universityCourse(UNIVERSITY, LEADERSHIP_COURSE, FOCUS)

        } else {

            ns.singularity.stopAction()
            scriptExit(ns)
        }


    }

    //\\ MAIN LOGIC
    while (true) {

        await ns.sleep(1000)
        ns.clearLog()
        if (focusPrio(ns, FOCUSTYPE.school)) { await followClass() }
    }
}
