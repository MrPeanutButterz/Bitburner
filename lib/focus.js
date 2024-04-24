/** @param {NS} ns */
export function focusType(ns) {
    return {
        program: "CREATE_PROGRAM",
        school: "SCHOOL",
        gym: "GYM",
        company: "COMPANY",
        crime: "CRIME",
        faction: "FACTION",
    }
}

/** @param {NS} ns */
export function focusPrio(ns, focusOn) {

    if (ns.singularity.isBusy()) {

        let work = ns.singularity.getCurrentWork()

        if (work.type === "CREATE_PROGRAM") {

            ns.print("Creating " + work.programName)
            return ["CREATE_PROGRAM"].includes(focusOn)

        } else if (work.type === "CLASS") {

            if (["str", "def", "dex", "agi"].includes(work.classType)) {

                ns.print("At the gym working on " + work.classType)
                return ["SCHOOL", "GYM"].includes(focusOn)

            } else {

                ns.print("At school working on " + work.classType)
                return ["SCHOOL"].includes(focusOn)
            }

        } else if (work.type === "COMPANY") {

            ns.print("Working a job at " + work.companyName)
            return ["CREATE_PROGRAM", "SCHOOL", "GYM", "COMPANY"].includes(focusOn)

        } else if (work.type === "CRIME") {

            ns.print("Attempting to " + work.crimeType)
            return ["CREATE_PROGRAM", "SCHOOL", "GYM", "COMPANY", "CRIME"].includes(focusOn)

        } else if (work.type === "FACTION") {

            ns.print("Working with " + work.factionName)
            return ["CREATE_PROGRAM", "SCHOOL", "GYM", "COMPANY", "CRIME", "FACTION"].includes(focusOn)
        }

    } else { return true }
}