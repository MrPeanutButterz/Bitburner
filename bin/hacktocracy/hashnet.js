/**\
 * NOTES: 
 * if hash is full it stats paying
 * 
 * 
 * WISHES:
 * if home ram < 128 pay 
 * if programs is running pay
 * if install.js is running pay
 * when i work for company buy favor for speed
 * when i hava a corporation buy money for it "Sell for Corporation Funds"
 * expand hacknet when hash if full
 */

import { scriptStart, scriptPath } from "lib/settings"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    scriptStart(ns)
    ns.tail()

    //\\ GENERAL DATA
    const SCRIPT = scriptPath(ns)
    const API = ns.hacknet

    //\\ FUNCTIONS 
    function buyNode() {
        if (ns.getServerMoneyAvailable("home") > API.getPurchaseNodeCost()) { API.purchaseNode() }
    }

    function buyLevel(index) {
        if (ns.getServerMoneyAvailable("home") > API.getLevelUpgradeCost(index)) { API.upgradeLevel(index) }
    }

    function buyRam(index) {
        if (ns.getServerMoneyAvailable("home") > API.getRamUpgradeCost(index)) { API.upgradeRam(index) }
    }

    function buyCore(index) {
        if (ns.getServerMoneyAvailable("home") > API.getCoreUpgradeCost(index)) { API.upgradeCore(index) }
    }

    function buyCache(index) {
        if (ns.getServerMoneyAvailable("home") > API.getCacheUpgradeCost(index)) { API.upgradeCache(index) }
    }

    function baselineHashnet() {

        let nodes = 4
        let level = 25
        let ram = 2
        let core = 1

        for (var i = 0; i < API.numNodes(); i++) {
            if (API.numNodes() < nodes) { sellForMoney(); buyNode() }
            if (API.getNodeStats(i).level < level) { sellForMoney(); buyLevel(i) }
            if (API.getNodeStats(i).ram < ram) { sellForMoney(); buyRam(i) }
            if (API.getNodeStats(i).cores < core) { sellForMoney(); buyCore(i) }
        }
    }

    function expandHashnet() {

        // upgrade all hacknet servers

        if (API.numNodes() === 0) {

            buyNode()

        } else {

            for (var i = 0; i < API.numNodes(); i++) {
                buyNode(); buyLevel(i); buyRam(i); buyCore(i); buyCache(i)
            }
        }
    }

    function calculateHashPerSecond() {

        // calculates hash per second

        let production = 0
        for (let i = 0; i < ns.hacknet.numNodes(); i++) {
            let hashPerSec = ns.hacknet.getNodeStats(i).production
            production += hashPerSec

        }
        return production
    }

    function sellForMoney() {
        API.spendHashes("Sell for Money")

    }

    //\\ LOGIC
    while (true) {

        await ns.sleep(1000)
        ns.clearLog()

        baselineHashnet()

        if (ns.getServerMaxRam("home") < 256) {

            sellForMoney()

        } else if (ns.scriptRunning(SCRIPT.install, "home")) {

            sellForMoney()

            // sell all

        } else if (ns.corporation.hasCorporation()) {


        } else {

            ns.print("Expanding Hashnet")
            expandHashnet()
        }
    }
}