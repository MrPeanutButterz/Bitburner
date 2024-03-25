import { consoleLog, sleepTime } from "./lib/scripting-module"

export async function main(ns) {

    //\\ SCRIPT SETTINGS
    consoleLog(ns, "Ram Auto Purchase Running")
    ns.disableLog("ALL")
    ns.clearLog()
    
    //\\ GENERAL DATA
    const speed = sleepTime(ns)
    
    //\\ MAIN LOGICA
    while (true) {
        await ns.sleep(speed.s1)
        ns.clearLog()
        
        if (ns.getPlayer().money > ns.singularity.getUpgradeHomeRamCost()) {
            
            ns.singularity.upgradeHomeRam()
            ns.toast("Ram upgrade", "success", speed.toast)
            
        } else {
            
            ns.print("Next ram upgrade cost $" + Math.ceil(ns.singularity.getUpgradeHomeRamCost()))
            ns.print(Math.round(ns.getPlayer().money / ns.singularity.getUpgradeHomeRamCost() * 100) + "% of money is avaliable")
            
        }
    }
}