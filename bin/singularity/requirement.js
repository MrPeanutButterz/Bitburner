import { scriptStart, scriptPath } from "modules/scripting"
import { installBackdoor } from "modules/network"
import { getFactionServer, getFactionStats } from "modules/factions"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA
    const SCRIPT = scriptPath(ns)
    const TRAVEL_COST = 2e5

    let FACTION = ns.args[0]
    let FACTION_STATS = getFactionStats(ns, FACTION)
    let SERVER = getFactionServer(ns, FACTION)

    ns.resizeTail(500, 160)

    //\\ FUNCTIONS 
    function displayLog(msg) {
        ns.clearLog()
        ns.print("Working on requirements for " + FACTION)
        ns.print(msg)
    }

    function checkInvites() {
        if (ns.singularity.checkFactionInvitations().find(i => i === FACTION)) {
            if (ns.singularity.joinFaction(FACTION)) {

                ns.closeTail()
                ns.spawn(SCRIPT.faction, { threads: 1, spawnDelay: 500 })
            }
        }
    }

    function moveToCity(city) {
        if (ns.getServerMoneyAvailable("home") > TRAVEL_COST) {
            ns.singularity.travelToCity(city)
        }
    }

    //\\ MAIN LOGIC
    while (true) {

        await ns.sleep(1000)
        ns.clearLog()

        if (FACTION === "Netburners") {

            // "Netburners" Hacking lvl 80 & Total Hacknet Levels of 100 & Total Hacknet RAM of 8 & Total Hacknet Cores of 4

            if (ns.hacknet.numNodes() < 4 && !ns.scriptRunning(SCRIPT.hacknet, "home")) {

                let ramAvailable = (ns.getServerMaxRam("home") - 100) - ns.getServerUsedRam("home")
                ramAvailable > ns.getScriptRam(SCRIPT.hacknet, "home") ? ns.run(SCRIPT.hacknet, 1) : await ns.sleep(1000)

            } else {

                displayLog("Running hacknet script")

            }

        } else if (
            FACTION === "CyberSec" ||
            FACTION === "NiteSec" ||
            FACTION === "The Black Hand" ||
            FACTION === "BitRunners") {

            // "CyberSec" 					    //Install a backdoor on the CSEC server
            // "NiteSec"						//Install a backdoor on the avmnite-02h server
            // "The Black Hand"				    //Install a backdoor on the I.I.I.I server
            // "BitRunners"					    //Install a backdoor on the run4theh111z server

            await installBackdoor(ns, SERVER)

        } else if (
            FACTION === "Tian Di Hui" ||
            FACTION === "Sector-12" ||
            FACTION === "Chongqing" ||
            FACTION === "New Tokyo" ||
            FACTION === "Ishima" ||
            FACTION === "Aevum" ||
            FACTION === "Volhaven") {

            // "Tian Di Hui"					//$1m & Hacking lvl 50 & Be in Chongqing, New Tokyo, or Ishima
            // "Sector-12"					    //Be in Sector-12 & $15m
            // "Chongqing"					    //Be in Chongqing & $20m
            // "New Tokyo"					    //Be in New Tokyo & $20m
            // "Ishima"						    //Be in Ishima & $30m
            // "Aevum"						    //Be in Aevum & $40m
            // "Volhaven"						//Be in Volhaven & $50m

            if (ns.getServerMoneyAvailable("home") < FACTION_STATS.money) {

                displayLog("Awaiting money > " + FACTION_STATS.money)

            } else if (FACTION === "Tian Di Hui" && ns.getPlayer().skills.hacking < FACTION_STATS.hacklvl) {

                displayLog("Awaiting hack skill > " + FACTION_STATS.hacklvl)

            } else if (ns.getPlayer().city !== FACTION_STATS.city) {

                displayLog("Traveling")
                moveToCity(FACTION_STATS.city)

            }

        } else if (
            FACTION === "ECorp" ||
            FACTION === "MegaCorp" ||
            FACTION === "KuaiGong International" ||
            FACTION === "Four Sigma" ||
            FACTION === "NWO" ||
            FACTION === "Blade Industries" ||
            FACTION === "OmniTek Incorporated" ||
            FACTION === "Bachman & Associates" ||
            FACTION === "Clarke Incorporated" ||
            FACTION === "Fulcrum Secret Technologies") {

            // "ECorp"						    //Have 400K reputation, Backdooring company server reduces faction requirement to 300k
            // "MegaCorp"						//Have 400K reputation, Backdooring company server reduces faction requirement to 300k
            // "KuaiGong International"		    //Have 400K reputation, Backdooring company server reduces faction requirement to 300k
            // "Four Sigma"					    //Have 400K reputation, Backdooring company server reduces faction requirement to 300k
            // "NWO"							//Have 400K reputation, Backdooring company server reduces faction requirement to 300k
            // "Blade Industries"				//Have 400K reputation, Backdooring company server reduces faction requirement to 300k
            // "OmniTek Incorporated"			//Have 400K reputation, Backdooring company server reduces faction requirement to 300k
            // "Bachman & Associates"			//Have 400K reputation, Backdooring company server reduces faction requirement to 300k
            // "Clarke Incorporated"			//Have 400K reputation, Backdooring company server reduces faction requirement to 300k
            // "Fulcrum Secret Technologies" 	//Have 500K reputation, Backdooring company server reduces faction requirement to 400K

            await installBackdoor(ns, SERVER)

            displayLog("Runnig the company")
            if (!ns.scriptRunning(SCRIPT.company, "home")) {

                let ramAvailable = ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
                if (ramAvailable > ns.getScriptRam(SCRIPT.company, "home")) {

                    FACTION === "Fulcrum Secret Technologies" ?
                        ns.run(SCRIPT.company, 1, "Fulcrum Technologies", 4e5) :
                        ns.run(SCRIPT.company, 1, FACTION, 3e5)
                }
            }

        } else if (
            FACTION === "Slum Snakes" ||
            FACTION === "Tetrads" ||
            FACTION === "Silhouette" ||
            FACTION === "Speakers for the Dead" ||
            FACTION === "The Dark Army" ||
            FACTION === "The Syndicate") {

            // "Slum Snakes"					//All Combat Stats of 30, -9 Karma, $1m
            // "Tetrads"						//Be in Chongqing, New Tokyo, or Ishima, All Combat Stats of 75, -18 Karma
            // "Silhouette"					    //CTO, CFO, or CEO of a company, $15m, -22 Karma
            // "Speakers for the Dead"		    //Hacking lvl 100, All Combat Stats of 300, 30 People Killed, -45 Karma, Not working for CIA or NSA
            // "The Dark Army"				    //Hacking lvl 300, All Combat Stats of 300, Be in Chongqing, 5 People Killed, -45 Karma, Not working for CIA or NSA
            // "The Syndicate"				    ///Hacking lvl 200, All Combat Stats of 200, Be in Aevum or Sector-12, $10m, -90 Karma, Not working for CIA or NSA

            if (ns.getPlayer().skills.strength < FACTION_STATS.strength ||
                ns.getPlayer().skills.defense < FACTION_STATS.defense ||
                ns.getPlayer().skills.dexterity < FACTION_STATS.dexterity ||
                ns.getPlayer().skills.agility < FACTION_STATS.agility) {

                displayLog("Pumping at the gym brb...")

                if (!ns.scriptRunning(SCRIPT.gym, "home")) {

                    let ramAvailable = ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
                    ramAvailable > ns.getScriptRam(SCRIPT.gym, "home") ?
                        ns.run(SCRIPT.gym, 1,
                            FACTION_STATS.strength,
                            FACTION_STATS.defense,
                            FACTION_STATS.dexterity,
                            FACTION_STATS.agility) :
                        await ns.sleep(1000)

                }

            } else if (ns.getPlayer().numPeopleKilled < FACTION_STATS.skills || ns.getPlayer().karma > FACTION_STATS.karma) {

                if (!ns.scriptRunning(SCRIPT.crime, "home")) {

                    let ramAvailable = ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
                    ramAvailable > ns.getScriptRam(SCRIPT.crime, "home") ?
                        ns.run(SCRIPT.crime, 1, FACTION_STATS.skills, FACTION_STATS.karma) : await ns.sleep(1000)

                }

            } else if (ns.getPlayer().city !== FACTION_STATS.city &&
                ns.getServerMoneyAvailable("home") > TRAVEL_COST) {

                displayLog("Traveling " + FACTION_STATS.city)
                ns.singularity.travelToCity(FACTION_STATS.city)

            } else if (FACTION === "Silhouette") {

                displayLog("CEO in the making")

                if (!ns.scriptRunning(SCRIPT.company, "home")) {

                    let ramAvailable = ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
                    ramAvailable > ns.getScriptRam(SCRIPT.company, "home") ?
                        ns.run(SCRIPT.company, 1, 32e6 + 1000) : await ns.sleep(1000)

                }

            }


        } else if (
            FACTION === "The Covenant" ||
            FACTION === "Daedalus" ||
            FACTION === "Illuminati") {

            // "The Covenant"					//20 Augmentations, $75b, Hacking lvl of 850, All Combat Stats of 850
            // "Daedalus"						//30 Augmentations, $100b, Hacking lvl of 2500 OR All Combat Stats of 1500
            // "Illuminati"					    //30 Augmentations, $150b, Hacking lvl of 1500, All Combat Stats of 1200

            if (ns.getPlayer().skills.strength < FACTION_STATS.strength ||
                ns.getPlayer().skills.defense < FACTION_STATS.defense ||
                ns.getPlayer().skills.dexterity < FACTION_STATS.dexterity ||
                ns.getPlayer().skills.agility < FACTION_STATS.agility) {

                displayLog("Pumping at the gym brb...")

                if (!ns.scriptRunning(SCRIPT.gym, "home")) {

                    let ramAvailable = ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
                    ramAvailable > ns.getScriptRam(SCRIPT.gym, "home") ?
                        ns.run(SCRIPT.gym, 1,
                            FACTION_STATS.strength,
                            FACTION_STATS.defense,
                            FACTION_STATS.dexterity,
                            FACTION_STATS.agility) :
                        await ns.sleep(1000)
                }

            } else if (ns.getPlayer().skills.hacking < FACTION_STATS.hacklvl) {

                displayLog("Awaiting hack skill to be more than " + FACTION_STATS.hacklvl)

            } else if (ns.getServerMoneyAvailable("home") < FACTION_STATS.money) {

                displayLog("Awaiting money to be more than " + FACTION_STATS.money)

            }
        }
        checkInvites()
    }
}
