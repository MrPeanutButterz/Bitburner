import { scriptStart, scriptPath } from "modules/scripting"

/** @param {NS} ns */
export async function main(ns) {

    // stop all scripts that cost money (ram, core, stockmarket, programs, hacknet, servers)
    // create a list sorted by cost 
    // add pre-requisities to list before the augmentation
    // buy most expensive first
    // spend remaining money on neuroflux of favor
    // install & boot system

    //\\ SCRIPT SETTINGS
    scriptStart(ns)
    ns.tail()

    //\\ GENERAL DATA
    const SCRIPT = scriptPath(ns)

    let FACTION = ns.args[0]

    //\\ FUNCTIONS 
    function isOwnedAugmentation(augmentation) {

        // return true if its owned
        return Boolean(ns.singularity.getOwnedAugmentations(true).find(e => e === augmentation))
    }

    function onlyUnique(value, index, array) {
        return array.indexOf(value) === index;
    }

    function createSortedShoppingList(faction) {

        let listSorted = []
        ns.singularity.getAugmentationsFromFaction(faction).forEach(aug => {

            // push not owned to shopping list 
            if (!isOwnedAugmentation(aug)) {
                listSorted.push({
                    aug: aug,
                    price: ns.singularity.getAugmentationPrice(aug)
                })
            }
        })

        // sort by price 
        listSorted.sort(function (a, b) { return a.price - b.price })
        listSorted.reverse()

        // add pre-requisities before the augmentation itself
        let sortedWithPreReq = []
        listSorted.forEach(el => {

            // get pre requisities
            let preReq = ns.singularity.getAugmentationPrereq(el.aug)
            preReq.reverse()

            // add all before actual augmentation 
            if (preReq.length > 0) {
                preReq.forEach(pre => {

                    // add to list if not owned
                    if (!isOwnedAugmentation(pre)) {
                        sortedWithPreReq.push(pre)
                    }
                })
            }

            // add actual augmentation
            sortedWithPreReq.push(el.aug)
        })

        // return unique list 
        return sortedWithPreReq.filter(onlyUnique)
    }

    function killScript(script) {
        if (!ns.scriptRunning(SCRIPT.stockmarket, "home")) {
            ns.scriptKill(SCRIPT.stockmarket, "home")
        }
    }

    //\\ MAIN LOGIC
    killScript(SCRIPT.stockmarket)
    killScript(SCRIPT.programs)
    killScript(SCRIPT.hacknet)
    killScript(SCRIPT.servers)
    killScript(SCRIPT.ram)
    killScript(SCRIPT.core)

    if (ns.stock.hasWSEAccount() &&
        ns.stock.has4SData() &&
        ns.stock.hasTIXAPIAccess() &&
        ns.stock.has4SDataTIXAPI()) {

        let symbols = ns.stock.getSymbols()

        symbols.forEach(sym => {
            let shares = ns.stock.getPosition(sym)[0]
            if (shares > 0) {
                ns.stock.sellStock(sym, shares)
            }
        })
    }


    let shoppingList = createSortedShoppingList(FACTION)

    ns.print("Shopping list")
    ns.print(shoppingList)
    ns.print(" ")

    for (let i = 0; i < shoppingList.length;) {

        let augmentation = shoppingList[i]

        if (ns.getServerMoneyAvailable("home") > ns.singularity.getAugmentationPrice(augmentation) &&
            ns.singularity.getFactionRep(FACTION) > ns.singularity.getAugmentationRepReq(augmentation)) {

            if (ns.singularity.purchaseAugmentation(FACTION, augmentation)) {

                i++
                ns.print(augmentation)
                await ns.sleep(1000)

            } else {

                ns.print("Eh")
                ns.print(augmentation)
                await ns.sleep(1000)

            }

        } else {

            ns.print("LACK OF FUNDS...")
            await ns.sleep(1000)

        }
    }

    ns.print("NeuroFlux...")

    // neuroflux++
    while (ns.getServerMoneyAvailable("home") > ns.singularity.getAugmentationPrice("NeuroFlux Governor") &&
        ns.singularity.getFactionRep(FACTION) > ns.singularity.getAugmentationRepReq("NeuroFlux Governor")) {


        if (ns.singularity.purchaseAugmentation(FACTION, "NeuroFlux Governor")) {

            ns.print("NeuroFlux Governor ++")
            await ns.sleep(1000)

        } else {

            await ns.sleep(1000)

        }
    }

    // install & boot 
    ns.closeTail()
    ns.singularity.installAugmentations(SCRIPT.system)
}
