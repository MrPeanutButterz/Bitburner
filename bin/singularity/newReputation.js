/** @param {NS} ns */
export async function main(ns) {

    // bleuprint version

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ GENERAL DATA
    //\\ FUNCTIONS 
    //\\ MAIN LOGIC
    ns.resizeTail(500, 160)
    while (true) {

        await ns.sleep(500)
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
                ns.singularity.stopAction()
                
            } else if (work.type === "COMPANY") {
                
                ns.print("Working a job at " + work.companyName)
                ns.singularity.stopAction()
                
            } else if (work.type === "CRIME") {
                
                ns.print("Attempting to " + work.crimeType)
                ns.singularity.stopAction()

            }

        } else {

            // start 
            ns.print("Nothing going on here...")

        }
    }
}
