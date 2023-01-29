/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz
Proces: completes requirements for any faction */

import { getSleepTime, getScriptsPath, getFactionServer, getFactionStats } from "./Default/config.js"
import { getProgramCount, getRootAccess, getServerPath } from "./Default/library.js"

export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.toast("requirements online", "success", 2000)
    ns.resizeTail(500, 130)
    ns.moveTail(1200, 20)
    ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ GENERAL DATA
    let speed = getSleepTime(ns)
    let script = getScriptsPath(ns)

    let faction = ns.args[0]
    let requirement = getFactionStats(ns, faction)
    let factionServer = getFactionServer(ns, faction)

    const gymLocation = "Sector-12"
    const gym = "powerhouse gym"
    const ticket = 200000

    //\\ SCRIPT SPECIFIC FUNCTIONS
    function displayStatus(faction, server, action) {

        //display current faction, server, action

        ns.clearLog()
        ns.print("Faction: \t" + faction)
        ns.print("Server: \t" + server)
        ns.print("Action: \t" + action)
    }

    function checkInvitations(faction) {

        //returns (boolean) if the best faction has sent an invite 

        let list = ns.singularity.checkFactionInvitations()
        let found = list.find(element => element == faction)

        displayStatus(faction, factionServer, "awaiting invitation...")

        if (ns.singularity.joinFaction(faction) || found === faction) {
            ns.run(script.findFaction, 1)
            ns.closeTail()
            ns.exit()
        }
    }

    function pumpStats() {

        //pumps the stats on all, stats are found in config.js

        if (ns.getPlayer().city !== gymLocation) {

            travelTo(gymLocation)

        } else {

            if (ns.getPlayer().skills.strength < requirement.strength) {

                displayStatus(faction, factionServer, "working on strength " + ns.getPlayer().skills.strength + "/" + requirement.strength)
                ns.singularity.gymWorkout(gym, "strength", false)

            } else if (ns.getPlayer().skills.defense < requirement.defense) {

                displayStatus(faction, factionServer, "working on defense " + ns.getPlayer().skills.defense + "/" + requirement.defense)
                ns.singularity.gymWorkout(gym, "defense", false)

            } else if (ns.getPlayer().skills.dexterity < requirement.dexterity) {

                displayStatus(faction, factionServer, "working on dexterity " + ns.getPlayer().skills.dexterity + "/" + requirement.dexterity)
                ns.singularity.gymWorkout(gym, "dexterity", false)

            } else if (ns.getPlayer().skills.agility < requirement.agility) {

                displayStatus(faction, factionServer, "working on agility " + ns.getPlayer().skills.agility + "/" + requirement.agility)
                ns.singularity.gymWorkout(gym, "agility", false)

            } else if (ns.getPlayer().skills.charisma < requirement.charisma) {

                displayStatus(faction, factionServer, "working on charisma" + ns.getPlayer().skills.charisma + "/" + requirement.charisma)
                ns.singularity.gymWorkout(gym, "charisma", false)

            } else {

                ns.singularity.stopAction()
            }
        }
    }

    function travelTo(somewhere) {

        //travel to a place

        if (ns.getPlayer().city !== somewhere) {

            displayStatus(faction, factionServer, "traveling to " + somewhere)

            if (ns.getPlayer().money > ticket) {
                ns.singularity.travelToCity(somewhere)
            }
        }
    }

    function backdoorServer() {

    }

    //\\ MAIN LOGICA
    if (faction === "Netburners") {

        while (true) {
            await ns.sleep(speed.medium)

            if (ns.hacknet.numNodes() < 4) {

                displayStatus(faction, factionServer, "buying hacknet nodes")
                if (!ns.scriptRunning(script.buyHacknet, "home")) { ns.run(script.buyHacknet, 1, 4, 25, 2, 1) }

            } else {

                checkInvitations(faction)

            }
        }

    } else if (faction == "CyberSec" || faction == "NiteSec" || faction == "The Black Hand" || faction == "BitRunners") {

        while (true) {
            await ns.sleep(speed.medium)

            if (ns.getPlayer().skills.hacking < ns.getServerRequiredHackingLevel(factionServer)) {

                displayStatus(faction, factionServer, "awaiting hack level")

            } else if (getProgramCount(ns) < ns.getServerNumPortsRequired(factionServer)) {

                displayStatus(faction, factionServer, "awaiting .exe programs")

            } else if (!ns.hasRootAccess(factionServer)) {

                displayStatus(faction, factionServer, "analyzing root access")
                getRootAccess(ns, factionServer)

            } else if (!ns.getServer(factionServer).backdoorInstalled) {

                displayStatus(faction, factionServer, "installing backdoor")
                let serverPath = getServerPath(ns, factionServer)
                for (let node of serverPath) { ns.singularity.connect(node) }

                await ns.singularity.installBackdoor(factionServer)
                ns.singularity.connect("home")

            } else {

                checkInvitations(faction)

            }
        }

    } else if (faction == "Tian Di Hui" || faction == "Sector-12" || faction == "Chongqing" || faction == "New Tokyo" || faction == "Ishima" || faction == "Aevum" || faction == "Volhaven") {

        while (true) {
            await ns.sleep(speed.medium)

            if (ns.getPlayer().city !== requirement.city) {

                travelTo(requirement.city)

            } else if (ns.getPlayer().skills.hacking < requirement.hacklvl) {

                displayStatus(faction, factionServer, "awaiting hack level " + ns.getPlayer().skills.hacking + "/" + requirement.hacklvl)

            } else if (ns.getPlayer().money < requirement.money) {

                displayStatus(faction, factionServer, "awaiting money " + Math.round(ns.getPlayer().money) + "/" + requirement.money)

            } else {

                checkInvitations(faction)

            }
        }

    } else if (faction == "ECorp" || faction == "MegaCorp" || faction == "KuaiGong International" || faction == "Four Sigma" || faction == "NWO" || faction == "Blade Industries" || faction == "OmniTek Incorporated" || faction == "Bachman & Associates" || faction == "Clarke Incorporated" || faction == "Fulcrum Secret Technologies") {

        //Have 400K reputation at all mega corporations, Backdooring company server reduces faction requirement to 300k
        //Have 500K reputation at Fulcrum Secret Technologies, Backdooring company server reduces faction requirement to 400K

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

        while (true) {
            await ns.sleep(speed.medium)

            if (ns.getPlayer().skills.charisma < requirement.charisma
                || ns.getPlayer().skills.strength < requirement.strength
                || ns.getPlayer().skills.defense < requirement.defense
                || ns.getPlayer().skills.dexterity < requirement.dexterity
                || ns.getPlayer().skills.agility < requirement.agility) {

                pumpStats()

            } else if (ns.heart.break() > requirement.karma
                || ns.getPlayer().numPeopleKilled < requirement.kills) {

                if (ns.heart.break() > requirement.karma) {

                    displayStatus(faction, factionServer, "working on karma " + Math.round(ns.heart.break()) + "/" + requirement.karma)
                    ns.singularity.commitCrime("Larceny", false)
                    await ns.sleep(ns.singularity.getCrimeStats("Larceny").time + 1000)

                } else if (ns.getPlayer().numPeopleKilled < requirement.kills) {

                    displayStatus(faction, factionServer, "working on kills " + ns.getPlayer().numPeopleKilled + "/" + requirement.kills)
                    ns.singularity.commitCrime("Homicide", false)
                    await ns.sleep(ns.singularity.getCrimeStats("Homicide").time + 1000)

                }

            } else if (faction === "Silhouette") {

                //if statment must also have !CEO argument
                //make a work function that also works for mega corps 

                //CTO, CFO, or CEO of a company, $15m, -22 Karma

                //backdoor corp server
                //work en become CEO

                ns.tprint("update the requirements script!!! -> @Silhouette")

            } else {

                checkInvitations(faction)

            }
        }

    } else if (faction == "The Covenant" || faction == "Daedalus" || faction == "Illuminati") {

        //20 Augmentations, $75b, Hacking Level of 850, All Combat Stats of 850
        //30 Augmentations, $100b, Hacking Level of 2500 OR All Combat Stats of 1500
        //30 Augmentations, $150b, Hacking Level of 1500, All Combat Stats of 1200

        //stats
        //hacklvl
        //money
        //num of augmentations

    } else {

        ns.toast("Error: faction unknown", "error", 10000)

    }
    ns.closeTail()
}