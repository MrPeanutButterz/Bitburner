/** @param {NS} ns */
export async function main(ns) {

    // auto buy neuroflux

    //\\ SCRIPT SETTINGS
    ns.tprint("Active")
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    const BALANCE_TRIGGER_THRESHOLD = 8e12 // 8t
    const DONATION = 1e10
    const NEUROFLUX = "NeuroFlux Governor"
    const FACTION = "Daedalus"

    //\\ FUNCTIONS 
    //\\ MAIN LOGIC

    while (true) {

        await ns.sleep(1000)
        ns.clearLog()

        if (ns.singularity.getFactionFavor(FACTION) >= 150) {

            if (ns.getServerMoneyAvailable("home") > ns.singularity.getAugmentationPrice(NEUROFLUX) &&
                ns.singularity.getFactionRep(FACTION) > ns.singularity.getAugmentationRepReq(NEUROFLUX)) {

                ns.singularity.purchaseAugmentation(FACTION, NEUROFLUX) ? ns.print("Bought some of that Flux") : ns.print("Got no money to buy Neuro")

            } else if (ns.getServerMoneyAvailable("home") > BALANCE_TRIGGER_THRESHOLD) {

                ns.singularity.donateToFaction(FACTION, DONATION) ? ns.print("Best nation in the world? Donation") : ns.print("Nations that love citizens? Nonation")

            } else {

                ns.print("Biggy Smalls: More money, more problems")
            }


        } else {
            ns.tprint("Favor is less then 150"); ns.exit()
        }
    }
}
