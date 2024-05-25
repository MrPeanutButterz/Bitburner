import { scriptStart, scriptPath } from "lib/scripting"
import { installBackdoor, canRunOnHome } from "lib/network"
import { getFactionServer, getFactionStats } from "lib/factions"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    scriptStart(ns)
    const FLAGS = ns.flags([
        ["story", false],
        ["gang", false],
        ["neuroflux", false]
    ])

    //\\ GENERAL DATA
    const SCRIPT = scriptPath(ns)
    const TRAVEL_COST = 2e5

    let FACTION = ns.args[0]
    let SERVER = getFactionServer(ns, FACTION)
    let REQ = getFactionStats(ns, FACTION)

    //\\ FUNCTIONS 
    function displayLog(msg) {
        ns.clearLog()
        ns.print("Working on requirements for " + FACTION)
        ns.print(msg)
    }

    function checkInvites() {
        if (ns.singularity.checkFactionInvitations().find(i => i === FACTION)) {
            if (canRunOnHome(ns, SCRIPT.faction)) {
                if (ns.singularity.joinFaction(FACTION)) {

                    if (FLAGS.story) {

                        ns.spawn(SCRIPT.faction, { threads: 1, spawnDelay: 500 }, "--story")

                    } else if (FLAGS.gang) {

                        ns.spawn(SCRIPT.gangs, { threads: 1, spawnDelay: 500 })
                        
                    } else if (FLAGS.neuroflux) { 
                        
                        ns.spawn(SCRIPT.neuroflux, { threads: 1, spawnDelay: 500 })

                    } else {

                        ns.closeTail(); ns.spawn(SCRIPT.faction, { threads: 1, spawnDelay: 500 })
                    }

                }
            }
        }
    }

    function moneyCondition(req) {
        return ns.getServerMoneyAvailable("home") < req
    }

    function skillCondition(str, def, dex, agi) {
        return ns.getPlayer().skills.strength < str || ns.getPlayer().skills.defense < def ||
            ns.getPlayer().skills.dexterity < dex || ns.getPlayer().skills.agility < agi
    }

    function locationCondition(location) {
        return ns.getPlayer().city !== location
    }

    function moveToCity(city) {
        displayLog("Traveling to " + city)
        if (ns.getServerMoneyAvailable("home") > TRAVEL_COST) {
            ns.singularity.travelToCity(city)
        }
    }

    function getHacknet() {
        displayLog("Running hacknet")
        if (canRunOnHome(ns, SCRIPT.hacknet)) { ns.run(SCRIPT.hacknet, 1) }
    }

    function goToGym(str, def, dex, agi) {
        displayLog("At the gym")
        if (canRunOnHome(ns, SCRIPT.gym)) { ns.run(SCRIPT.gym, 1, str, def, dex, agi) }
    }

    function doSomeCrime(kill, karma) {
        displayLog("Comitting crime")
        if (canRunOnHome(ns, SCRIPT.crime)) { ns.run(SCRIPT.crime, 1, kill, karma) }
    }

    function runTheCompany(corp, rep) {
        displayLog("Runnig a company")
        if (canRunOnHome(ns, SCRIPT.company)) { ns.run(SCRIPT.company, 1, corp, rep) }
    }

    function runTheCompanyCFO() {
        displayLog("Runnig a company")
        if (canRunOnHome(ns, SCRIPT.company)) { ns.run(SCRIPT.company, 1, "--cfo") }
    }

    //\\ MAIN LOGIC
    while (true) {

        await ns.sleep(1000)
        checkInvites()
        ns.clearLog()

        if (["Netburners"].includes(FACTION)) {

            if (ns.hacknet.numNodes() < 4) { getHacknet() }

        } else if (["CyberSec", "NiteSec", "The Black Hand", "BitRunners"].includes(FACTION)) {

            displayLog("Installing backdoor")
            await installBackdoor(ns, SERVER)

        } else if (["Tian Di Hui", "Sector-12", "Chongqing", "New Tokyo", "Ishima", "Aevum", "Volhaven"].includes(FACTION)) {

            if (moneyCondition(REQ.money)) {

                displayLog("Awaiting money " + ns.formatNumber(REQ.money))

            } else if (FACTION === "Tian Di Hui" && ns.getPlayer().skills.hacking < REQ.hacklvl) {

                displayLog("Awaiting hack skill " + REQ.hacklvl)

            } else if (locationCondition(REQ.city)) {

                moveToCity(REQ.city)
            }

        } else if (["ECorp", "MegaCorp", "KuaiGong International", "Four Sigma", "NWO", "Blade Industries",
            "OmniTek Incorporated", "Bachman & Associates", "Clarke Incorporated", "Fulcrum Secret Technologies"].includes(FACTION)) {

            await installBackdoor(ns, SERVER)
            FACTION === "Fulcrum Secret Technologies" ? runTheCompany("Fulcrum Technologies", 4e5) : runTheCompany(FACTION, 3e5)

        } else if (["Slum Snakes", "Tetrads", "Silhouette", "Speakers for the Dead", "The Dark Army", "The Syndicate"].includes(FACTION)) {

            if (skillCondition(REQ.str, REQ.def, REQ.dex, REQ.agi)) {

                goToGym(REQ.str, REQ.def, REQ.dex, REQ.agi)

            } else if (ns.getPlayer().numPeopleKilled < REQ.kills || ns.getPlayer().karma > REQ.karma) {

                doSomeCrime(REQ.kills, REQ.karma)

            } else if (locationCondition(REQ.city)) {

                moveToCity(REQ.city)

            } else if (FACTION === "Silhouette") {

                runTheCompanyCFO()
            }

        } else if (["The Covenant", "Daedalus", "Illuminati"].includes(FACTION)) {

            if (skillCondition(REQ.str, REQ.def, REQ.dex, REQ.agi) && FACTION != "Daedalus") {

                goToGym(REQ.str, REQ.def, REQ.dex, REQ.agi)

            } else if (ns.getPlayer().skills.hacking < REQ.hacklvl) {

                displayLog("Awaiting hack skill " + REQ.hacklvl)

            } else if (moneyCondition(REQ.money)) {

                displayLog("Awaiting money " + ns.formatNumber(REQ.money))

            }
        }
    }
}
