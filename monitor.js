import { NmapMoneyServers } from "modules/network"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    const hackChance = 0.8

    //\\ MAIN LOGICA
    while (true) {
        await ns.sleep(1000)
        ns.clearLog()

        for (let server of NmapMoneyServers(ns)) {

            if (ns.hackAnalyzeChance(server) > hackChance) {

                ns.print(" ")
                ns.print(server)
                ns.print("money ava " + Math.floor(ns.getServerMoneyAvailable(server)))
                ns.print("money max " + Math.floor(ns.getServerMaxMoney(server)))
            }
        }
    }

}