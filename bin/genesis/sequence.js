import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns) {
 
    // weaken server defense below threshhold
    // grow server money, baseline grows incremental
    // hack server money

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    const target = ns.args[0]
    let moneyHackPerc = 10
    
    
    //\\ SCRIPT SPECIFIC FUNCTIONS
    //\\ MAIN LOGIC
    
    
    while(true) {
        await ns.sleep(1000)
        
        let moneyPerc = ns.getServerMoneyAvailable(target) / ns.getServerMaxMoney(target) * 100
        const minSecurtiyLevel = ns.getServerMinSecurityLevel(target) + 5 

        if (moneyPerc < moneyHackPerc) {
            await ns.grow(target)

        } else if (ns.getServerSecurityLevel(target) > minSecurtiyLevel) {
            await ns.weaken(target)

        } else {
            await ns.hack(target)
            moneyHackPerc++
            
            
        }

    }   
}
