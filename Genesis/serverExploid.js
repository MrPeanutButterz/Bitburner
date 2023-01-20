/* Creator: https://github.com/MrPeanutbutterz 
this script weakens the security, grows the balance, hacks the money avaliable, grows server money incremental on every hack + 1% */

/** @param {NS} ns */
export async function main(ns) {

    //\\ GENERAL DATA
    let target = ns.args[0]

    //\\ MAIN LOGICA
    while (true) {
        for (var i = 15; i < 99;) {

            if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target) + 5) {
                await ns.weaken(target)

            } else if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target) * i / 100) {
                await ns.grow(target)

            } else {
                await ns.hack(target)
                i++
            }
        }
    }
}