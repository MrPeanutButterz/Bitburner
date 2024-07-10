import { scriptStart, scriptPath } from "lib/settings"
import { canRunOnHome } from "lib/network"
import { focusType, focusPrio } from "/lib/focus"
import { settings } from "../../lib/settings"

/** @param {NS} ns */
export async function main(ns) {

    /**
    *  ____                  _        _   _             
    * |  _ \ ___ _ __  _   _| |_ __ _| |_(_) ___  _ __  
    * | |_) / _ \ '_ \| | | | __/ _` | __| |/ _ \| '_ \ 
    * |  _ <  __/ |_) | |_| | || (_| | |_| | (_) | | | |
    * |_| \_\___| .__/ \__,_|\__\__,_|\__|_|\___/|_| |_|
    *           |_|
    * 
    * ✅ find augmentation with highest reputation as the goal
    * ✅ start working on reputation
    * ☑ run preInstall script for gangs?
    * ✅ if favor is reached run install.js
    * ✅ if donations buy reputation 
    */

    //\\ SCRIPT SETTINGS
    scriptStart(ns)
    const setting = settings(ns)

    //\\ GENERAL DATA
    const FLAGS = ns.flags([["story", false]])
    const SCRIPT = scriptPath(ns)
    const DONATION = 1e9 // 1b
    const BALANCE_TRIGGER_THRESHOLD = 2e11 // 100b
    const COMPLETION_TRIGGER = 90 // 90%
    const FAVOR_TARGET = setting.favorTarget
    const FOCUSTYPE = focusType(ns)

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

    async function followUpScript() {

        while (true) {
            if (ns.scriptRunning(SCRIPT.share, "home")) { ns.scriptKill(SCRIPT.share, "home") }
            if (canRunOnHome(ns, SCRIPT.faction)) {


                ns.singularity.stopAction()
                ns.closeTail()
                FLAGS.story ?
                    ns.spawn(SCRIPT.faction, { threads: 1, spawnDelay: 500 }, "--story") :
                    ns.spawn(SCRIPT.faction, { threads: 1, spawnDelay: 500 })

            } else {

                await ns.sleep(1000)
            }
        }
    }

    function preInstall() {
        if (calculateTotalFavor(FACTION) >= FAVOR_TARGET &&
            ns.singularity.getAugmentationRepReq("NeuroFlux Governor") < ns.singularity.getFactionRep(FACTION) &&
            (ns.singularity.getFactionRep(FACTION) / REPUTATION_GOAL) * 100 < COMPLETION_TRIGGER &&
            ns.singularity.getFactionFavor(FACTION) < FAVOR_TARGET) {

            ns.spawn(SCRIPT.install, { threads: 1, spawnDelay: 500 }, FACTION, "--neuroflux")
        }
    }

    function donate() {
        if (ns.singularity.getFactionFavor(FACTION) >= FAVOR_TARGET &&
            ns.getServerMoneyAvailable("home") > BALANCE_TRIGGER_THRESHOLD) {
            ns.singularity.donateToFaction(FACTION, DONATION)
        }
    }

    function display() {
        ns.print("Reputation \t\t" + Math.round(ns.singularity.getFactionRep(FACTION)) + "/" + REPUTATION_GOAL)
        ns.print("Time estimate \t\t" + calculateCompletionTime())
        ns.print("Completion \t\t" + ((ns.singularity.getFactionRep(FACTION) / REPUTATION_GOAL) * 100).toPrecision(4) + "%")
        ns.print("Total favor \t\t" + calculateTotalFavor(FACTION))
        ns.print("Favor \t\t\t" + Math.round(ns.singularity.getFactionFavor(FACTION)))
    }

    function factionWork() {

        ns.singularity.workForFaction(FACTION, TASK, FOCUS)
        display()
        preInstall()
        donate()

        if ((ns.singularity.getFactionRep(FACTION) / REPUTATION_GOAL) * 100 > 85 &&
            ns.getRunningScript(SCRIPT.servers)) {
            ns.scriptKill(SCRIPT.servers, "home")
        }
    }

    //\\ MAIN LOGIC
    if (ns.getServerMaxRam("home") > 2000) { ns.exec(SCRIPT.sharePower, "home", 1, "--home") }

    while (ns.singularity.getFactionRep(FACTION) < calculateRepGoal(FACTION)) {

        REPUTATION = ns.singularity.getFactionRep(FACTION)
        await ns.sleep(1000)
        ns.clearLog()
        if (focusPrio(ns, FOCUSTYPE.faction)) { factionWork() }
    }

    await followUpScript()
}
