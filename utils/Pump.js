/** @param {NS} ns */
export async function main(ns) {

    // Test Stock PUMPINGGGGG......
    // Followd by the DUMPPPPPP....

    //\\ SCRIPT SETTINGS
    // ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    const target = ns.args[0]
    //\\ SCRIPT SPECIFIC FUNCTIONS
    //\\ MAIN LOGIC

    await ns.grow(target, { stock: true })
    ns.tprint("Done...")

}
