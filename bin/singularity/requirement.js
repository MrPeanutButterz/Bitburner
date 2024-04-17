import { scriptStart, scriptPath } from "modules/scripting"
import { installBackdoor } from "modules/network"
import { getFactionServer, getFactionStats } from "modules/factions"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA
    const flags = ns.flags([["story", false]])
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

                if (flags.story) {

                    ns.closeTail(); ns.spawn(SCRIPT.faction, { threads: 1, spawnDelay: 500 }, "--story")

                } else {

                    ns.closeTail(); ns.spawn(SCRIPT.faction, { threads: 1, spawnDelay: 500 })
                }
            }
        }
    }

    function moneyCondition(req) {
        return !ns.getServerMoneyAvailable("home") < req
    }

    function skillCondition(str, def, dex, agi) {
        return ns.getPlayer().skills.strength < str || ns.getPlayer().skills.defense < def ||
            ns.getPlayer().skills.dexterity < dex || ns.getPlayer().skills.agility < agi
    }

    function locationCondition(location) {
        return ns.getPlayer().city !== location
    }

    function moveToCity(city) {
        if (ns.getServerMoneyAvailable("home") > TRAVEL_COST) {
            ns.singularity.travelToCity(city)
        }
    }

    function getHacknet() {
        let ramAvailable = (ns.getServerMaxRam("home") - 100) - ns.getServerUsedRam("home")
        if (ramAvailable > ns.getScriptRam(SCRIPT.hacknet, "home")) {
            ns.run(SCRIPT.hacknet, 1)
        }
    }

    function goToGym(str, def, dex, agi) {
        if (!ns.scriptRunning(SCRIPT.gym, "home")) {
            let ramAvailable = ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
            if (ramAvailable > ns.getScriptRam(SCRIPT.gym, "home")) {
                ns.run(SCRIPT.gym, 1, str, def, dex, agi)
            }
        }
    }

    function doSomeCrime(kill, karma) {
        if (!ns.scriptRunning(SCRIPT.crime, "home")) {
            let ramAvailable = ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
            if (ramAvailable > ns.getScriptRam(SCRIPT.crime, "home")) {
                ns.run(SCRIPT.crime, 1, kill, karma)
            }
        }
    }

    function runTheCompany(corp, rep) {
        if (!ns.scriptRunning(SCRIPT.company, "home")) {
            let ramAvailable = ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
            if (ramAvailable > ns.getScriptRam(SCRIPT.company, "home")) {
                ns.run(SCRIPT.company, 1, corp, rep)
            }
        }
    }

    //\\ MAIN LOGIC
    while (true) {

        await ns.sleep(1000)
        ns.clearLog()

        if (["Netburners"].includes(FACTION)) {

            // "Netburners" Hacking lvl 80 & Total Hacknet Levels of 100 & Total Hacknet RAM of 8 & Total Hacknet Cores of 4

            if (ns.hacknet.numNodes() < 4 && !ns.scriptRunning(SCRIPT.hacknet, "home")) {

                getHacknet()

            } else {

                displayLog("Running hacknet script")

            }

        } else if (["CyberSec", "NiteSec", "The Black Hand", "BitRunners"].includes(FACTION)) {

            // "CyberSec" 					    // Install a backdoor on the CSEC server
            // "NiteSec"						// Install a backdoor on the avmnite-02h server
            // "The Black Hand"				    // Install a backdoor on the I.I.I.I server
            // "BitRunners"					    // Install a backdoor on the run4theh111z server

            displayLog("Installing backdoor")
            await installBackdoor(ns, SERVER)

        } else if (["Tian Di Hui", "Sector-12", "Chongqing", "New Tokyo", "Ishima", "Aevum", "Volhaven"].includes(FACTION)) {

            // "Tian Di Hui"					// $1m & Hacking lvl 50 & Be in Chongqing, New Tokyo, or Ishima
            // "Sector-12"					    // Be in Sector-12 & $15m
            // "Chongqing"					    // Be in Chongqing & $20m
            // "New Tokyo"					    // Be in New Tokyo & $20m
            // "Ishima"						    // Be in Ishima & $30m
            // "Aevum"						    // Be in Aevum & $40m
            // "Volhaven"						// Be in Volhaven & $50m

            if (moneyCondition(FACTION_STATS.money)) {

                displayLog("Awaiting money > " + ns.formatNumber(FACTION_STATS.money))

            } else if (FACTION === "Tian Di Hui" && ns.getPlayer().skills.hacking < FACTION_STATS.hacklvl) {

                displayLog("Awaiting hack skill > " + FACTION_STATS.hacklvl)

            } else if (locationCondition(FACTION_STATS.city)) {

                displayLog("Traveling")
                moveToCity(FACTION_STATS.city)
            }

        } else if (["ECorp", "MegaCorp", "KuaiGong International", "Four Sigma", "NWO", "Blade Industries",
            "OmniTek Incorporated", "Bachman & Associates", "Clarke Incorporated", "Fulcrum Secret Technologies"].includes(FACTION)) {

            // "ECorp"						    // Have 400K reputation, Backdooring company server reduces faction requirement to 300k
            // "MegaCorp"						// Have 400K reputation, Backdooring company server reduces faction requirement to 300k
            // "KuaiGong International"		    // Have 400K reputation, Backdooring company server reduces faction requirement to 300k
            // "Four Sigma"					    // Have 400K reputation, Backdooring company server reduces faction requirement to 300k
            // "NWO"							// Have 400K reputation, Backdooring company server reduces faction requirement to 300k
            // "Blade Industries"				// Have 400K reputation, Backdooring company server reduces faction requirement to 300k
            // "OmniTek Incorporated"			// Have 400K reputation, Backdooring company server reduces faction requirement to 300k
            // "Bachman & Associates"			// Have 400K reputation, Backdooring company server reduces faction requirement to 300k
            // "Clarke Incorporated"			// Have 400K reputation, Backdooring company server reduces faction requirement to 300k
            // "Fulcrum Secret Technologies" 	// Have 500K reputation, Backdooring company server reduces faction requirement to 400K

            displayLog("Runnig the company")
            await installBackdoor(ns, SERVER)
            FACTION === "Fulcrum Secret Technologies" ? runTheCompany("Fulcrum Technologies", 4e5) : runTheCompany(FACTION, 3e5)

        } else if (["Slum Snakes", "Tetrads", "Silhouette", "Speakers for the Dead", "The Dark Army", "The Syndicate"].includes(FACTION)) {

            // "Slum Snakes"					// All Combat Stats of 30, -9 Karma, $1m
            // "Tetrads"						// Be in Chongqing, New Tokyo, or Ishima, All Combat Stats of 75, -18 Karma
            // "Silhouette"					    // CTO, CFO, or CEO of a company, $15m, -22 Karma
            // "Speakers for the Dead"		    // Hacking lvl 100, All Combat Stats of 300, 30 People Killed, -45 Karma, Not working for CIA or NSA
            // "The Dark Army"				    // Hacking lvl 300, All Combat Stats of 300, Be in Chongqing, 5 People Killed, -45 Karma, Not working for CIA or NSA
            // "The Syndicate"				    // Hacking lvl 200, All Combat Stats of 200, Be in Aevum or Sector-12, $10m, -90 Karma, Not working for CIA or NSA

            if (skillCondition(FACTION_STATS.strength, FACTION_STATS.defense, FACTION_STATS.dexterity, FACTION_STATS.agility)) {

                displayLog("Pumping at the gym brb...")
                goToGym(FACTION_STATS.strength, FACTION_STATS.defense, FACTION_STATS.dexterity, FACTION_STATS.agility)

            } else if (ns.getPlayer().numPeopleKilled < FACTION_STATS.skills ||
                ns.getPlayer().karma > FACTION_STATS.karma) {

                displayLog("Doing some crime...")
                doSomeCrime(FACTION_STATS.kills, FACTION_STATS.karma)

            } else if (locationCondition(FACTION_STATS.city)) {

                displayLog("Traveling " + FACTION_STATS.city)
                moveToCity(FACTION_STATS.city)

            } else if (FACTION === "Silhouette") {

                displayLog("CEO in the making")

                if (!ns.scriptRunning(SCRIPT.company, "home")) {

                    let ramAvailable = ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
                    ramAvailable > ns.getScriptRam(SCRIPT.company, "home") ?
                        ns.run(SCRIPT.company, 1) : await ns.sleep(1000)
                }
            }

        } else if (["The Covenant", "Daedalus", "Illuminati"].includes(FACTION)) {

            // "The Covenant"					// 20 Augmentations, $75b, Hacking lvl of 850, All Combat Stats of 850
            // "Daedalus"						// 30 Augmentations, $100b, Hacking lvl of 2500 OR All Combat Stats of 1500
            // "Illuminati"					    // 30 Augmentations, $150b, Hacking lvl of 1500, All Combat Stats of 1200

            if (skillCondition(FACTION_STATS.strength, FACTION_STATS.defense, FACTION_STATS.dexterity, FACTION_STATS.agility) &&
                FACTION != "Daedalus") {

                displayLog("Pumping at the gym brb...")
                goToGym(FACTION_STATS.strength, FACTION_STATS.defense, FACTION_STATS.dexterity, FACTION_STATS.agility)

            } else if (ns.getPlayer().skills.hacking < FACTION_STATS.hacklvl) {

                displayLog("Awaiting hack skill to be more than " + FACTION_STATS.hacklvl)

            } else if (moneyCondition(FACTION_STATS.money)) {

                displayLog("Awaiting money to be more than " + ns.formatNumber(FACTION_STATS.money))

            }
        }
        checkInvites()
    }
}
