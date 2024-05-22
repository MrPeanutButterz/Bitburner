import { scriptPath, scriptStart } from "lib/scripting"
import { canRunOnHome } from "lib/network"

/** @param {NS} ns */
export async function main(ns) {

    /**  ____                       
     *  / ___| __ _ _ __   __ _ ___ 
     * | |  _ / _` | '_ \ / _` / __|
     * | |_| | (_| | | | | (_| \__ \
     *  \____|\__,_|_| |_|\__, |___/
     *                    |___/     
     * 
     * find if faction has or had invited 
     * get requirements 
     * join faction
     * run gang script 
    */

    //\\ SCRIPT SETTINGS
    scriptStart(ns)
    ns.clearLog()

    //\\ GENERAL DATA
    const FLAGS = ns.flags([["combat", true]])
    const SCRIPT = scriptPath(ns)

    let FACTION = ""

    //\\ FUNCTIONS
    //\\ MAIN MAGIC
    FLAGS.combat ? FACTION = "Slum Snakes" : FACTION = "NiteSec"

    while (true) {
        await ns.sleep(1000)

        if (!ns.getPlayer().factions.includes(FACTION)) {

            if (canRunOnHome(ns, SCRIPT.requirement) &&
                !ns.scriptRunning(SCRIPT.requirement, "home")) {

                ns.spawn(SCRIPT.requirement, { threads: 1, spawnDelay: 500 }, FACTION, "--gang")
            }

        } else {

            if (FLAGS.combat) {

                if (canRunOnHome(ns, SCRIPT.combatGang)) {
                    ns.spawn(SCRIPT.combatGang, { threads: 1, spawnDelay: 500 })
                }

            } else {

                if (canRunOnHome(ns, SCRIPT.hackGang)) {
                    ns.spawn(SCRIPT.hackGang, { threads: 1, spawnDelay: 500 })
                }
            }
        }
    }
}
