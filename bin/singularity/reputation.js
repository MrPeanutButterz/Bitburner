import { scriptStart, scriptPath } from "lib/scripting"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA
    const FLAGS = ns.flags([["story", false]])
    const SCRIPT = scriptPath(ns)
    const DONATION = 1e9 // 
    const BALANCE_TRIGGER_THRESHOLD = 1e11 // 100b
    const COMPLETION_TRIGGER = 80 // 80%

    let FOCUS = false
    let FACTION = ns.args[0]
    let REPUTATION = 0
    let REPUTATION_GOAL = calculateRepGoal(FACTION)

    let TASK
    TASK = FACTION === "Slum Snakes" || FACTION === "Tetrads" ? TASK = ns.enums.FactionWorkType.field : ns.enums.FactionWorkType.hacking

    //\\ FUNCTIONS 
    function calculateRepGoal(f) {

        let rep = 0
        let augmentationsInstalled = ns.singularity.getOwnedAugmentations()
        ns.singularity.getAugmentationsFromFaction(f).forEach(a => {
            if (ns.singularity.getAugmentationRepReq(a) > rep && a != "NeuroFlux Governor") {
                if (!augmentationsInstalled.includes(a)) {
                    rep = ns.singularity.getAugmentationRepReq(a)
                }
            }
        })
        return Math.ceil(rep)
    }

    function calculateCompletionTime() {

        let reputationNow = ns.singularity.getFactionRep(FACTION)
        let reputationPerSecond = (reputationNow - REPUTATION).toFixed(3)

        let reputaitonLeft = REPUTATION_GOAL - reputationNow
        let ticks = reputaitonLeft / reputationPerSecond

        let hh = Math.floor(ticks / 3600)
        let mm = Math.floor((ticks % 3600) / 60)
        let ss = Math.round(ticks % 60)

        let hours = hh < 10 ? "0" + `${hh}` : hh
        let minutes = mm < 10 ? "0" + `${mm}` : mm
        let seconds = ss < 10 ? "0" + `${ss}` : ss

        return hours + ":" + minutes + ":" + seconds
    }

    function calculateTotalFavor(f) {

        let reputationPast = Math.floor(25500 * Math.pow(1.02, ns.singularity.getFactionFavor(f) - 1) - 25000)
        let reputationSession = ns.singularity.getFactionRep(f)
        let reputation = reputationPast + reputationSession

        return Math.floor(1 + Math.log((reputation + 25000) / 25500) / Math.log(1.02))
    }

    //\\ MAIN LOGIC
    while (ns.singularity.getFactionRep(FACTION) < calculateRepGoal(FACTION)) {

        REPUTATION = ns.singularity.getFactionRep(FACTION)
        await ns.sleep(1000)
        ns.clearLog()

        if (ns.singularity.isBusy()) {

            let work = ns.singularity.getCurrentWork()

            if (work.type === "CREATE_PROGRAM") {

                ns.print("Creating " + work.programName + " can't build reputation")

            } else if (work.type === "FACTION") {

                ns.print("Working for " + work.factionWorkType)
                ns.print("Reputation \t\t" + Math.round(ns.singularity.getFactionRep(FACTION)) + "/" + REPUTATION_GOAL)
                ns.print("Time estimate \t\t" + calculateCompletionTime())
                ns.print("Completion \t\t" + ((ns.singularity.getFactionRep(FACTION) / REPUTATION_GOAL) * 100).toPrecision(4) + "%")
                ns.print("Total favor \t\t" + calculateTotalFavor(FACTION))
                ns.print("Favor \t\t\t" + Math.round(ns.singularity.getFactionFavor(FACTION)))

                ns.singularity.workForFaction(FACTION, TASK, FOCUS)

                if (calculateTotalFavor(FACTION) >= 150 &&
                    (ns.singularity.getFactionRep(FACTION) / REPUTATION_GOAL) * 100 < COMPLETION_TRIGGER &&
                    ns.singularity.getFactionFavor(FACTION) < 150) {

                    ns.spawn(SCRIPT.install, { threads: 1, spawnDelay: 500 }, FACTION, "--neuroflux")

                }

                if (ns.singularity.getFactionFavor(FACTION) >= 150 &&
                    ns.getServerMoneyAvailable("home") > BALANCE_TRIGGER_THRESHOLD) {
                    ns.singularity.donateToFaction(FACTION, DONATION)
                }

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
    FLAGS.story ? ns.spawn(SCRIPT.faction, { threads: 1, spawnDelay: 500 }, "--story") : ns.spawn(SCRIPT.faction, { threads: 1, spawnDelay: 500 })
}
