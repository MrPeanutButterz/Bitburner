/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.toast("reputation online", "success", 2000)
    ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ GENERAL DATA
    // let script = getScriptsPath(ns)

    let faction = ns.args[0]
    let reputation = ns.args[1]

    let testRunTime = 10
    let task = "Hacking contracts"
    if (faction === "Slum Snakes" || faction === "Tetrads") { task = "Field work" }

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
    await ns.sleep(3000)

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

        await ns.sleep(1000)
        ns.clearLog()

        // display
        ns.print("Faction \t" + faction)
        ns.print("Reputation \t" + Math.round(ns.singularity.getFactionRep(faction)) + "/" + Math.round(reputation))
        ns.print("A.T.A. \t\t" + msToTime(timeToAugmentation * 1000))
        ns.print("Completed \t" + (ns.singularity.getFactionRep(faction) / reputation * 100).toPrecision(4) + "%")

        if (ns.singularity.isBusy()) {

            let work = ns.singularity.getCurrentWork()
            if (work.type === "CREATE_PROGRAM") {

                ns.print("PENDING \t" + work.programName + " completion")
                timeToAugmentation++

            } else {
                ns.singularity.workForFaction(faction, task, false)
                timeToAugmentation--

            }

        } else {
            ns.singularity.workForFaction(faction, task, false)
            timeToAugmentation--

        }
    }

    //restart findFactions 
    ns.singularity.stopAction()
    // ns.run(script.findFaction, 1)
    ns.closeTail()
}
