/** @param {NS} ns */
export async function main(ns) {

    // weaken server defense below threshhold
    // grow server money, baseline grows incremental
    // hack server on payday

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    const target = ns.args[0]
    let attackPerc = 100

    //\\ SCRIPT SPECIFIC FUNCTIONS
    //\\ MAIN LOGIC
    if (target === undefined) { target = "n00dles" }

    while (true) {
        await ns.sleep(1000)

        let moneyPerc = Math.floor(ns.getServerMoneyAvailable(target) / ns.getServerMaxMoney(target) * 100)
        const minSecurtiyLevel = ns.getServerMinSecurityLevel(target) + 9

        ns.print("Attack percent: " + attackPerc)

        if (ns.getServerSecurityLevel(target) > minSecurtiyLevel) {
            ns.print("WEAK")
            await ns.weaken(target)

        } else if (moneyPerc < attackPerc) {
            ns.print("GROW@" + moneyPerc)
            await ns.grow(target)

        } else {
            ns.print("HACK @" + moneyPerc)
            await ns.hack(target)

            if (attackPerc < 65) {
                attackPerc++

            } else {
                attackPerc = 80
            }
        }
    }
}
