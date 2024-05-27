import { scriptPath, scriptStart } from "/lib/settings"
import { getFactionNames } from "/lib/factions"

/** @param {NS} ns */
export async function main(ns) {

    /**
    *  _   _                       __ _            
    * | \ | | ___ _   _ _ __ ___  / _| |_   ___  __
    * |  \| |/ _ \ | | | '__/ _ \| |_| | | | \ \/ /
    * | |\  |  __/ |_| | | | (_) |  _| | |_| |>  < 
    * |_| \_|\___|\__,_|_|  \___/|_| |_|\__,_/_/\_\
    * 
    * find faction with highest favor
    * run requirements if not member
    * build reputation 
    * buy neuroflux amount on the go
    * donate
    */

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA
    const API = ns.singularity
    const FACTIONS = getFactionNames(ns)
    const SCRIPT = scriptPath(ns)

    const NEUROFLUX = "NeuroFlux Governor"
    const FOCUS = false

    let AMOUNT = 7
    let FACTION = "Sector-12"
    let TASK = FACTION === "Slum Snakes" || FACTION === "Tetrads" ? TASK = ns.enums.FactionWorkType.field : ns.enums.FactionWorkType.hacking

    //\\ FUNCTIONS 
    function factionWithMostFavor() {

        // find faction with highest favor 

        FACTIONS.forEach(faction => {

            if (ns.gang.inGang()) {

                if (ns.gang.getGangInformation().faction != faction &&
                    API.getFactionFavor(faction) > API.getFactionFavor(FACTION)) {
                    FACTION = faction
                }

            } else {

                if (API.getFactionFavor(faction) > API.getFactionFavor(FACTION)) {
                    FACTION = faction
                }
            }
        })
    }

    async function getRequirements() {

        // get requirements for faction

        while (!ns.getPlayer().factions.includes(FACTION)) {

            await ns.sleep(1001)
            if (!ns.getRunningScript(SCRIPT.requirement, "home", FACTION, "--neuroflux")) {

                ns.spawn(SCRIPT.requirement, { threads: 1, spawnDelay: 500 }, FACTION, "--neuroflux")
            }
        }
    }

    function runSharepower() {
        if (ns.getServerMaxRam("home") > 2000) { ns.exec(SCRIPT.sharePower, "home", 1, "--home") }
    }

    function killScript(script) {
        if (ns.scriptRunning(script, "home")) {
            ns.print("Script kill: " + script)
            ns.scriptKill(script, "home")
        }
    }

    function info() {
        ns.print("Buying Neuroflux Only")
        ns.print("Faction\t\t" + FACTION)
        ns.print("Left to buy\t" + AMOUNT)
    }

    async function buildReputation() {

        // build reputation

        ns.tail()

        killScript(SCRIPT.stockmarket)
        ns.run(SCRIPT.stockmarket, { threads: 1, spawnDelay: 500 }, "--sell")
        await ns.sleep(1000)

        killScript(SCRIPT.hacknet)
        await ns.sleep(1000)

        killScript(SCRIPT.ram)
        await ns.sleep(1000)

        killScript(SCRIPT.core)
        await ns.sleep(1000)

        runSharepower()
        while (AMOUNT != 0) {

            await ns.sleep(1000)
            ns.clearLog()
            info()

            if (API.getFactionFavor(FACTION) >= 150) {

                API.workForFaction(FACTION, TASK, FOCUS)

                if (API.getFactionRep(FACTION) < API.getAugmentationRepReq(NEUROFLUX)) {

                    API.donateToFaction(FACTION, ns.getServerMoneyAvailable("home"))

                } else if (ns.getServerMoneyAvailable("home") > API.getAugmentationPrice(NEUROFLUX)) {

                    if (API.purchaseAugmentation(FACTION, NEUROFLUX)) { AMOUNT-- }

                }

            } else {

                ns.tprint("ERROR AUTO BUY NEUROFLUX: Favor is less then 150")
                ns.exit()
            }
        }

        API.installAugmentations(SCRIPT.system)
    }

    //\\ MAIN LOGIC
    factionWithMostFavor()
    await getRequirements()
    await buildReputation()
}
