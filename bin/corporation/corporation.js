import { scriptPath } from "./lib/scripting"

/** @param {NS} ns */
export async function main(ns) {

    /** Script logica...
     * start > corporation "CapitalPrinter Inc"
     * start > buy first division "Agriculture"
     * start > buy Unlocks "Export", "Smart Supply"
     *
     * corporation > run divisions we have 
     * corporation > try to buy next division 
     * corporation > buy Upgrades "Smart Storage", "ABC SalesBots", "Smart Factories"
     * corporation > buy Unlocks ?
     * corporation > set dividents based on timeline
     * corporation > go public if divisions > 2 
     *
     * division > expand to all cities first
     * division > get all cities a warehouse, then continue
     * division > run the office
     * division > run the warehouse
     * division > hire advert
     * division > create / discontinue product 
     * division > fill warehouse with booster material en export
     * division > buy research upgrades 
     *
     * office > hire employees
     * office > set jobs for employees 
     * office > buy some tea
     * office > throw a party
     * office > upgrade office size
     * office > set up research & development if office size > 30
     * 
     * warehouse > set Smart Supply
     * warehouse > sell material
     * warehouse > sell product
     * warehouse > expand warehouse size
    */

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ GENERAL DATA
    const SCRIPT = scriptPath(ns)
    const API = ns.corporation
    const AVG_EMPLOYEE_HEALTH = 90

    const ALL_CITIES = [
        ns.enums.CityName.Sector12,
        ns.enums.CityName.Aevum,
        ns.enums.CityName.Chongqing,
        ns.enums.CityName.NewTokyo,
        ns.enums.CityName.Ishima,
        ns.enums.CityName.Volhaven,
    ]

    const ALL_DIVISIONS = [
        "Agriculture", // 40b
        "Spring Water", // 10b
        "Restaurant", // 10b
        "Tobacco", // 20b
        "Software", // 25b
        "Refinery", // 50b
        "Chemical", // 70b
        "Fishing", // 80b
        "Water Utilities", // 150b
        "Pharmaceutical", // 200b
        "Mining", // 300b
        "Computer Hardware", // 500b 
        "Real Estate", // 600b
        "Healthcare", // 750b
        "Robotics", // 1t
    ]

    function logCorporation(corp) {

        // log corp status

        ns.print("Name\t\t" + corp.name)
        ns.print("Funds\t\t" + ns.formatNumber(corp.funds))
        ns.print("Revenue\t\t" + ns.formatNumber(corp.revenue))
        ns.print("Expense\t\t" + ns.formatNumber(corp.expenses))
        ns.print("Divisions\t" + corp.divisions.length)
    }

    function logDivision(division) {

        // log division status

        ns.print("\nDivision\t" + division.name)
        ns.print("Profit\t\t" + ns.formatNumber(division.lastCycleRevenue - division.lastCycleExpenses))
        ns.print("Awareness\t" + Math.round(division.awareness))
        ns.print("Popularity\t" + Math.round(division.popularity))
        ns.print("Research\t" + division.researchPoints)
        if (division.makesProducts) {
            ns.print("Products\t" + division.products.length + "/" + division.maxProducts)
        }
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

    function getSellMaterials(divisionName) {

        // @return the industie required material for production

        switch (divisionName) {
            case "Agriculture": return ["Plants", "Food"]
            case "Spring Water": return ["Water"]
            case "Restaurant": return ["Food", "Water"]
            case "Tobacco": return ["Plants"]
            case "Software": return ["AI Cores"]
            case "Refinery": return ["Metal"]
            case "Chemical": return ["Chemicals"]
            case "Fishing": return ["Food"]
            case "Water Utilities": return ["Water"]
            case "Pharmaceutical": return ["Drugs"]
            case "Mining": return ["Ore", "Minerals"]
            case "Computer Hardware": return ["Hardware"]
            case "Real Estate": return ["Real Estate"]
            case "Healthcare": return []
            case "Robotics": return ["Robots"]
        }
    }

    function setSmartSupply(smartSupplyEnabled, divisionName, city) {

        // set smart supply

        if (!smartSupplyEnabled) {
            API.setSmartSupply(divisionName, city, true)
        }
    }

    function sellMaterial(divisionName, city) {

        // set sell materials 

        let sellMaterial = getSellMaterials(divisionName)
        for (let material of sellMaterial) {
            API.sellMaterial(divisionName, city, material, "MAX", "MP")
        }
    }

    function sellProduct(makeProducts, products, divisionName, city) {

        // set sell to products 

        if (makeProducts) {
            for (let product of products) {
                API.sellProduct(divisionName, city, product, "MAX", "MP")
            }
        }
    }

    function expandWarehouseSize(sizeUsed, size) {

        // upgrade warehouse size with level upgrade

        if (sizeUsed / size * 100 > 90) {

            if (API.getCorporation().funds > API.getUpgradeLevelCost("Smart Storage")) {
                API.levelUpgrade("Smart Storage")
            }
        }
    }

    function handleWarehouse(division) {

        // done > set Smart Supply
        // done > sell material
        // done > sell product
        // done > expand warehouse size

        for (let city of division.cities) {

            let warehouseData = API.getWarehouse(division.name, city)
            // {"level":2,"city":"Sector-12","size":940,"sizeUsed":469.64325151524343,"smartSupplyEnabled":true}

            setSmartSupply(warehouseData.smartSupplyEnabled, division.name, city)
            sellMaterial(division.name, city)
            sellProduct(division.makesProducts, division.products, division.name, city)
            expandWarehouseSize(warehouseData.sizeUsed, warehouseData.size)
        }
    }

    function hireEmployees(employees, size, divisionName, city) {

        // hire employees

        if (employees < size) {
            let amount = size - employees
            for (var i = 0; i < amount; i++) {
                API.hireEmployee(divisionName, city)
            }
        }
    }

    function assignJobs(employees, divisionName, city) {

        // assign tasks to all employees

        let dist = {
            o: Math.round(employees * 0.35),
            e: Math.round(employees * 0.30),
            b: Math.floor(employees * 0.25),
            m: Math.floor(employees * 0.10),
            r: Math.floor(employees * 0.0),
            i: Math.floor(employees * 0.0),
        }

        let x = 0
        for (let key in dist) { x += dist[key] }
        let leftover = employees - x
        if (leftover > 0) { dist.o += leftover }

        if (employees === 3) {

            API.setAutoJobAssignment(divisionName, city, "Operations", 1)
            API.setAutoJobAssignment(divisionName, city, "Engineer", 1)
            API.setAutoJobAssignment(divisionName, city, "Business", 1)

        } else {

            API.setAutoJobAssignment(divisionName, city, "Operations", dist.o)
            API.setAutoJobAssignment(divisionName, city, "Engineer", dist.e)
            API.setAutoJobAssignment(divisionName, city, "Business", dist.b)
            API.setAutoJobAssignment(divisionName, city, "Management", dist.m)
        }
    }

    function boostEnergy(avgEnergy, divisionName, city) {

        // boost energy with tea

        if (avgEnergy < AVG_EMPLOYEE_HEALTH &&
            API.getCorporation().funds > 1e9) {
            API.buyTea(divisionName, city)
        }
    }

    function boostMoral(avgMorale, divisionName, city) {

        // boost morale with a party

        if (avgMorale < AVG_EMPLOYEE_HEALTH &&
            API.getCorporation().funds > 1e9) {
            API.throwParty(divisionName, city, 1e6)
        }
    }

    function upgradeOfficeSize(divisionName, city) {

        // upgrade office size by 3

        if (API.getCorporation().funds > API.getOfficeSizeUpgradeCost(divisionName, city, 3) &&
            API.getCorporation().funds > 1e9) {
            API.upgradeOfficeSize(divisionName, city, 3)
        }
    }

    function researchUpgrades() {

        // todo
    }

    function handleOffice(division) {

        // done > hire employees
        // done > set jobs for employees 
        // done > boost energie
        // done > boost moral
        // done > upgrade office size
        // todo > set up research & development if office size > 30

        let totalEmployees = 0

        for (let city of division.cities) {

            let officeData = API.getOffice(division.name, city)
            totalEmployees += officeData.numEmployees
            // {"city":"Sector-12","size":51,"maxEnergy":100,"maxMorale":100,"numEmployees":51,"avgEnergy":81.22141795099317,"avgMorale":87.02619053049231,"totalExperience":3904.062500000081,"employeeProductionByJob":{"total":10922.257060272725,"Operations":4505.8673751341075,"Engineer":3931.7701790583546,"Business":1235.2937690187878,"Management":1249.3257370614729,"Research & Development":0,"Intern":0,"Unassigned":0},"employeeJobs":{"Operations":19,"Engineer":15,"Business":12,"Management":5,"Research & Development":0,"Intern":0,"Unassigned":0}}

            hireEmployees(officeData.numEmployees, officeData.size, division.name, city)
            assignJobs(officeData.numEmployees, division.name, city)
            boostEnergy(officeData.avgEnergy, division.name, city)
            boostMoral(officeData.avgMorale, division.name, city)
            upgradeOfficeSize(division.name, city)
            researchUpgrades()

        }

        ns.print("Employees\t" + totalEmployees)
    }

    function hireAdvert(divisionName) {

        // hires adverts

        if (API.getCorporation().funds > API.getHireAdVertCost(divisionName) + 1e9) {
            API.hireAdVert(divisionName)
        }
    }

    function createNewProductName(existingProducts) {

        const baseName = "Product-"
        let numberOfProducts = 0

        existingProducts.forEach(prod => {

            let num = prod.split("-")[1]

            if (num > numberOfProducts) {
                numberOfProducts = num
            }
        })

        numberOfProducts++
        return baseName + numberOfProducts

    }

    function handleProduct(makesProducts, products, maxProducts, divisionName) {

        // create / discontinue products

        if (makesProducts) {

            if (products.length === 0) {

                API.makeProduct(divisionName, "Sector-12", "Product-0", 1, 1)
                API.makeProduct(divisionName, "Sector-12", "Product-1", 1, 1)
                API.makeProduct(divisionName, "Sector-12", "Product-2", 1, 1)

            } else if (products.length < maxProducts) {

                // develop product
                let numOfProductsToMake = maxProducts - products.length
                for (var i = 0; i < numOfProductsToMake; i++) {

                    let invest = API.getCorporation().funds / 2
                    API.makeProduct(divisionName, "Sector-12", createNewProductName(products), invest, invest)
                }

            } else {

                // discontinue product
                // todo 

                // {"name":"Product-0","rating":688.967014676165,"effectiveRating":52.49636233782928,
                // "stats":{"quality":660.6280610076291,"performance":851.4283710501287,"durability":589.6590985569666,"reliability":575.2554979079844,"aesthetics":357.3792527778803,"features":767.8640448581159},
                // "productionCost":19700.68608018942,"desiredSellPrice":"MP","desiredSellAmount":"MAX","stored":0,"productionAmount":15.697464199020732,"actualSellAmount":15.697464199020732,"developmentProgress":100,"advertisingInvestment":1,"designInvestment":1,"size":0.03}

                // products.forEach(product => {
                //     ns.print(API.getProduct(divisionName, "Sector-12", product))
                // })

            }
        }
    }

    function handleProductionMult() {

    }

    function handleDivisions(divisions) {

        // done > expand to all cities first
        // done > get all cities a warehouse
        // done > run the office
        // done > run the warehouse
        // done > hire advert
        // todo > create / discontinue product 
        // todo > fill warehouse with booster material en export
        // todo > buy research upgrades 

        for (let division of divisions) {

            let divisionData = API.getDivision(division)
            logDivision(divisionData)
            // {"name":"Software","type":"Software","awareness":439.9579416928646,"popularity":148.41790015997182,"productionMult":7.94406563874802,"researchPoints":0,"lastCycleRevenue":11087995.928321738,"lastCycleExpenses":1478569.291055181,"thisCycleRevenue":0,"thisCycleExpenses":488420.944500005,"numAdVerts":59,"cities":["Sector-12","Aevum","Chongqing","New Tokyo","Ishima","Volhaven"],"products":["Product-0","Product-1","Product-2"],"makesProducts":true,"maxProducts":3}

            if (expandDivision(divisionData)) {

                handleWarehouse(divisionData)
                handleOffice(divisionData)

                hireAdvert(divisionData.name)
                handleProduct(divisionData.makesProducts, divisionData.products, divisionData.maxProducts, divisionData.name)
                handleProductionMult()

            }
        }
    }

    function createCorporation() {

        // create corp if non existant 
        const corporationName = "CapitalPrinter Inc"

        if (!API.hasCorporation()) {
            if (API.createCorporation(corporationName, false)) {
                ns.tprint("Corporation \"" + corporationName + "\" created")
                API.expandIndustry(DIVISIONS[0], DIVISIONS[0])
                API.purchaseUnlock("Smart Supply")
                API.purchaseUnlock("Export")
            }
        }
    }

    function expandIndustry(divisions) {

        // expand industy only if prev has 6 cities

        if (API.getDivision(divisions[divisions.length - 1]).cities.length === 6) {

            let nextIndustryName = ALL_DIVISIONS[divisions.length]
            let industyData = API.getIndustryData(nextIndustryName)

            ns.print("\nNext industry \t" + nextIndustryName)
            ns.print("Cost\t\t" + ns.formatNumber(industyData.startingCost))

            if (API.getCorporation().funds > industyData.startingCost) {
                API.expandIndustry(nextIndustryName, nextIndustryName)
            }
        }
    }

    function buyUpgrades() {

        // todo

        const wantedUpgrades = ["ABC SalesBots", "DreamSense", "Smart Factories"]

        // if (API.getCorporation().funds > API.getUpgradeLevelCost("ABC SalesBots") + 3e9) {
        //     API.levelUpgrade("ABC SalesBots")
        // }
    }

    function buyUnlocks() {

        // todo
    }

    function setDividents() {

        // todo

        // if public
        // if programs.js is running set to x
        // if install.js is running set to x
    }

    function bribeFactions() {

        // put some factions under presure 
    }

    function goPublic() {

        // todo

        // if more than 2 divisions go public 
    }

    //\\ LOGIC
    while (true) {

        // done > run divisions we have 
        // done > try to buy next division 
        // corporation > buy Upgrades "DreamSense", "ABC SalesBots", "Smart Factories"
        // corporation > buy Unlocks ?
        // corporation > set dividents based on timeline
        // corporation > go public if divisions > 2 

        await API.nextUpdate()
        ns.clearLog()

        let corporationData = API.getCorporation()
        // getCorporation {"name":"CapitalPrinter Inc","funds":20000000000,"revenue":0,"expenses":0,"public":false,"totalShares":1500000000,
        // "numShares":1000000000,"shareSaleCooldown":0,"investorShares":500000000,"issuedShares":0,"issueNewSharesCooldown":0,
        // "sharePrice":0.016186328769970792,"dividendRate":0,"dividendTax":0.15,"dividendEarnings":0,"nextState":"START","prevState":"SALE",
        // "divisions":["Agriculture"]}

        logCorporation(corporationData)
        handleDivisions(corporationData.divisions)
        expandIndustry(corporationData.divisions)

        buyUpgrades()
        buyUnlocks()
        setDividents()
        bribeFactions()
        goPublic()

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

// getInvestmentOffer()	                                                                        Get an offer for investment based on you companies current valuation
// acceptInvestmentOffer()	                                                                    Accept investment based on you companies current valuation
// goPublic(numShares)	                                                                        Go public
// issueNewShares(amount)	                                                                    Issue new shares
// issueDividends(rate)	                                                                        Issue dividends
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