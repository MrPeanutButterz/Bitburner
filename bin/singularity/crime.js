import { scriptStart, scriptExit } from "lib/scripting"

/** @param {NS} ns */
export async function main(ns) {

    // make list of crimes 
    // sort on chance
    // sort chance to max profit 
    // commit crime 

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA
    const FLAGS = ns.flags([["money", false]])
    let T = 1000

    const FOCUS = false
    const KILLS_REQUIRED = ns.args[0]
    const KARMA_REQUIRED = ns.args[1]
    const CRIMETYPES = ns.enums.CrimeType

    //\\ FUNCTIONS 
    function crimeForMoney() {

        let list = []
        for (let crime in CRIMETYPES) {

            if (ns.singularity.getCrimeChance(crime) > 0.75) {

                list.push({
                    type: ns.singularity.getCrimeStats(crime).type,
                    time: ns.singularity.getCrimeStats(crime).time,
                    money: ns.singularity.getCrimeStats(crime).money,
                    moneySec: ns.singularity.getCrimeStats(crime).money / ns.singularity.getCrimeStats(crime).time,
                })
            }
        }
        list.sort((a, b) => a.moneySec - b.moneySec).reverse()

        if (list.length > 0) {
            return list[0].type

        } else {

            return ns.enums.CrimeType.shoplift
        }
    }

    function crimeForKills() {

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

        let list = []
        for (let key in CRIMETYPES) {

            if (ns.singularity.getCrimeStats(key).karma > 0 &&
                ns.singularity.getCrimeChance(key) > 0.75) {

                list.push({
                    type: key,
                    chance: ns.singularity.getCrimeChance(key),
                    karma: ns.singularity.getCrimeStats(key).karma,
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

    function commitCrime() {

        // check hp
        // kills
        // karma 

        let player = ns.getPlayer()

        ns.print("Health \t" + player.hp.current + " / " + player.hp.max)
        ns.print("Killed \t" + player.numPeopleKilled)
        ns.print("karma  \t" + player.karma.toPrecision(3))

        if (FLAGS.money) {

            if (player.hp.current < player.hp.max) {

                ns.singularity.hospitalize()

            } else {

                ns.singularity.commitCrime(crimeForMoney(), FOCUS)
                return ns.singularity.getCrimeStats(crimeForKills()).time
            }

        } else {

            if (player.hp.current < player.hp.max) {

                ns.singularity.hospitalize()

            } else if (player.numPeopleKilled < KILLS_REQUIRED) {

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

        await ns.sleep(T + 200)
        ns.clearLog()

        if (ns.singularity.isBusy()) {

            let work = ns.singularity.getCurrentWork()

            if (work.type === "CREATE_PROGRAM") {

                ns.print("Creating " + work.programName + " can't do crime")

            } else if (work.type === "FACTION") {

                ns.print("Working with " + work.factionName + " can't do crime")

            } else if (work.type === "CLASS") {

                ns.print("Taking a class at " + work.location + " can't do crime")

            } else if (work.type === "COMPANY") {

                ns.print("Working a job at " + work.companyName + " can't do crime")

            } else if (work.type === "CRIME") {

                ns.print("Attempting to " + work.crimeType)
                T = commitCrime()

            }

        } else {

            T = commitCrime()
        }
    }
}
