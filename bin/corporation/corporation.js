import { getNewDivisions } from "/lib/corporation"
import { canRunOnHome } from "/lib/network"

/** @param {NS} ns */
export async function main(ns) {

    /** _                _           
     * | |    ___   __ _(_) ___ __ _ 
     * | |   / _ \ / _` | |/ __/ _` |
     * | |__| (_) | (_| | | (_| (_| |
     * |_____\___/ \__, |_|\___\__,_|
     *              |___/             
     * 
     * start > corporation "CapitalPrinter Inc"
     * start > buy first division "Agriculture"
     * start > buy Unlocks "Export", "Smart Supply"
     *
     * based on home ram start small of big corporation
    */

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ GENERAL DATA
    const SCRIPT = scriptPath(ns)
    const API = ns.corporation

    const CORPORATION_NAME = "CapitalPrinter Inc"
    const NEW_DIVISIONS = getNewDivisions(ns)

    //\\ FUNCTIONS
    //\\ MAIN LOGIC
    while (true) {

        await ns.sleep(1000)

        if (!API.hasCorporation()) {

            // buy corporation with smart supply en export unlocks 

            if (API.createCorporation(CORPORATION_NAME, false)) {
                ns.tprint("Corporation created: " + CORPORATION_NAME)
                API.expandIndustry(NEW_DIVISIONS[0].type, NEW_DIVISIONS[0].name)
                API.purchaseUnlock("Smart Supply")
                API.purchaseUnlock("Export")
            }

        } else {

            if (ns.getServerMaxRam("home") > ns.getScriptRam(SCRIPT.bigCorp)) {

                // run big 
                if (canRunOnHome(ns, SCRIPT.bigCorp)) {

                    ns.spawn(SCRIPT.bigCorp, { threads: 0, spawnDelay: 500 })

                }

            } else {

                if (canRunOnHome(ns, SCRIPT.smallCorp)) {

                    ns.spawn(SCRIPT.smallCorp, { threads: 0, spawnDelay: 500 })

                }
            }
        }
    }
}