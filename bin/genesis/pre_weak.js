import { NmapMoneyServers } from "modules/network"

/** @param {NS} ns */
export async function main(ns) {

    // incrementaly pulls in out of reach server for collectStage2

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    let HACK_CHANCE_BOTTOM = ns.args[0]
    let HACK_CHANCE_TOP = ns.args[1]

    //\\ MAIN LOGIC
    if (HACK_CHANCE_BOTTOM === undefined) { HACK_CHANCE_BOTTOM = 0.7 }
    if (HACK_CHANCE_TOP === undefined) { HACK_CHANCE_TOP = 0.8 }

    while (true) {

        await ns.sleep(1000)
        let servers = NmapMoneyServers(ns)

        for (let server of servers) {

            let chance = ns.hackAnalyzeChance(server)
            if (chance > HACK_CHANCE_BOTTOM && chance <= HACK_CHANCE_TOP) {

                if (ns.getServerSecurityLevel(server) > ns.getServerMinSecurityLevel(server)) {
                    ns.print("Weak range " + (HACK_CHANCE_BOTTOM * 100).toPrecision(2) + "/" + (HACK_CHANCE_TOP * 100).toPrecision(2) + "% - " + server)
                    await ns.weaken(server)

                } else {
                    continue

                }
            }
        }

        HACK_CHANCE_BOTTOM > 0 ? HACK_CHANCE_BOTTOM -= 0.1 : ns.exit()

    }
}
