import { scriptStart, scriptExit, scriptPath } from "lib/scripting"
import { getFactionServer } from "lib/factions"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA
    const FLAGS = ns.flags([
        ["cfo", false],
    ])
    const SCRIPT = scriptPath(ns)

    let COMPANY_NAME = ns.args[0]
    let COMPANY_REPUTATION = ns.args[1]

    const FOCUS = false
    const SERVER = getFactionServer(ns, COMPANY_NAME)

    //\\ FUNCTIONS 
    function goToUniversity(learn) {

        if (!ns.scriptRunning(SCRIPT.school, "home")) {

            let ramAvailable = ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
            if (ramAvailable > ns.getScriptRam(SCRIPT.school, "home")) {

                ns.run(SCRIPT.school, 1, learn)
            }
        }
    }

    function goToGym(a, b, c, d) {

        if (!ns.scriptRunning(SCRIPT.gym, "home")) {

            let ramAvailable = ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
            if (ramAvailable > ns.getScriptRam(SCRIPT.gym, "home")) {

                ns.run(SCRIPT.gym, 1, a, b, c, d)
            }
        }
    }

    function becomeCFO() {

        let list = []
        for (let key in CORPORATIONS) {

            let corp = CORPORATIONS[key]
            let positions = ns.singularity.getCompanyPositions(corp)

            // ns.print(corp)
            // ns.print(positions)
            // ns.print(" ")

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

    //\\ MAIN LOGIC
    ns.resizeTail(500, 160)

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
        await installBackdoor(ns, SERVER)

        let player = ns.getPlayer()

        if (ns.singularity.isBusy()) {

            let work = ns.singularity.getCurrentWork()

            if (work.type === "CREATE_PROGRAM") {

                ns.print("Creating " + work.programName + " can't work a job")

            } else if (work.type === "FACTION") {

                ns.print("Working with " + work.factionName + " can't work a job")

            } else if (work.type === "CLASS") {

                ns.print("Taking a class at " + work.location + " can't work a job")

            } else if (work.type === "COMPANY") {

                ns.print("Working a job at " + work.companyName)

                let positionNow = ns.singularity.getCompanyPositionInfo(COMPANY_NAME, ns.getPlayer().jobs[COMPANY_NAME])
                let positionNext = ns.singularity.getCompanyPositionInfo(COMPANY_NAME, positionNow.nextPosition)

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

                } else {

                    ns.singularity.applyToCompany(COMPANY_NAME, ns.enums.JobField.business)

                }

            } else if (work.type === "CRIME") {

                ns.print("Attempting to " + work.crimeType)
                ns.singularity.stopAction()

            }

        } else {

            let businessIntern = ns.singularity.getCompanyPositionInfo(COMPANY_NAME, ns.enums.JobName.business0)

            if (player.skills.hacking < businessIntern.requiredSkills.hacking) {

                ns.print("Hacking level is to low")

            } else if (player.skills.charisma < businessIntern.requiredSkills.charisma) {

                goToUniversity(businessIntern.requiredSkills.charisma)

            } else {

                ns.singularity.applyToCompany(COMPANY_NAME, ns.enums.JobField.business)
                ns.singularity.workForCompany(COMPANY_NAME, FOCUS)

            }
        }
    }
}
