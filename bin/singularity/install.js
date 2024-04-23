import { scriptStart, scriptPath } from "lib/scripting"

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
    const FLAGS = ns.flags([
        ["neuroflux", false],
        ["story", false]])
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
        if (ns.scriptRunning(script, "home")) {
            ns.print("Script kill: " + script)
            ns.scriptKill(script, "home")
        }
    }

    //\\ MAIN LOGIC
    killScript(SCRIPT.stockmarket)
    await ns.sleep(1000)

    killScript(SCRIPT.programs)
    await ns.sleep(1000)

    killScript(SCRIPT.hacknet)
    await ns.sleep(1000)

    killScript(SCRIPT.servers)
    await ns.sleep(1000)

    killScript(SCRIPT.ram)
    await ns.sleep(1000)

    killScript(SCRIPT.core)
    await ns.sleep(1000)

    if (ns.stock.hasWSEAccount() &&
        ns.stock.has4SData() &&
        ns.stock.hasTIXAPIAccess() &&
        ns.stock.has4SDataTIXAPI()) {

        ns.stock.getSymbols().forEach(sym => {
            let shares = ns.stock.getPosition(sym)[0]
            if (shares > 0) {
                ns.stock.sellStock(sym, shares)
                ns.print("Sold " + sym + " " + shares + " shares")
            }
        })
    }

    if (!FLAGS.neuroflux) {

        ns.print("\n\nShopping list")

        let shoppingList = createSortedShoppingList(FACTION)
        shoppingList.forEach(item => {
            ns.print(item)
        })

        ns.print("\n\nBuying")

        for (let i = 0; i < shoppingList.length;) {

            let augmentation = shoppingList[i]

            if (ns.getServerMoneyAvailable("home") > ns.singularity.getAugmentationPrice(augmentation) &&
                ns.singularity.getFactionRep(FACTION) > ns.singularity.getAugmentationRepReq(augmentation)) {

                if (ns.singularity.purchaseAugmentation(FACTION, augmentation)) {

                    await ns.sleep(1000)
                    ns.print(augmentation)
                    i++
                }

            } else {

                await ns.sleep(1000)
            }
        }
    }

    ns.print("\n\nSpending on NeuroFlux")
    while (ns.getServerMoneyAvailable("home") > ns.singularity.getAugmentationPrice("NeuroFlux Governor") &&
        ns.singularity.getFactionRep(FACTION) > ns.singularity.getAugmentationRepReq("NeuroFlux Governor")) {

        if (ns.singularity.purchaseAugmentation(FACTION, "NeuroFlux Governor")) {

            ns.print("NeuroFlux++")
            await ns.sleep(1000)
        }
    }

    // install & boot 
    ns.closeTail()
    ns.singularity.installAugmentations(SCRIPT.system)
}
