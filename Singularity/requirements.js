/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz
Proces: completes requirements for any faction */

import { getSleepTime, getScriptsPath, getFactionServer, getFactionStats } from "./conf.js"
import { getProgramCount, getRootAccess, getServerPath } from "./lib.js"

export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.toast("requirements online", "success", 2000)
    ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ GENERAL DATA
    let speed = getSleepTime(ns)
    let script = getScriptsPath(ns)

    let faction = ns.args[0]
    let factionStats = getFactionStats(ns, faction)
    let factionServer = getFactionServer(ns, faction)

    //\\ SCRIPT SPECIFIC FUNCTIONS
    function displayOptions(faction, action) {

        //display current faction & action

        ns.clearLog()
        ns.print("Working on: " + faction)
        ns.print("Current action: " + action)
    }

    function checkInvitations(faction) {

        //returns (boolean) if the best faction has sent an invite 

        let list = ns.singularity.checkFactionInvitations()
        let found = list.find(element => element == faction)

        if (ns.singularity.joinFaction(faction) || found === faction) {
            ns.run(script.findFaction, 1)
            ns.closeTail()
            ns.exit()
        }
    }

    //\\ MAIN LOGICA
    if (faction === "Netburners") {

        while (true) {
            await ns.sleep(speed.medium)

            if (ns.hacknet.numNodes() < 4) {
                if (!ns.scriptRunning(script.buyHacknet, "home")) {
                    ns.run(script.buyHacknet, 1, 4, 25, 2, 1)
                }
            }
            checkInvitations(faction)

        }

    } else if (faction == "CyberSec" || faction == "NiteSec" || faction == "The Black Hand" || faction == "BitRunners") {

        while (true) {
            await ns.sleep(speed.medium)

            if (ns.getPlayer().skills.hacking < ns.getServerRequiredHackingLevel(factionServer)) {

                displayOptions(faction, "Awaiting hack level")

            } else if (getProgramCount(ns) < ns.getServerNumPortsRequired(factionServer)) {

                displayOptions(faction, "Awaiting hack programs")

            } else if (!ns.hasRootAccess(factionServer)) {

                displayOptions(faction, "Getting root access")
                getRootAccess(ns, factionServer)

            } else if (!ns.getServer(factionServer).backdoorInstalled) {

                displayOptions(faction, "Installing backdoor")
                let serverPath = getServerPath(ns, factionServer)
                for (let node of serverPath) { ns.singularity.connect(node) }

                await ns.singularity.installBackdoor(factionServer)
                ns.singularity.connect("home")

            } else {

                displayOptions(faction, "Awaiting invite from " + faction)
                checkInvitations(faction)

            }
        }

    } else if (faction == "Tian Di Hui" || faction == "Sector-12" || faction == "Chongqing" || faction == "New Tokyo" || faction == "Ishima" || faction == "Aevum" || faction == "Volhaven") {




    } else if (faction == "ECorp" || faction == "MegaCorp" || faction == "KuaiGong International" || faction == "Four Sigma" || faction == "NWO" || faction == "Blade Industries" || faction == "OmniTek Incorporated" || faction == "Bachman & Associates" || faction == "Clarke Incorporated" || faction == "Fulcrum Secret Technologies") {

        //hack level
        //number programs
        //get root access
        //install backdoor

        //go to location
        //study leadership in sector 12

        //apply for job
        //work until CEO

        //invite

    } else if (faction == "Slum Snakes" || faction == "Tetrads" || faction == "Silhouette" || faction == "Speakers for the Dead" || faction == "The Dark Army" || faction == "The Syndicate") {

        //pump stats
        ns.print(factionStats)
        //invite

    } else if (faction == "The Covenant" || faction == "Daedalus" || faction == "Illuminati") {

        //do something 

    } else {

        ns.print("All factions have been completed!")

    }
}