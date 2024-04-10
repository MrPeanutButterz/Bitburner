/** @param {NS} ns */
export async function main(ns) {

    // auto buy neuroflux

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ GENERAL DATA
    const BALANCE_TRIGGER_THRESHOLD = 5e12 // 4t
    const DONATION = 1e10
    const NEUROFLUX = "NeuroFlux Governor"
    const FACTION = "Daedalus"

    //\\ FUNCTIONS 
    //\\ MAIN LOGIC

    while (true) {

        await ns.sleep(1000)

        if (ns.singularity.getFactionFavor(FACTION) >= 150) {

            if (ns.getServerMoneyAvailable("home") > ns.singularity.getAugmentationPrice(NEUROFLUX) &&
                ns.singularity.getFactionRep(FACTION) > ns.singularity.getAugmentationRepReq(NEUROFLUX)) {

                ns.singularity.purchaseAugmentation(FACTION, NEUROFLUX) ? ns.print("Bought Neuroflux") : ns.print("No money")

            } else if (ns.getServerMoneyAvailable("home") > BALANCE_TRIGGER_THRESHOLD) {

                ns.singularity.donateToFaction(FACTION, DONATION) ? ns.print("Donations++") : ns.print("Nonations")

            } else {

                ns.print("Where the money at?")
            }


        } else {
            ns.tprint("Favor is less then 150"); ns.exit()
        }
    }
}
