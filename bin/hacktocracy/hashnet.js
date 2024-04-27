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

import { scriptStart, scriptPath } from "lib/scripting"

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

    function baselineHacknet() {

        let nodes = 4
        let level = 25
        let ram = 2
        let core = 1

        for (var i = 0; i < API.numNodes(); i++) {
            if (API.numNodes() < nodes) { buyNode() }
            if (API.getNodeStats(i).level < level) { buyLevel(i) }
            if (API.getNodeStats(i).ram < ram) { buyRam(i) }
            if (API.getNodeStats(i).cores < core) { buyCore(i) }
        }
    }

    function expandHacknet() {

        // upgrade all hacknet servers

        for (var i = 0; i < API.numNodes(); i++) {
            buyNode(); buyLevel(i); buyRam(i); buyCore(i); buyCache(i)
        }
    }

    function sellForMoney() {
        API.spendHashes("Sell for Money")

    }

    //\\ LOGIC
    while (true) {

        await ns.sleep(1000)
        ns.clearLog()


        if (ns.getServerMaxRam("home") < 256) {

            sellForMoney()

        } else if (ns.scriptRunning(SCRIPT.install, "home")) {

            sellForMoney()

        } else if (ns.corporation.hasCorporation()) {


        } else {

            expandHacknet()
        }
    }
}