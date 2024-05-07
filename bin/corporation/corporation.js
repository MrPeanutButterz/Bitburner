import { scriptPath } from "./lib/scripting"

/** @param {NS} ns */
export async function main(ns) {

    /** _                _           
     * | |    ___   __ _(_) ___ __ _ 
     * | |   / _ \ / _` | |/ __/ _` |
     * | |__| (_) | (_| | | (_| (_| |
     * |_____\___/ \__, |_|\___\__,_|
     *              |___/             
     * 
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
    const CORPORATION_NAME = "CapitalPrinter Inc"
    const API = ns.corporation
    const AVG_EMPLOYEE_HEALTH = 90
    const WAREHOUSE_USAGE_PROD_MULT = 0.5

    let SPENDMONEY = true
    let CREDIT_BUFFER = 1e9

    const ALL_CITIES = [
        ns.enums.CityName.Sector12,
        ns.enums.CityName.Aevum,
        ns.enums.CityName.Chongqing,
        ns.enums.CityName.NewTokyo,
        ns.enums.CityName.Ishima,
        ns.enums.CityName.Volhaven,
    ]

    const NEW_DIVISIONS = [
        { type: "Agriculture", name: "AGRCLT" },
        { type: "Spring Water", name: "SPRNG" },
        { type: "Restaurant", name: "RESTO" },
        { type: "Tobacco", name: "TOBCO" },
        { type: "Software", name: "SOFTW" },
        { type: "Refinery", name: "REFIN" },
        { type: "Chemical", name: "CHEM" },
        { type: "Fishing", name: "FISHY" },
        { type: "Water Utilities", name: "WATUT" },
        { type: "Pharmaceutical", name: "PHRMA" },
        { type: "Mining", name: "MINE" },
        { type: "Computer Hardware", name: "CPHW" },
        { type: "Real Estate", name: "RLST8" },
        { type: "Healthcare", name: "HLTHC" },
        { type: "Robotics", name: "ROBO" },
        { type: "Agriculture", name: "FARMG" },
        { type: "Software", name: "CODE" },
        { type: "Real Estate", name: "ESTAT" },
        { type: "Healthcare", name: "MEDIC" },
        { type: "Robotics", name: "BOTIC" },
    ]

    const RESEARCHUPGRADESMT = [
        "Hi-Tech R&D Laboratory",
        "AutoBrew",
        "AutoPartyManager",
        "Drones",
        "Drones - Assembly",
        "Drones - Transport",
        "Self-Correcting Assemblers",
        "Automatic Drug Administration",
        "CPH4 Injections",
        "Go-Juice",
        "Overclock",
        "Sti.mu",
        // "Market-TA.I",
        // "Market-TA.II",
    ]

    const RESEARCHUPGRADESMP = [
        "uPgrade: Fulcrum",
        "uPgrade: Dashboard",
        "uPgrade: Capacity.I",
        // "uPgrade: Capacity.II",
    ]

    function logCorporation(corp) {

        // log corp status

        ns.print("Name\t\t" + corp.name)
        ns.print("Funds\t\t" + ns.formatNumber(corp.funds))
        ns.print("Revenue\t\t" + ns.formatNumber(corp.revenue))
        ns.print("Expense\t\t" + ns.formatNumber(corp.expenses))
        ns.print("dividendRate\t" + ns.formatPercent(corp.dividendRate))
        ns.print("Divisions\t" + corp.divisions.length)
        ns.print("Credit buffer\t" + ns.formatNumber(CREDIT_BUFFER))
        ns.print("Spend\t\t" + SPENDMONEY)
    }

    function logDivision(division) {

        // log division status

        ns.print("\nDivision\t" + division.name)
        ns.print("Profit\t\t" + ns.formatNumber(division.lastCycleRevenue - division.lastCycleExpenses))
        ns.print("Awareness\t" + Math.round(division.awareness))
        ns.print("Popularity\t" + Math.round(division.popularity))
        ns.print("Research\t" + Math.round(division.researchPoints))
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
            case "xAGRI": return ["Plants", "Food"]
            case "xSFTW": return ["AI Cores"]
            case "xRSST": return ["Real Estate"]
            case "xHLCR": return []
            case "xRBTC": return ["Robots"]


        }
    }

    function getProductionMultiplierMaterial(divisionName) {

        switch (divisionName) {
            case "Agriculture": return "Real Estate"
            case "Spring Water": return "Real Estate"
            case "Restaurant": return "AI Cores"
            case "Tobacco": return "Robots"
            case "Software": return "Real Estate"
            case "Refinery": return "Hardware"
            case "Chemical": return "Real Estate"
            case "Fishing": return "Robots"
            case "Water Utilities": return "Real Estate"
            case "Pharmaceutical": return "Robots"
            case "Mining": return "Robots"
            case "Computer Hardware": return "Robots"
            case "Real Estate": return "Robots"
            case "Healthcare": return "Real Estate"
            case "Robotics": return "Real Estate"
            case "xAGRI": return "Real Estate"
            case "xSFTW": return "Real Estate"
            case "xRSST": return "Robots"
            case "xHLCR": return "Real Estate"
            case "xRBTC": return "Real Estate"
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

    function expandWarehouseSize(sizeUsed, size, divisionName, city) {

        // upgrade warehouse size with level upgrade

        // if (SPENDMONEY) {

        if (sizeUsed / size * 100 > 90) {

            if (API.getCorporation().funds > API.getUpgradeLevelCost("Smart Storage") + CREDIT_BUFFER) {
                API.levelUpgrade("Smart Storage")

            } else if (API.getCorporation().funds > API.getUpgradeWarehouseCost(divisionName, city, 1) + CREDIT_BUFFER) {

                API.upgradeWarehouse(divisionName, city, 1)
                // only if discontinue product is working

            }
        }
        // }
    }

    function handleWarehouse(division) {

        // __        __             _                          
        // \ \      / /_ _ _ __ ___| |__   ___  _   _ ___  ___ 
        //  \ \ /\ / / _` | '__/ _ \ '_ \ / _ \| | | / __|/ _ \
        //   \ V  V / (_| | | |  __/ | | | (_) | |_| \__ \  __/
        //    \_/\_/ \__,_|_|  \___|_| |_|\___/ \__,_|___/\___|

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
            expandWarehouseSize(warehouseData.sizeUsed, warehouseData.size, division.name, city)
        }
    }

    function hireEmployees(employees, size, divisionName, city) {

        // hire employees

        if (SPENDMONEY) {

            if (employees < size) {
                let amount = size - employees
                for (var i = 0; i < amount; i++) {
                    API.hireEmployee(divisionName, city)
                }
            }
        }
    }

    function assignJobDistribution(employees, research) {

        // @return distribution for employees 

        let distribution = {}

        if (research) {

            distribution = {
                o: Math.round(employees * 0.35),
                e: Math.round(employees * 0.25),
                b: Math.floor(employees * 0.20),
                m: Math.floor(employees * 0.10),
                r: Math.floor(employees * 0.10),
                i: Math.floor(employees * 0.0),
            }

        } else {

            distribution = {
                o: Math.round(employees * 0.35),
                e: Math.round(employees * 0.30),
                b: Math.floor(employees * 0.25),
                m: Math.floor(employees * 0.10),
                r: Math.floor(employees * 0.0),
                i: Math.floor(employees * 0.0),
            }
        }

        let x = 0
        for (let key in distribution) { x += distribution[key] }
        let leftover = employees - x
        if (leftover > 0) { distribution.o += leftover }
        if (leftover < 0) { distribution.m += leftover }

        return distribution

    }

    function researchCompleted(divisionName, makeProducts) {

        // check is all research is complete 

        let complete = true

        for (let rs of RESEARCHUPGRADESMT) {
            if (!API.hasResearched(divisionName, rs)) { return false }
        }

        if (makeProducts) {
            for (let rs of RESEARCHUPGRADESMP) {
                if (!API.hasResearched(divisionName, rs)) { return false }
            }
        }

        return complete
    }

    function assignJobs(employees, divisionName, city, makeProducts) {

        // assign tasks to all employees

        let distribution

        if (employees === 3) {

            API.setAutoJobAssignment(divisionName, city, "Operations", 1)
            API.setAutoJobAssignment(divisionName, city, "Engineer", 1)
            API.setAutoJobAssignment(divisionName, city, "Business", 1)

        } else if (employees > 30 && !researchCompleted(divisionName, makeProducts)) {

            distribution = assignJobDistribution(employees, true)
            API.setAutoJobAssignment(divisionName, city, "Operations", distribution.o)
            API.setAutoJobAssignment(divisionName, city, "Engineer", distribution.e)
            API.setAutoJobAssignment(divisionName, city, "Business", distribution.b)
            API.setAutoJobAssignment(divisionName, city, "Management", distribution.m)
            API.setAutoJobAssignment(divisionName, city, "Research & Development", distribution.r)

        } else {

            distribution = assignJobDistribution(employees, false)
            API.setAutoJobAssignment(divisionName, city, "Research & Development", distribution.r)
            API.setAutoJobAssignment(divisionName, city, "Operations", distribution.o)
            API.setAutoJobAssignment(divisionName, city, "Engineer", distribution.e)
            API.setAutoJobAssignment(divisionName, city, "Business", distribution.b)
            API.setAutoJobAssignment(divisionName, city, "Management", distribution.m)
        }
    }

    function boostEnergy(avgEnergy, divisionName, city) {

        // boost energy with tea
        if (SPENDMONEY) {

            if (avgEnergy < AVG_EMPLOYEE_HEALTH &&
                API.getCorporation().funds > CREDIT_BUFFER) {
                API.buyTea(divisionName, city)
            }
        }
    }

    function boostMoral(avgMorale, divisionName, city) {

        // boost morale with a party
        if (SPENDMONEY) {

            if (avgMorale < AVG_EMPLOYEE_HEALTH &&
                API.getCorporation().funds > CREDIT_BUFFER) {
                API.throwParty(divisionName, city, 1e6)
            }
        }
    }

    function upgradeOfficeSize(divisionName, city) {

        // upgrade office size by 3
        if (SPENDMONEY) {

            if (API.getCorporation().funds > API.getOfficeSizeUpgradeCost(divisionName, city, 3) + CREDIT_BUFFER) {
                API.upgradeOfficeSize(divisionName, city, 3)
            }
        }
    }

    function researchUpgrades(divisionName, makeProducts) {

        // get research upgrades 

        for (var i = 0; i < RESEARCHUPGRADESMT.length;) {

            if (!API.hasResearched(divisionName, RESEARCHUPGRADESMT[i])) {

                if (API.getDivision(divisionName).researchPoints >
                    API.getResearchCost(divisionName, RESEARCHUPGRADESMT[i])) {

                    API.research(divisionName, RESEARCHUPGRADESMT[i])

                } else { break }

            } else { i++ }
        }

        if (makeProducts) {

            for (var i = 0; i < RESEARCHUPGRADESMP.length;) {

                if (!API.hasResearched(divisionName, RESEARCHUPGRADESMP[i])) {

                    if (API.getDivision(divisionName).researchPoints >
                        API.getResearchCost(divisionName, RESEARCHUPGRADESMP[i])) {

                        API.research(divisionName, RESEARCHUPGRADESMP[i])

                    } else { break }

                } else { i++ }
            }
        }
    }

    function handleOffice(division) {

        //   ___   __  __ _          
        //  / _ \ / _|/ _(_) ___ ___ 
        // | | | | |_| |_| |/ __/ _ \
        // | |_| |  _|  _| | (_|  __/
        //  \___/|_| |_| |_|\___\___|

        // done > hire employees
        // done > set jobs for employees 
        // done > boost energie
        // done > boost moral
        // done > upgrade office size
        // done > set up research & development if office size > 30

        let totalEmployees = 0

        for (let city of division.cities) {

            let officeData = API.getOffice(division.name, city)
            // {"city":"Sector-12","size":51,"maxEnergy":100,"maxMorale":100,"numEmployees":51,"avgEnergy":81.22141795099317,
            // "avgMorale":87.02619053049231,"totalExperience":3904.062500000081,
            // "employeeProductionByJob":{"total":10922.257060272725,"Operations":4505.8673751341075,"Engineer":3931.7701790583546,"Business":1235.2937690187878,"Management":1249.3257370614729,"Research & Development":0,"Intern":0,"Unassigned":0},
            // "employeeJobs":{"Operations":19,"Engineer":15,"Business":12,"Management":5,"Research & Development":0,"Intern":0,"Unassigned":0}}

            hireEmployees(officeData.numEmployees, officeData.size, division.name, city)
            assignJobs(officeData.numEmployees, division.name, city, division.makesProducts)
            boostEnergy(officeData.avgEnergy, division.name, city)
            boostMoral(officeData.avgMorale, division.name, city)
            upgradeOfficeSize(division.name, city)
            researchUpgrades(division.name, division.makesProducts)

            totalEmployees += officeData.numEmployees
        }
        ns.print("Employees\t" + totalEmployees)
    }

    function hireAdvert(divisionName) {

        // hires adverts
        if (SPENDMONEY) {

            if (API.getCorporation().funds > API.getHireAdVertCost(divisionName) + CREDIT_BUFFER) {
                API.hireAdVert(divisionName)
            }
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

    function handleProduct(makesProducts, products, maxProducts, divisionName, divisionCities) {

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

                // {"name":"Product-0","demand":0.001,"competition":83.23479999998693,"rating":688.967014676165,"effectiveRating":52.4963623378293,
                // "stats":{"quality":660.6280610076291,"performance":851.4283710501287,"durability":589.6590985569666,"reliability":575.2554979079844,"aesthetics":357.3792527778803,"features":767.8640448581159},
                // "productionCost":27251.021108706314,"desiredSellPrice":"MP","desiredSellAmount":"MAX",
                // "stored":3741212.121545457,"productionAmount":148.52227879071572,"actualSellAmount":39.11689631476117,
                // "developmentProgress":100,"advertisingInvestment":1,"designInvestment":1,"size":0.03}       

                let discontinueProduct = { division: "none", productName: "none" }

                products.forEach(product => {

                    divisionCities.forEach(city => {

                        let data = API.getProduct(divisionName, city, product)

                        if (data.developmentProgress === 100 &&
                            API.getCorporation().prevState === "SALE" &&
                            data.stored > 100) {

                            ns.tprint("ERROR DISCONTINUE PROD " + product + " " + divisionName + " " + city)
                            discontinueProduct.division = divisionName
                            discontinueProduct.productName = product

                        }
                    })
                })

                if (discontinueProduct.division != "none" && discontinueProduct.productName != "none") {
                    API.discontinueProduct(discontinueProduct.division, discontinueProduct.productName)
                }
            }
        }
    }

    function handleProductionMult(divisionName, divisionCities) {

        // buys productions multipliers in cheapest city en sells in all others 

        let data = []
        divisionCities.forEach(city => {

            let prodMultMaterial = getProductionMultiplierMaterial(divisionName)
            let material = API.getMaterial(divisionName, city, prodMultMaterial)
            let materialData = API.getMaterialData(prodMultMaterial)
            let warehouse = API.getWarehouse(divisionName, city)

            data.push({
                city: city,
                exports: material.exports,
                warehouseMaxFill: Math.round(warehouse.size * WAREHOUSE_USAGE_PROD_MULT) / materialData.size,

                materialName: prodMultMaterial,
                materialSize: materialData.size,
                materialMarketPrice: Math.round(material.marketPrice),

                materialStored: Math.floor(material.stored),
                materialDemand: Math.round((warehouse.size * WAREHOUSE_USAGE_PROD_MULT) / materialData.size) - Math.floor(material.stored),
                materialExportAmt: Math.ceil((warehouse.size * WAREHOUSE_USAGE_PROD_MULT / materialData.size - material.stored) * materialData.size + material.actualSellAmount),
            })
        })

        data.sort((a, b) => a.materialMarketPrice - b.materialMarketPrice)
        data.forEach(element => {

            if (data[0].city === element.city) {

                // dont sell in city where to buy
                API.sellMaterial(divisionName, element.city, element.materialName, 0, "MP")

                // only buy if there is demand 
                if (element.materialDemand > 0 && element.materialStored < element.warehouseMaxFill) {

                    let corporationFunds = API.getCorporation().funds
                    let bulkPrice = element.materialDemand * element.materialMarketPrice

                    // buy demand or funds based
                    if (corporationFunds > bulkPrice) {

                        API.bulkPurchase(divisionName, element.city, element.materialName, element.materialDemand)

                    } else {

                        let parcialBulkDemand = Math.floor(corporationFunds / bulkPrice)
                        API.bulkPurchase(divisionName, element.city, element.materialName, parcialBulkDemand)
                    }
                }

            } else {

                // set all other city to sell
                API.sellMaterial(divisionName, element.city, element.materialName, "MAX", "MP")

                // remove expired exports from sellCity
                for (let oldExport of element.exports) {
                    API.cancelExportMaterial(divisionName, element.city, oldExport.division, oldExport.city, element.materialName)
                }

                if (API.getCorporation().nextState === "EXPORT") {

                    // set up exports from buyCity
                    if (element.materialDemand > 0) {

                        // find if export exists 
                        let exportExists = false
                        for (let runningExports of data[0].exports) {
                            if (runningExports.city === element.city) { exportExists = true }
                        }

                        // set up export
                        if (!exportExists) {
                            API.exportMaterial(divisionName, data[0].city, divisionName, element.city, element.materialName, element.materialExportAmt)
                        }
                    }

                } else {

                    // remove all exports from buyCity when done
                    for (let oldExport of data[0].exports) {
                        API.cancelExportMaterial(divisionName, data[0].city, divisionName, oldExport.city, element.materialName)
                    }
                }
            }
        })
    }

    function handleDivisions(divisions) {

        //  ____  _       _     _
        // |  _ \(_)_   _(_)___(_) ___  _ __  ___
        // | | | | \ \ / / / __| |/ _ \| '_ \/ __|
        // | |_| | |\ V /| \__ \ | (_) | | | \__ \
        // |____/|_| \_/ |_|___/_|\___/|_| |_|___/

        // done > expand to all cities first
        // done > get all cities a warehouse
        // done > run the office
        // done > run the warehouse
        // done > hire advert
        // todo > create / discontinue product 
        // done > fill warehouse with booster material en export
        // done > handle research upgrades 

        for (let division of divisions) {

            let divisionData = API.getDivision(division)
            logDivision(divisionData)

            // {"name":"Software","type":"Software","awareness":439.9579416928646,"popularity":148.41790015997182,
            //"productionMult":7.94406563874802,"researchPoints":0,"lastCycleRevenue":11087995.928321738,
            //"lastCycleExpenses":1478569.291055181,"thisCycleRevenue":0,"thisCycleExpenses":488420.944500005,"numAdVerts":59,
            // "cities":["Sector-12","Aevum","Chongqing","New Tokyo","Ishima","Volhaven"],
            // "products":["Product-0","Product-1","Product-2"],"makesProducts":true,"maxProducts":3}

            if (expandDivision(divisionData)) {

                handleWarehouse(divisionData)
                handleOffice(divisionData)

                hireAdvert(divisionData.name)
                handleProduct(divisionData.makesProducts, divisionData.products, divisionData.maxProducts, divisionData.name, divisionData.cities)
                handleProductionMult(divisionData.name, divisionData.cities)

            }
        }
    }

    function createCorporation() {

        // create corp if non existant 

        if (!API.hasCorporation()) {
            if (API.createCorporation(CORPORATION_NAME, false)) {
                ns.tprint("Corporation created: " + CORPORATION_NAME)
                API.expandIndustry(NEW_DIVISIONS[0].type, NEW_DIVISIONS[0].name)
                API.purchaseUnlock("Smart Supply")
                API.purchaseUnlock("Export")
            }
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

    function buyUpgrades() {

        // auto buy upgrades
        const wantedUpgrades = ["ABC SalesBots", "DreamSense", "Smart Factories"]

        if (SPENDMONEY) {
            wantedUpgrades.forEach(upgrade => {
                if (API.getCorporation().funds > API.getUpgradeLevelCost(upgrade) + CREDIT_BUFFER) {
                    API.levelUpgrade(upgrade)
                }
            })
        }
    }

    function buyUnlocks() {

        // todo

        if (SPENDMONEY) {

        }
    }

    function setDividents(publicCorp, numOfDivisions) {

        // issue dividents base on running scripts

        let rate = 0

        if (numOfDivisions > 10) { rate = 0.01 }

        if (SPENDMONEY) {

            if (publicCorp && numOfDivisions > 3) {

                if (ns.scriptRunning(SCRIPT.programs, "home")) {

                    API.issueDividends(0.20)

                } else if (ns.scriptRunning(SCRIPT.install, "home")) {

                    API.issueDividends(0.90)

                } else { API.issueDividends(rate) }
            }
        }
    }

    function bribeFactions(funds, revenue) {

        // put some factions under presure 

        if (ns.scriptRunning(SCRIPT.reputation, "home")) {

            let runningScripts = ns.ps("home")
            let reputationScript = runningScripts.find(o => o.filename === "bin/singularity/reputation.js")

            let amt = revenue * 0.1

            if (funds > CREDIT_BUFFER) {

                if (API.bribe(reputationScript.args[0], amt)) { ns.print("WARN\t\tBribe Money " + ns.formatNumber(amt)) }
            }
        }
    }

    function goPublic(publicCorp, numOfDivisions) {

        // go public after 2 divisions
        if (!publicCorp && numOfDivisions > 2) {
            API.goPublic(1)
        }
    }

    function spendMoney() {

        // spend of buy divisions
        API.getBonusTime() > 2000 ? SPENDMONEY = false : SPENDMONEY = true
    }

    function setCreditBuffer(divisions) {

        // set credit buffer
        if (divisions > 2) {
            if (CREDIT_BUFFER != 1e9 * divisions) {
                CREDIT_BUFFER = 1e9 * divisions
            }
        }
    }

    //\\ LOGIC
    while (true) {

        //   ____                                 _   _             
        //  / ___|___  _ __ _ __   ___  _ __ __ _| |_(_) ___  _ __  
        // | |   / _ \| '__| '_ \ / _ \| '__/ _` | __| |/ _ \| '_ \ 
        // | |__| (_) | |  | |_) | (_) | | | (_| | |_| | (_) | | | |
        //  \____\___/|_|  | .__/ \___/|_|  \__,_|\__|_|\___/|_| |_|
        //                 |_|                                      

        // done > run divisions we have 
        // done > try to buy next division 
        // done > buy Upgrades "DreamSense", "ABC SalesBots", "Smart Factories"
        // corporation > buy Unlocks ?
        // done > set dividents based on timeline
        // done > go public if divisions > 2 

        await API.nextUpdate()
        ns.clearLog()

        let corporationData = API.getCorporation()
        // getCorporation {"name":"CapitalPrinter Inc","funds":20000000000,"revenue":0,"expenses":0,"public":false,"totalShares":1500000000,
        // "numShares":1000000000,"shareSaleCooldown":0,"investorShares":500000000,"issuedShares":0,"issueNewSharesCooldown":0,
        // "sharePrice":0.016186328769970792,"dividendRate":0,"dividendTax":0.15,"dividendEarnings":0,"nextState":"START","prevState":"SALE",
        // "divisions":["Agriculture"]}

        goPublic(corporationData.public, corporationData.divisions.length)
        setDividents(corporationData.public, corporationData.divisions.length)
        setCreditBuffer(corporationData.divisions.length)

        logCorporation(corporationData)
        bribeFactions(corporationData.funds, corporationData.revenue)
        handleDivisions(corporationData.divisions)
        expandIndustry(corporationData.divisions)

        spendMoney()
        buyUpgrades()
        buyUnlocks()
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