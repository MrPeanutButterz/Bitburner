/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz 
Analasys: finds the best faction to work for by sorting on the highest augmentation reputation */

import { getScriptsPath, getFactionNames } from "./conf.js"
import { getFactionShopList } from "./lib.js"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.toast("findFaction online", "success", 2000)
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    let script = getScriptsPath(ns)

    //\\ SCRIPT SPECIFIC FUNCTIONS
    function bestFaction() {

        /* returns 
        1. (string) the best faction to work for  
        2. (number) by sorting on the highest augmentation reputation */

        let list = []
        let factions = getFactionNames(ns)

        for (let faction of factions) {

            if (getFactionShopList(ns, faction).length > 0) {
                list.push({
                    name: faction,
                    reputation: reputationGoal(faction),
                })
            }
        }
        list.sort(function (a, b) { return a.reputation - b.reputation })
        return list[0]
    }

    function reputationGoal(faction) {

        //returns (number) the highest reputation augmentation

        let augmentations = getFactionShopList(ns, faction)
        let highestReputation = 0

        for (let f of augmentations) {

            if (ns.singularity.getAugmentationRepReq(f) > highestReputation) {
                highestReputation = ns.singularity.getAugmentationRepReq(f)
            }

        }
        return highestReputation
    }

    function accepted(faction) {

        //returns (boolean) if faction is joined

        let list = ns.getPlayer().factions

        for (let i of list) {
            if (i === faction) {
                return true
            }
        }
        return false
    }

    function redPill() {

        //returns (boolean) if The Red Pill is installed

        let list = ns.singularity.getOwnedAugmentations()
        let found = list.find(element => element == "The Red Pill")
        if (found == "The Red Pill") { return true } else { return false }
    }

    //\\ MAIN LOGICA
    let faction = bestFaction()
    
    if (faction.name != undefined) {
        
        if (!accepted(faction.name)) {
            
            //run requirements
            ns.tprint("The best option Faction = " + faction.name + ", Rep = " + faction.reputation + ", Run requirements")
            ns.run(script.requirements, 1, faction.name)
            
        } else if (Math.floor(ns.singularity.getFactionRep(faction.name)) < faction.reputation) {
            
            //run reputation 
            ns.tprint("The best option Faction = " + faction.name + ", Rep = " + faction.reputation + ", Run reputation")
            ns.run(script.reputation, 1, faction.name, faction.reputation)
            
        } else {
            
            //run install
            ns.tprint("The best option Faction = " + faction.name + ", Rep = " + faction.reputation + ", Run installation")
            ns.run(script.installation, 1, faction.name)

        }

    } else {

        //redpill

    }
}