/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz
Proces: start working on reputation */

import { getScriptsPath, getSleepTime } from "./Default/config.js"

export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.toast("reputation online", "success", 2000)
    ns.resizeTail(500, 130)
    ns.moveTail(1200, 20)
    ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ GENERAL DATA
    let speed = getSleepTime(ns)
    let script = getScriptsPath(ns)

    let faction = ns.args[0]
    let reputation = ns.args[1]

    let testRunTime = 10
    let task = "Hacking contracts"
    if (faction === "Silhouette" || faction === "Slum Snakes") { task = "Field work" }

    //get initial reputation
    let initialReputation = ns.singularity.getFactionRep(faction)

    //start run
    ns.singularity.stopAction()
    ns.print("Test run duration: \t" + testRunTime + " sec")
    ns.singularity.workForFaction(faction, task, false);

    //finish run
    await ns.asleep((testRunTime) * 1000)
    ns.singularity.stopAction()

    //calculate result rep/time
    let newReputation = ns.singularity.getFactionRep(faction)
    let reputationPerSecond = (newReputation - initialReputation) / testRunTime
    let timeToAugmentation = reputation / reputationPerSecond

    //display
    ns.print("Rate: \t\t\t" + reputationPerSecond.toPrecision(5) + "/" + testRunTime + " sec")
    ns.print("Time estimate: \t\t" + msToTime(timeToAugmentation * 1000))
    ns.print(" ")
    ns.print("Speed run completed...")
    await ns.sleep(speed.superSlow)

    //\\ SCRIPT SPECIFIC FUNCTIONS
    function msToTime(duration) {

        //converts miliseconds to time format

        let milliseconds = parseInt((duration % 1000) / 100),
            seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
    }

    //\\ MAIN LOGICA
    while (ns.singularity.getFactionRep(faction) < reputation) {
        await ns.sleep(speed.medium)

        //work...
        ns.singularity.workForFaction(faction, task, false)

        //display
        ns.clearLog()
        ns.print("Hacking contracts for: \t\t" + faction)
        ns.print("Reputation needed: \t\t" + Math.round(ns.singularity.getFactionRep(faction)) + "/" + reputation)
        ns.print("Total time estimate: \t\t" + msToTime(timeToAugmentation * 1000))

        let procentDone = ns.singularity.getFactionRep(faction) / reputation * 100
        ns.print("Completed: \t\t\t" + procentDone.toPrecision(4) + "%")

    }

    //restart findFactions 
    ns.singularity.stopAction()
    ns.run(script.findFaction, 1)
    ns.closeTail()

}