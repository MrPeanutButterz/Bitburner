/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz
Proces: buys the augmentation for a faction en spends money left on Neuroflux, installs en start main.js */

import { getSleepTime, getScriptsPath } from "./Default/config.js"
import { getFactionShopList } from "./Default/library.js"

export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.toast("installation online", "success", 2000)
    ns.resizeTail(500, 130)
    ns.moveTail(1200, 20)
    ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ GENERAL DATA
    let sleep = getSleepTime(ns)
    let script = getScriptsPath(ns)

    let faction = ns.args[0]
    let shoppingList = getFactionShopList(ns, faction)

    //\\ SCRIPT SPECIFIC FUNCTIONS


    //\\ MAIN LOGICA
    for (let i = 0; i < shoppingList.length;) {

        await ns.sleep(sleep.medium)

        if (ns.getPlayer().money < ns.singularity.getAugmentationPrice(shoppingList[i])) {

            ns.clearLog()
            ns.print("Next: " + shoppingList[i])
            ns.print("Awaiting money: " + Math.floor(ns.getPlayer().money / ns.singularity.getAugmentationPrice(shoppingList[i]) * 100) + "%")

        } else {

            ns.singularity.purchaseAugmentation(faction, shoppingList[i])
            ns.print("bought " + shoppingList[i])
            i++

        }
    }

    while (ns.singularity.getFactionRep(faction) > ns.singularity.getAugmentationRepReq("NeuroFlux Governor")
        && ns.getPlayer().money > ns.singularity.getAugmentationPrice("NeuroFlux Governor")) {

        ns.singularity.purchaseAugmentation(faction, "NeuroFlux Governor")
        await ns.sleep(sleep.superFast)
    }

    ns.singularity.installAugmentations(script.main)
}