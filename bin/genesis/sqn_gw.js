/** @param {NS} ns */
export async function main(ns) {

    // weaken server defense below threshhold
    // grow server money, baseline grows incremental

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    const target = ns.args[0]

    //\\ SCRIPT SPECIFIC FUNCTIONS
    //\\ MAIN LOGIC
    while (true) {
        await ns.sleep(1000)
        if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target) + 5) {
            await ns.weaken(target)
            
        } else {
            await ns.grow(target)
            ns.exit()
        }
    }
}
