import { NmapMoneyServers } from "modules/network"

/** @param {NS} ns */
export async function main(ns) {

    ns.disableLog("ALL")
    ns.clearLog()

    while (true) {
        await ns.sleep(1000)
        ns.clearLog()

        for (let server of NmapMoneyServers(ns)) {

            if (ns.hackAnalyzeChance(server) > 0.8) {

                ns.print("name " + server)
                ns.print("money ava " + Math.floor(ns.getServerMoneyAvailable(server)))
                ns.print("money max " + Math.floor(ns.getServerMaxMoney(server)))
            }
        }
    }

}