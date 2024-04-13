import { scriptStart, scriptExit } from "modules/scripting"

/** @param {NS} ns */
export async function main(ns) {

    // bleuprint version

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA
    const SCRIPT = scriptPath(ns)

    const FOCUS = false
    const COMPANY_NAME = ns.args[0]
    const COMPANY_REPUTATION = ns.args[1]

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

    //\\ MAIN LOGIC
    ns.resizeTail(500, 160)

    if (COMPANY_NAME === undefined) { COMPANY_REPUTATION = ns.enums.CompanyName.FourSigma }
    if (COMPANY_REPUTATION === undefined) { COMPANY_REPUTATION = 8e5 + 100 }

    while (true) {

        await ns.sleep(1000)
        ns.clearLog()

        let player = ns.getPlayer()

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

                // get next position
                // hacking level
                // company reputation
                // str def dex agi
                // charisma
                // apply next position
                // company reputation > exit

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

            // hack level 
            // charisma 
            // apply job
            // start working

            let businessIntern = ns.singularity.getCompanyPositionInfo(COMPANY_NAME, ns.enums.JobName.business0)

            if (player.skills.hacking < businessIntern.requiredSkills.hacking) {

                ns.tprint("Hacking level is to low")

            } else if (player.skills.charisma < businessIntern.requiredSkills.charisma) {

                goToUniversity(businessIntern.requiredSkills.charisma)

            } else {

                ns.singularity.applyToCompany(COMPANY_NAME, ns.enums.JobField.business)
                ns.singularity.workForCompany(COMPANY_NAME, FOCUS)

            }
        }
    }
}
