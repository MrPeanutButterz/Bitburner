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
    let attackPerc = 10    
    
    //\\ SCRIPT SPECIFIC FUNCTIONS
    //\\ MAIN LOGIC
    while(true) {
        await ns.sleep(1000)

        let moneyPerc = Math.floor(ns.getServerMoneyAvailable(target) / ns.getServerMaxMoney(target) * 100)
        const minSecurtiyLevel = ns.getServerMinSecurityLevel(target) + 5 

        ns.print("Attack percent: " + attackPerc)

        if (moneyPerc < attackPerc) {
            ns.print("GROW@" + moneyPerc)
            await ns.grow(target)
            
        } else if (ns.getServerSecurityLevel(target) > minSecurtiyLevel) {
            ns.print("WEAK")
            await ns.weaken(target)
            
        } else {
            ns.print("HACK @" + moneyPerc)
            await ns.hack(target)
            attackPerc++
                        
        }
    }   
}
