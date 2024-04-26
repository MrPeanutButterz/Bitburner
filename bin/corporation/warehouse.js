import { scriptStart, scriptPath } from "lib/scripting"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    scriptStart(ns)
    ns.tail()

    //\\ GENERAL DATA
    const SCRIPT = scriptPath(ns)

    //\\ FUNCTIONS 
    function runWarehouse() {

    }

    //\\ LOGIC
    while (true) {
        await ns.corporation.nextUpdate()
        runWarehouse()
    }
}

// bulkPurchase(divisionName, city, materialName, amt)	                                        Set material to bulk buy
// buyMaterial(divisionName, city, materialName, amt)	                                        Set material buy data
// cancelExportMaterial(sourceDivision, sourceCity, targetDivision, targetCity, materialName)	Cancel material export
// discontinueProduct(divisionName, productName)	                                            Discontinue a product.
// exportMaterial(sourceDivision, sourceCity, targetDivision, targetCity, materialName, amt)	Set material export data
// getMaterial(divisionName, city, materialName)	                                            Get material data
// getProduct(divisionName, cityName, productName)	                                            Get product data
// getUpgradeWarehouseCost(divisionName, city, amt)	                                            Gets the cost to upgrade a warehouse to the next level
// getWarehouse(divisionName, city)	                                                            Get warehouse data
// hasWarehouse(divisionName, city)	                                                            Check if you have a warehouse in city
// limitMaterialProduction(divisionName, city, materialName, qty)	                            Limit Material Production.
// limitProductProduction(divisionName, city, productName, qty)	                                Limit Product Production.
// makeProduct(divisionName, city, productName, designInvest, marketingInvest)	                Create a new product
// purchaseWarehouse(divisionName, city)	                                                    Purchase warehouse for a new city
// sellMaterial(divisionName, city, materialName, amt, price)	                                Set material sell data.
// sellProduct(divisionName, city, productName, amt, price, all)	                            Set product sell data.
// setMaterialMarketTA1(divisionName, city, materialName, on)	                                Set market TA 1 for a material.
// setMaterialMarketTA2(divisionName, city, materialName, on)	                                Set market TA 2 for a material.
// setProductMarketTA1(divisionName, productName, on)	                                        * Set market TA 1 for a product.
// setProductMarketTA2(divisionName, productName, on)	                                        Set market TA 2 for a product.
// setSmartSupply(divisionName, city, enabled)	                                                Set smart supply
// setSmartSupplyOption(divisionName, city, materialName, option)	                            Set whether smart supply uses leftovers before buying
// upgradeWarehouse(divisionName, city, amt)	                                                Upgrade warehouse