import { NmapMoneyServers, NmapFreeRam, NmapTotalRam } from "lib/network"
import { colorPrint } from "lib/settings";

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ FUNCTIONS
    function serverStats(s) {
        return {
            hostname: s,
            chance: Math.round(ns.hackAnalyzeChance(s) * 100),
            tGrow: Math.ceil(ns.getGrowTime(s) / 1000),
            tWeak: Math.ceil(ns.getWeakenTime(s) / 1000),
            tHack: Math.ceil(ns.getHackTime(s) / 1000),
            sercurity: (ns.getServerSecurityLevel(s) - ns.getServerMinSecurityLevel(s)).toPrecision(2),
            money: Math.floor(ns.getServerMoneyAvailable(s)),
            moneyProc: ns.getServerMoneyAvailable(s) / Math.floor(ns.getServerMaxMoney(s))
        }
    }

    function print(s, color) {
        colorPrint(ns, color, s.hostname + " " + s.chance + "%")
        colorPrint(ns, "white",
            "G" + s.tGrow + " W" + s.tWeak + " H" + s.tHack + " | " +
            s.sercurity + " | " +
            ns.formatNumber(s.money) + " = " + ns.formatPercent(s.moneyProc, 0)
        )
    }

    //\\ MAIN LOGICA
    while (true) {

        await ns.sleep(1000)
        ns.clearLog()
        ns.print("NetRam: " + ns.formatRam(NmapFreeRam(ns)) + " / " + ns.formatRam(NmapTotalRam(ns)))
        ns.print(" ")

        let top = []
        let mid = []
        let low = []

        // sort 
        for (let server of NmapMoneyServers(ns)) {

            if (ns.hackAnalyzeChance(server) > 0.9) {
                top.push(serverStats(server))

            } else if (ns.hackAnalyzeChance(server) > 0.8) {
                mid.push(serverStats(server))

            } else {
                low.push(serverStats(server))

            }
        }

        // print
        for (let s of top) { print(s, "green") }
        for (let s of mid) { print(s, "yellow") }
        for (let s of low) { print(s, "red") }

    }
}