/** @param {NS} ns */
export async function main(ns) {

    //\\ GENERAL DATA
    let target = ns.args[0]
    if (target == null) { ns.exit() }

    //\\ MAIN LOGICA
    while (true) {
        ns.sleep(1000)

        if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target) + 5) {
            await ns.weaken(target)

        } else if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target) * i / 100) {
            await ns.grow(target)

        }
    }
}
