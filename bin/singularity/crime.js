import { scriptStart, scriptExit, scriptPath } from "lib/scripting"
import { NmapTotalRam } from "/lib/network"
import { focusType, focusPrio } from "/lib/focus"

/** @param {NS} ns */
export async function main(ns) {

    /**
     * When starting the script, you'll need to provide two arguments: Kills and Karma. Or With a --money flag.
     * Initially, it will focus on Kills, achieved through homicide. Once that's completed, 
     * it will shift to Karma, accomplished via robStore. If the player's health points decrease, 
     * a visit to the hospital will be prioritized. Once all stats are addressed, the script will close itself. 
     * crime.js is part of a focus on working on a program, faction, class, or company, all of which take precedence over crime.
    */

    //\\ SCRIPT SETTINGS
    scriptStart(ns)
    const SCRIPT = scriptPath(ns)

    //\\ GENERAL DATA
    const FOCUS = false
    const KILLS_REQUIRED = ns.args[0]
    const KARMA_REQUIRED = ns.args[1]
    const CRIMETYPES = ns.enums.CrimeType
    const FOCUSTYPE = focusType(ns)

    let TIME = 1000

    //\\ FUNCTIONS 
    function crimeForMoney() {

        // first option is chance > 75%
        // make list en sort on money per sec
        // if no option take the one with most chance
        // @return option one or two

        let list = []
        for (let crime in CRIMETYPES) {

            if (ns.singularity.getCrimeChance(crime) > 0.75) {

                list.push({
                    type: ns.singularity.getCrimeStats(crime).type,
                    moneySec: ns.singularity.getCrimeStats(crime).money / ns.singularity.getCrimeStats(crime).time,
                })
            }
        }
        list.sort((a, b) => a.moneySec - b.moneySec).reverse()

        if (list.length > 0) {
            return list[0].type

        } else {

            let secondOption = { type: "", chance: 0 }

            for (let crime in CRIMETYPES) {

                let chance = ns.singularity.getCrimeChance(crime)
                if (chance > secondOption.chance) {
                    secondOption = {
                        type: ns.singularity.getCrimeStats(crime).type,
                        chance: chance,
                    }
                }
            }

            return secondOption.type
        }
    }

    function crimeForKills() {

        // find what crime gets kills 
        // @return crime 

        let list = []
        for (let crime in CRIMETYPES) {

            if (ns.singularity.getCrimeStats(crime).kills > 0) {

                list.push({
                    type: crime,
                    chance: ns.singularity.getCrimeChance(crime),
                    kills: ns.singularity.getCrimeStats(crime).kills,
                })
            }
        }
        let bestPick = list.reduce(function (max, obj) {
            return list.chance > max.num ? obj : max;
        })
        return bestPick.type
    }

    function crimeForKarma() {

        // make list of crime with 75% chance 
        // find option with most karma
        // return option

        let list = []
        for (let crime in CRIMETYPES) {

            if (ns.singularity.getCrimeStats(crime).karma > 0 &&
                ns.singularity.getCrimeChance(crime) > 0.75) {

                list.push({
                    type: crime,
                    chance: ns.singularity.getCrimeChance(crime),
                    karma: ns.singularity.getCrimeStats(crime).karma,
                })
            }
        }

        if (list.length === 0) {

            return ns.enums.CrimeType.shoplift

        } else {

            let bestPick = list.reduce(function (max, obj) {
                return list.karma > max.num ? max : obj;
            })
            return bestPick
        }
    }

    function pauseForRequirements() {

        const excludeArgs = ["Slum Snakes", "Tetrads", "Silhouette", "Speakers for the Dead", "The Dark Army", "The Syndicate"]
        let isRunning = false

        excludeArgs.forEach(args => {
            if (Boolean(ns.getRunningScript(SCRIPT.requirement, "home", args))) {
                isRunning = true
            }
        })
        return isRunning
    }

    async function commitCrime() {

        // check hp 
        // commit crime 

        let player = ns.getPlayer()

        ns.print("Health \t" + player.hp.current + " / " + player.hp.max)
        ns.print("Killed \t" + player.numPeopleKilled)
        ns.print("karma  \t" + player.karma.toFixed(2))

        if (player.hp.current < player.hp.max) { ns.singularity.hospitalize() }

        if (KARMA_REQUIRED === undefined && KILLS_REQUIRED === undefined) {

            if (NmapTotalRam(ns) < 5000) {

                if (!pauseForRequirements()) {

                    ns.singularity.commitCrime(crimeForMoney(), FOCUS)
                    return ns.singularity.getCrimeStats(crimeForMoney()).time

                } else {

                    ns.print("Waiting for requirements...")
                }

            } else {

                ns.singularity.stopAction()
                scriptExit(ns)
            }


        } else {

            if (player.numPeopleKilled < KILLS_REQUIRED) {

                ns.singularity.commitCrime(crimeForKills(), FOCUS)
                return ns.singularity.getCrimeStats(crimeForKills()).time

            } else if (player.karma > KARMA_REQUIRED) {

                ns.singularity.commitCrime(crimeForKarma(), FOCUS)
                return ns.singularity.getCrimeStats(crimeForKarma()).time

            } else {

                ns.singularity.stopAction()
                scriptExit(ns)
            }
        }
    }

    //\\ MAIN LOGIC
    while (true) {

        await ns.sleep(TIME)
        ns.clearLog()
        if (focusPrio(ns, FOCUSTYPE.crime)) { TIME = await commitCrime() }
    }
}
