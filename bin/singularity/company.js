import { scriptStart, scriptExit, scriptPath } from "lib/scripting"
import { canRunOnHome, installBackdoor } from "lib/network"
import { getFactionServer } from "lib/factions"
import { focusType, focusPrio } from "/lib/focus"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA
    const FLAGS = ns.flags([
        ["cfo", false],
    ])
    const SCRIPT = scriptPath(ns)
    const FOCUSTYPE = focusType(ns)

    let COMPANY_NAME = ns.args[0]
    let COMPANY_REPUTATION = ns.args[1]

    const FOCUS = false
    const CORPORATIONS = ns.enums.CompanyName
    const SERVER = getFactionServer(ns, COMPANY_NAME)

    //\\ FUNCTIONS 
    function goToUniversity(learn) {

        if (canRunOnHome(ns, SCRIPT.school)) {
            ns.run(SCRIPT.school, 1, learn)
        }
    }

    function goToGym(a, b, c, d) {

        if (canRunOnHome(ns, SCRIPT.gym)) {
            ns.run(SCRIPT.gym, 1, a, b, c, d)
        }
    }

    function becomeCFO() {

        let list = []
        for (let key in CORPORATIONS) {

            let corp = CORPORATIONS[key]
            let positions = ns.singularity.getCompanyPositions(corp)

            if (positions.includes("Chief Financial Officer")) {
                list.push({
                    name: corp,
                    favor: ns.singularity.getCompanyFavor(corp)
                })
            }
        }
        list.sort((a, b) => a.favor - b.favor).reverse()
        if (list.length > 0) {
            return list[0].name

        } else {
            return ns.enums.CompanyName.FourSigma
        }
    }

    function hasApplied(jobs, company) {
        return jobs.hasOwnProperty(company)
    }

    function workJob() {

        let player = ns.getPlayer()
        let hasJob = hasApplied(player.jobs, COMPANY_NAME)

        if (!hasJob) {

            let businessIntern = ns.singularity.getCompanyPositionInfo(COMPANY_NAME, ns.enums.JobName.business0)
            if (player.skills.hacking < businessIntern.requiredSkills.hacking) {

                ns.print("Hacking level is to low")

            } else if (player.skills.charisma < businessIntern.requiredSkills.charisma) {

                goToUniversity(businessIntern.requiredSkills.charisma)

            } else {

                ns.singularity.applyToCompany(COMPANY_NAME, ns.enums.JobField.business)
            }

        } else {

            let positionNow = ns.singularity.getCompanyPositionInfo(COMPANY_NAME, ns.getPlayer().jobs[COMPANY_NAME])
            let positionNext = ns.singularity.getCompanyPositionInfo(COMPANY_NAME, positionNow.nextPosition)

            ns.singularity.workForCompany(COMPANY_NAME, FOCUS)
            ns.singularity.applyToCompany(COMPANY_NAME, ns.enums.JobField.business)

            if (ns.singularity.getCompanyRep(COMPANY_NAME) > COMPANY_REPUTATION) {

                ns.singularity.stopAction()
                scriptExit(ns)

            } else if (player.skills.hacking < positionNext.requiredSkills.hacking) {

                ns.print("Awaiting hack level")

            } else if (ns.singularity.getCompanyRep(COMPANY_NAME) < positionNext.requiredReputation) {

                ns.print("Building reputation as a " + positionNow.name)

            } else if (
                player.skills.strength < positionNext.requiredSkills.strength ||
                player.skills.defense < positionNext.requiredSkills.defense ||
                player.skills.dexterity < positionNext.requiredSkills.dexterity ||
                player.skills.agility < positionNext.requiredSkills.agility) {

                goToGym(
                    positionNext.requiredSkills.strength,
                    positionNext.requiredSkills.defense,
                    positionNext.requiredSkills.dexterity,
                    positionNext.requiredSkills.agility
                )

            } else if (player.skills.charisma < positionNext.requiredSkills.charisma) {

                goToUniversity(positionNext.requiredSkills.charisma)

            }
        }
    }

    //\\ MAIN LOGIC
    if (FLAGS.cfo) {

        COMPANY_NAME = becomeCFO()
        COMPANY_REPUTATION = 8e5

    } else {

        if (COMPANY_NAME === undefined) { COMPANY_NAME = ns.enums.CompanyName.FourSigma }
        if (COMPANY_REPUTATION === undefined) { COMPANY_REPUTATION = 8e5 + 100 }
    }

    while (true) {

        await ns.sleep(1000)
        ns.clearLog()
        if (focusPrio(ns, FOCUSTYPE.company)) { workJob() }
    }
}
