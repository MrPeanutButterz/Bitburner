import { getNewDivisions } from "/lib/corporation"
import { scriptPath, scriptStart } from "/lib/scripting"

/** @param {NS} ns */
export async function main(ns) {

    /** _                _           
     * | |    ___   __ _(_) ___ __ _ 
     * | |   / _ \ / _` | |/ __/ _` |
     * | |__| (_) | (_| | | (_| (_| |
     * |_____\___/ \__, |_|\___\__,_|
     *              |___/             
     * 
     * corporation > run divisions we have 
     * corporation > try to buy next division 
     * corporation > run big corp if home ram...
     *
     * division > expand to all cities first
     * division > get all cities a warehouse, then continue
     * division > run the office
     * division > run the warehouse
     * division > buy export sell
     *
     * warehouse > sell material
     * warehouse > expand warehouse size
    */

    //\\ SCRIPT SETTINGS
    scriptStart(ns)
    ns.tail()

    //\\ GENERAL DATA
    const SCRIPT = scriptPath(ns)
    const API = ns.corporation
    const NEW_DIVISIONS = getNewDivisions(ns)

    const ALL_CITIES = [
        ns.enums.CityName.Sector12,
        ns.enums.CityName.Aevum,
        ns.enums.CityName.Chongqing,
        ns.enums.CityName.NewTokyo,
        ns.enums.CityName.Ishima,
        ns.enums.CityName.Volhaven,
    ]

    function getProductionMultiplierMaterial(divisionName) {

        switch (divisionName) {
            case "AGRCL": return "Real Estate"
            case "SPRNG": return "Real Estate"
            case "RESTO": return "AI Cores"
            case "TOBCO": return "Robots"
            case "SOFTW": return "Real Estate"
            case "REFIN": return "Hardware"
            case "CHEMI": return "Real Estate"
            case "FISHY": return "Robots"
            case "WATUT": return "Real Estate"
            case "PHRMA": return "Robots"
            case "MINE": return "Robots"
            case "CPHW": return "Robots"
            case "RLST8": return "Robots"
            case "HLTHC": return "Real Estate"
            case "ROBO": return "Real Estate"
            case "FARMG": return "Real Estate"
            case "CODE": return "Real Estate"
            case "ESTAT": return "Robots"
            case "MEDIC": return "Real Estate"
            case "BOTIC": return "Real Estate"
        }
    }

    //\\ FUNCTIONS
    function logCorporation(corp) {

        // log corp status

        ns.print("Name\t\t" + corp.name)
        ns.print("Funds\t\t" + ns.formatNumber(corp.funds))
        ns.print("Revenue\t\t" + ns.formatNumber(corp.revenue))
        ns.print("Expense\t\t" + ns.formatNumber(corp.expenses))
        ns.print("DividendRate\t" + ns.formatPercent(corp.dividendRate))
        ns.print("Divisions\t" + corp.divisions.length)
    }

    function logDivision(division) {

        // log division status

        ns.print("\nDivision\t" + division.name)
        ns.print("Profit\t\t" + ns.formatNumber(division.lastCycleRevenue - division.lastCycleExpenses))
    }

    function expandDivision(division) {

        // expand to all cities with warehouse

        if (division.cities.length < 6) {

            ALL_CITIES.forEach(city => {
                if (!division.cities.includes(city) && API.getCorporation().funds > 9e9) {
                    API.expandCity(division.name, city)
                    API.purchaseWarehouse(division.name, city)
                }
            })
            return false

        } else {

            return true
        }
    }

    function handleProductionMult(divisionName, divisionCities) {

        let data = []

        divisionCities.forEach(city => {

            let prodMultMaterial = getProductionMultiplierMaterial(divisionName)

            let material = API.getMaterial(divisionName, city, prodMultMaterial)
            // {"marketPrice":77630.75482894522,"desiredSellPrice":"","desiredSellAmount":0,"name":"Real Estate","stored":0,"quality":1,
            // "productionAmount":0,"actualSellAmount":0,"exports":[]}

            let materialData = API.getMaterialData(prodMultMaterial)
            // {"name":"Real Estate","size":0.005,"demandBase":50,"demandRange":[5,99],"competitionBase":50,"competitionRange":[25,75],
            // "baseCost":80000,"maxVolatility":1.5,"baseMarkup":1.5}

            let warehouse = API.getWarehouse(divisionName, city)
            // {"level":1,"city":"Sector-12","size":100,"sizeUsed":0,"smartSupplyEnabled":false}

            data.push({

                city: city,
                prodMult: prodMultMaterial,
                marketPrice: material.marketPrice,
                materialSize: materialData.size,
                stored: material.stored,
                storedInSize: material.stored * materialData.size,
                warehouseMaxStored: warehouse.size / materialData.size,
                exports: material.exports,

            })
        })

        data.sort((a, b) => a.marketPrice - b.marketPrice)
        // data.forEach(d => {
        //     ns.print(" ")
        //     ns.print(d.city)
        //     ns.print("MarktP " + ns.formatNumber(d.marketPrice))
        //     ns.print("Stored " + d.stored)
        //     ns.print("StoreM " + d.warehouseMaxStored)
        // })

        for (let get of data) {

            if (get.city === data[0].city) {

                // buy here
                API.sellMaterial(divisionName, get.city, get.prodMult, 0, "MP")

                // bulk purchase max amount
                let demand = get.warehouseMaxStored - get.stored
                let price = demand * get.marketPrice

                if (API.getCorporation().funds > price) {

                    // ns.print("BUY FULL amt " + demand + " price " + ns.formatNumber(demand * get.marketPrice) + " at " + data[0].city)
                    API.bulkPurchase(divisionName, get.city, get.prodMult, demand - 1)

                } else {

                    let parcialDemand = API.getCorporation().funds / get.marketPrice
                    // ns.print("BUY PART amt " + parcialDemand + " price " + ns.formatNumber(parcialDemand * get.marketPrice) + " at " + data[0].city)
                    API.bulkPurchase(divisionName, get.city, get.prodMult, parcialDemand)
                }

            } else {

                // sell here
                API.sellMaterial(divisionName, get.city, get.prodMult, "MAX", "MP")

                // remove old exports 
                for (let oldExport of get.exports) {
                    API.cancelExportMaterial(divisionName, get.city, oldExport.division, oldExport.city, get.prodMult)
                }

                if (API.getCorporation().nextState === "EXPORT") {

                    // set up exports from buyCity
                    if (get.warehouseMaxStored - get.stored > 0) {

                        // find if export exists 
                        let exportExists = false
                        for (let runningExports of data[0].exports) {
                            if (runningExports.city === get.city) { exportExists = true }
                        }

                        // set up export
                        if (!exportExists) {
                            API.exportMaterial(divisionName, data[0].city, divisionName, get.city, get.prodMult, "MAX")
                        }
                    }

                } else {

                    // remove all exports from buyCity when done
                    for (let oldExport of data[0].exports) {
                        API.cancelExportMaterial(divisionName, data[0].city, divisionName, oldExport.city, get.prodMult)
                    }
                }
            }
        }
    }

    function handleDivisions(divisions) {

        //  ____  _       _     _
        // |  _ \(_)_   _(_)___(_) ___  _ __  ___
        // | | | | \ \ / / / __| |/ _ \| '_ \/ __|
        // | |_| | |\ V /| \__ \ | (_) | | | \__ \
        // |____/|_| \_/ |_|___/_|\___/|_| |_|___/

        for (let division of divisions) {

            let divisionData = API.getDivision(division)
            logDivision(divisionData)

            expandDivision(divisionData)
            handleProductionMult(divisionData.name, divisionData.cities)
        }
    }

    function expandIndustry(divisions) {

        // expand industy only if prev has 6 cities

        if (divisions.length < 20) {

            if (API.getDivision(divisions[divisions.length - 1]).cities.length === 6) {

                let nextIndustry = NEW_DIVISIONS[divisions.length]
                let industyData = API.getIndustryData(nextIndustry.type)

                ns.print("\nNext industry \t" + nextIndustry.type)
                ns.print("Cost\t\t" + ns.formatNumber(industyData.startingCost))

                if (API.getCorporation().funds > industyData.startingCost) {
                    API.expandIndustry(nextIndustry.type, nextIndustry.name)
                }
            }
        }
    }

    function buyUpgrades(divisions) {

        // auto buy upgrades
        const wantedUpgrades = ["DreamSense", "Smart Storage"]

        if (divisions.length > 2) {

            wantedUpgrades.forEach(upgrade => {
                if (API.getCorporation().funds > API.getUpgradeLevelCost(upgrade)) {
                    API.levelUpgrade(upgrade)
                }
            })
        }
    }

    //\\ MAIN LOGIC
    while (true) {

        //   ____                                 _   _             
        //  / ___|___  _ __ _ __   ___  _ __ __ _| |_(_) ___  _ __  
        // | |   / _ \| '__| '_ \ / _ \| '__/ _` | __| |/ _ \| '_ \ 
        // | |__| (_) | |  | |_) | (_) | | | (_| | |_| | (_) | | | |
        //  \____\___/|_|  | .__/ \___/|_|  \__,_|\__|_|\___/|_| |_|
        //                 |_|                                      

        await API.nextUpdate()
        ns.clearLog()

        let corporationData = API.getCorporation()

        logCorporation(corporationData)
        handleDivisions(corporationData.divisions)
        expandIndustry(corporationData.divisions)
        buyUpgrades(corporationData.divisions)
    }

}

// CORPORATION ================================================================================================================================================
// hasCorporation()	                                                                            Returns whether the player has a corporation. Does not require API access.
// createCorporation(corporationName, selfFund)	                                                Create a Corporation
// nextUpdate()	                                                                                Sleep until the next Corporation update has happened.

// getCorporation()	                                                                            Get corporation data
// getDivision(divisionName)	                                                                Get division data

// getIndustryData(industryName)	                                                            Get constant industry definition data for a specific industry
// expandCity(divisionName, city)	                                                            Expand to a new city
// expandIndustry(industryType, divisionName)	                                                Expand to a new industry
// hasUnlock(upgradeName)	                                                                    Check if you have a one time unlockable upgrade

// getBonusTime()	                                                                            Get bonus time.
// getConstants()	                                                                            Get corporation related constants

// getMaterialData(materialName)	                                                            Get constant data for a specific material
// getUnlockCost(upgradeName)	                                                                Gets the cost to unlock a one time unlockable upgrade
// purchaseUnlock(upgradeName)	                                                                Unlock an upgrade
// getUpgradeLevel(upgradeName)	                                                                Get the level of a levelable upgrade
// getUpgradeLevelCost(upgradeName)	                                                            Gets the cost to unlock the next level of a levelable upgrade
// levelUpgrade(upgradeName)	                                                                Level an upgrade.

// goPublic(numShares)	                                                                        Go public
// issueDividends(rate)	                                                                        Issue dividends
// getInvestmentOffer()	                                                                        Get an offer for investment based on you companies current valuation
// acceptInvestmentOffer()	                                                                    Accept investment based on you companies current valuation
// issueNewShares(amount)	                                                                    Issue new shares
// buyBackShares(amount)	                                                                    Buyback Shares. Spend money from the player's wallet to transfer shares from public traders to the CEO.
// sellShares(amount)	                                                                        Sell Shares. Transfer shares from the CEO to public traders to receive money in the player's wallet.
// sellDivision(divisionName)	                                                                Sell a division

// bribe(factionName, amountCash)	                                                            Bribe a faction

// OFFICE =====================================================================================================================================================
// getOffice(divisionName, city)	                                                            Get data about an office
// hireEmployee(divisionName, city, employeePosition)	                                        Hire an employee.
// setAutoJobAssignment(divisionName, city, job, amount)	                                    Set the auto job assignment for a job
// getOfficeSizeUpgradeCost(divisionName, city, size)	                                        Cost to Upgrade office size.
// upgradeOfficeSize(divisionName, city, size)                                                  Upgrade office size.

// getHireAdVertCount(divisionName)	                                                            Get the number of times you have hired AdVert.
// getHireAdVertCost(divisionName)	                                                            Get the cost to hire AdVert.
// hireAdVert(divisionName)	                                                                    Hire AdVert.

// hasResearched(divisionName, researchName)	                                                Gets if you have unlocked a research
// getResearchCost(divisionName, researchName)	                                                Get the cost to unlock research
// research(divisionName, researchName)	                                                        Purchase a research

// throwParty(divisionName, city, costPerEmployee)	                                            Throw a party for your employees
// buyTea(divisionName, city)	                                                                Buy tea for your employees

// WAREHOUSE ==================================================================================================================================================
// hasWarehouse(divisionName, city)	                                                            Check if you have a warehouse in city
// purchaseWarehouse(divisionName, city)	                                                    Purchase warehouse for a new city
// getWarehouse(divisionName, city)	                                                            Get warehouse data
// getUpgradeWarehouseCost(divisionName, city, amt)	                                            Gets the cost to upgrade a warehouse to the next level
// upgradeWarehouse(divisionName, city, amt)	                                                Upgrade warehouse

// setSmartSupply(divisionName, city, enabled)	                                                Set smart supply
// setSmartSupplyOption(divisionName, city, materialName, option)	                            Set whether smart supply uses leftovers before buying

// sellMaterial(divisionName, city, materialName, amt, price)	                                Set material sell data.
// sellProduct(divisionName, city, productName, amt, price, all)	                            Set product sell data.

// getMaterial(divisionName, city, materialName)	                                            Get material data
// buyMaterial(divisionName, city, materialName, amt)	                                        Set material buy data
// bulkPurchase(divisionName, city, materialName, amt)	                                        Set material to bulk buy
// exportMaterial(sourceDivision, sourceCity, targetDivision, targetCity, materialName, amt)	Set material export data
// cancelExportMaterial(sourceDivision, sourceCity, targetDivision, targetCity, materialName)	Cancel material export

// getProduct(divisionName, cityName, productName)	                                            Get product data
// makeProduct(divisionName, city, productName, designInvest, marketingInvest)	                Create a new product
// discontinueProduct(divisionName, productName)	                                            Discontinue a product.

// limitMaterialProduction(divisionName, city, materialName, qty)	                            Limit Material Production.
// limitProductProduction(divisionName, city, productName, qty)	                                Limit Product Production.

// setMaterialMarketTA1(divisionName, city, materialName, on)	                                Set market TA 1 for a material.
// setMaterialMarketTA2(divisionName, city, materialName, on)	                                Set market TA 2 for a material.

// setProductMarketTA1(divisionName, productName, on)	                                        Set market TA 1 for a product.
// setProductMarketTA2(divisionName, productName, on)	                                        Set market TA 2 for a product.