import { scriptStart, scriptPath } from "modules/scripting"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA
    const SCRIPT = scriptPath(ns)
    const FOCUS = false

    let FACTION = ns.args[0]
    let REPUTATION_START = ns.singularity.getFactionRep(FACTION)
    let REPUTATION_GOAL = calculateRepGoal(FACTION)

    let TIME = 0
    let TASK = FACTION === "Slum Snakes" || FACTION === "Tetrads" ? TASK = "Field work" : "Hacking contracts"

    //\\ FUNCTIONS 
    function calculateRepGoal(f) {

        let rep = 0
        ns.singularity.getAugmentationsFromFaction(f).forEach(a => {
            if (ns.singularity.getAugmentationRepReq(a) > rep) {
                rep = ns.singularity.getAugmentationRepReq(a)
            }
        })
        return rep
    }

    function calculateCompletionTime(f) {

        let reputationNow = ns.singularity.getFactionRep(f)
        let reputationPerSecond = (reputationNow - REPUTATION_START) / TIME

        let reputaitonLeft = REPUTATION_GOAL - reputationNow
        let ticks = reputaitonLeft / reputationPerSecond

        var hh = Math.floor(ticks / 3600)
        var mm = Math.floor((ticks % 3600) / 60)
        var ss = Math.round(ticks % 60)

        let hours = hh < 10 ? "0" + `${hh}` : hh
        let minutes = mm < 10 ? "0" + `${mm}` : mm
        let seconds = ss < 10 ? "0" + `${ss}` : ss

        return hours + ":" + minutes + ":" + seconds

    }

    //\\ MAIN LOGIC
    while (ns.singularity.getFactionRep(FACTION) < calculateRepGoal(FACTION)) {

        await ns.sleep(1000)
        ns.clearLog()

        if (TIME === 60) { ns.tprint(FACTION + " completion time estimation in " + calculateCompletionTime(FACTION)) }

        if (ns.singularity.isBusy()) {

            let work = ns.singularity.getCurrentWork()

            if (work.type === "CREATE_PROGRAM") {

                ns.print("Creating " + work.programName + " can't build reputation")

            } else if (work.type === "FACTION") {

                ns.print("Working with " + work.factionName)
                ns.print("Completion time est\t" + calculateCompletionTime(FACTION))
                ns.print("Reputation \t\t" + Math.round(ns.singularity.getFactionRep(FACTION)) + "/" + REPUTATION_GOAL)
                ns.print("Completed \t\t" + ((ns.singularity.getFactionRep(FACTION) / REPUTATION_GOAL) * 100).toPrecision(4) + "%")

                ns.singularity.workForFaction(FACTION, TASK, FOCUS)
                TIME++

            } else if (work.type === "CLASS") {

                ns.print("Taking a class at " + work.location + " can't build reputation")

            } else if (work.type === "COMPANY") {

                ns.print("Working a job at " + work.companyName + " can't build reputation")

            } else if (work.type === "CRIME") {

                ns.print("Attempting to " + work.crimeType + " can't build reputation")

            }

        } else {

            ns.singularity.workForFaction(FACTION, TASK, FOCUS)

        }
    }

    ns.singularity.stopAction()
    ns.closeTail()
    ns.spawn(SCRIPT.faction, { threads: 1, spawnDelay: 500 })
}
