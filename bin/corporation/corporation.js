import { scriptStart, scriptPath } from "lib/scripting"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    scriptStart(ns)
    ns.tail()

    //\\ GENERAL DATA
    const SCRIPT = scriptPath(ns)
    const API = ns.corporation
    const CITIES = [
        ns.enums.CityName.Sector12,
        ns.enums.CityName.Aevum,
        ns.enums.CityName.Chongqing,
        ns.enums.CityName.NewTokyo,
        ns.enums.CityName.Ishima,
        ns.enums.CityName.Volhaven,
    ]

    const DIVISIONS = []

    //\\ FUNCTIONS 
    function createCorporation() {

        // create corp if non existant 
        const corporationName = "CapitalPrinter Inc"

        if (!API.hasCorporation()) {
            if (API.createCorporation(corporationName, false)) {
                ns.tprint("Corporation \"" + corporationName + "\" created")
                API.expandIndustry("Agriculture", "Agriculture")
                API.purchaseUnlock("Smart Supply")
                API.purchaseUnlock("Export")
            }
        }
    }

    function display() {

        let c = API.getCorporation()

        // ns.print(c)
        ns.print("Running \t" + c.name)
        ns.print("Funds \t\t" + ns.formatNumber(c.funds))
        ns.print("Revenue \t" + ns.formatNumber(c.revenue))
        ns.print("Expenses \t" + ns.formatNumber(c.expenses))
        ns.print("State \t\t" + c.prevState + " => " + c.nextState)
        ns.print("Divisions \t" + c.divisions.length)

        // getCorporation {"name":"CapitalPrinter Inc","funds":20000000000,"revenue":0,"expenses":0,"public":false,"totalShares":1500000000,"numShares":1000000000,"shareSaleCooldown":0,"investorShares":500000000,"issuedShares":0,"issueNewSharesCooldown":0,"sharePrice":0.016186328769970792,"dividendRate":0,"dividendTax":0.15,"dividendEarnings":0,"nextState":"START","prevState":"SALE","divisions":["Agriculture"],"state":"START"}
    }

    function expandIndustry(division) {

        CITIES.forEach(city => {
            if (!division.cities.includes(city) && API.getCorporation().funds > 9e9) {
                API.expandCity(division.name, city)
                API.purchaseWarehouse(division.name, city)
            }
        })
    }

    function getSellProducts(division) {

        switch (division) {
            case "Agriculture": return ["Plants", "Food"]
            case "Spring Water": return ["Water"]
        }
    }

    function getProductBooster(division) {

        switch (division) {
            case "Agriculture": return "Real Estate"
            case "Spring Water": return "Real Estate"
        }
    }

    function boosterProductExport(division) {

        let data = []
        let boostProduct = getProductBooster(division)

        CITIES.forEach(city => {
            data.push({
                city: city,
                marketPrice: Math.round(API.getMaterial(division, city, boostProduct).marketPrice),
                disiredSellPrice: API.getMaterial(division, city, boostProduct).desiredSellPrice,
                desiredSellAmount: API.getMaterial(division, city, boostProduct).desiredSellAmount,
                actualSellAmount: Math.round(API.getMaterial(division, city, boostProduct).actualSellAmount),
                stored: API.getMaterial(division, city, boostProduct).stored,
                exports: API.getMaterial(division, city, boostProduct).exports,
                exportAmount: (6000 - API.getMaterial(division, city, boostProduct).stored) +
                    API.getMaterial(division, city, boostProduct).actualSellAmount,
            })
        })

        data.sort((a, b) => a.marketPrice - b.marketPrice)

        data.forEach(e => {

            if (data[0].city === e.city) {

                API.sellMaterial(division, e.city, boostProduct, 0, "MP")
                if (e.stored < 6000) {

                    let price = API.getMaterial(division, e.city, boostProduct).marketPrice
                    let amount = 6000 - e.stored

                    if (API.getCorporation().funds > amount * price) {

                        API.bulkPurchase(division, e.city, boostProduct, 6000 - e.stored)

                    } else {

                        let funds = API.getCorporation().funds
                        let amount = Math.floor(funds / price)
                        API.bulkPurchase(division, e.city, boostProduct, amount)
                    }
                }

            } else {

                API.sellMaterial(division, e.city, boostProduct, "MAX", "MP")

                for (let o of e.exports) {

                    API.cancelExportMaterial(division, e.city, o.division, o.city, boostProduct)
                }

                for (let o of data[0].exports) {
                    if (o.city === e.city) {

                        API.cancelExportMaterial(division, data[0].city, division, e.city, boostProduct)
                    }
                }

                if (e.exportAmount > 0) {

                    API.exportMaterial(division, data[0].city, division, e.city, boostProduct, e.exportAmount)
                }
            }
        })
    }

    function handleWarehouse(divisionData) {

        for (let city of divisionData.cities) {

            // {"level":1,"city":"Sector-12","size":100,"sizeUsed":3.030938363758457,"smartSupplyEnabled":true}

            let warehouse = API.getWarehouse(divisionData.name, city)
            let sellProducts = getSellProducts(divisionData.name)

            // enable smart supply
            if (!warehouse.smartSupplyEnabled) { API.setSmartSupply(divisionData.name, city, true) }

            // sell products
            sellProducts.forEach(product => {

                API.sellMaterial(divisionData.name, city, product, "MAX", "MP")
            })

            boosterProductExport(divisionData.name)
        }
    }

    function hireEmployees(division, city, office) {

        if (office.numEmployees < office.size) {
            let amount = office.size - office.numEmployees
            for (var i = 0; i < amount; i++) {

                API.hireEmployee(division, city)
            }
        }
    }

    function assignTask(division, city, employees) {

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

            API.setAutoJobAssignment(division, city, "Operations", 1)
            API.setAutoJobAssignment(division, city, "Engineer", 1)
            API.setAutoJobAssignment(division, city, "Business", 1)

        } else {

            API.setAutoJobAssignment(division, city, "Operations", dist.o)
            API.setAutoJobAssignment(division, city, "Engineer", dist.e)
            API.setAutoJobAssignment(division, city, "Business", dist.b)
            API.setAutoJobAssignment(division, city, "Management", dist.m)

        }
    }

    function upgradeOfficeSize(division, city) {

        if (API.getCorporation().funds > API.getOfficeSizeUpgradeCost(division, city, 3)) {
            API.upgradeOfficeSize(division, city, 3)
        }
    }

    function hireAdVert(division) {
        if (API.getCorporation().funds > API.getHireAdVertCost(division) &&
            API.getCorporation().funds > 1e9) {
            API.hireAdVert(division)
        }
    }

    function handleOffice(division) {

        for (let city of division.cities) {

            let office = API.getOffice(division.name, city)
            // ns.print(office)

            hireEmployees(division.name, city, office)
            assignTask(division.name, city, office.numEmployees)
            upgradeOfficeSize(division.name, city)
            hireAdVert(division.name)


        }
    }


    function runCorporation() {

        display()

        let divisions = API.getCorporation().divisions

        for (let division of divisions) {

            let divisionData = API.getDivision(division)
            // ns.print(divisionData)

            if (divisionData.cities.length < 6) {

                expandIndustry(divisionData)

            } else {

                if (divisionData.makesProducts) {

                    // product based

                } else {

                    // material based
                    handleWarehouse(divisionData)
                    handleOffice(divisionData)

                }
            }
        }
    }

    //\\ LOGIC
    createCorporation()

    while (true) {
        await API.nextUpdate()
        ns.clearLog()
        runCorporation()
    }
}

// CORPORATION
// hasCorporation()	                            Returns whether the player has a corporation. Does not require API access.
// createCorporation(corporationName, selfFund)	Create a Corporation
// nextUpdate()	                                Sleep until the next Corporation update has happened.

// getCorporation()	                            Get corporation data
// getDivision(divisionName)	                Get division data

// expandCity(divisionName, city)	            Expand to a new city
// expandIndustry(industryType, divisionName)	Expand to a new industry
// hasUnlock(upgradeName)	                    Check if you have a one time unlockable upgrade

// getBonusTime()	                            Get bonus time. “Bonus time” is accumulated when the game is offline or if the game is inactive in the browser. “Bonus time” makes the game progress faster.
// getConstants()	                            Get corporation related constants
// getIndustryData(industryName)	            Get constant industry definition data for a specific industry
// getMaterialData(materialName)	            Get constant data for a specific material
// getUnlockCost(upgradeName)	                Gets the cost to unlock a one time unlockable upgrade
// purchaseUnlock(upgradeName)	                Unlock an upgrade
// getUpgradeLevel(upgradeName)	                Get the level of a levelable upgrade
// getUpgradeLevelCost(upgradeName)	            Gets the cost to unlock the next level of a levelable upgrade
// levelUpgrade(upgradeName)	                Level an upgrade.

// getInvestmentOffer()	                        Get an offer for investment based on you companies current valuation
// acceptInvestmentOffer()	                    Accept investment based on you companies current valuation
// goPublic(numShares)	                        Go public
// issueNewShares(amount)	                    Issue new shares
// issueDividends(rate)	                        Issue dividends
// buyBackShares(amount)	                    Buyback Shares. Spend money from the player's wallet to transfer shares from public traders to the CEO.
// sellShares(amount)	                        Sell Shares. Transfer shares from the CEO to public traders to receive money in the player's wallet.
// sellDivision(divisionName)	                Sell a division

// bribe(factionName, amountCash)	            Bribe a faction

//===========================================================================================================================================================

// OFFICE
// getOffice(divisionName, city)	                            Get data about an office
// hireEmployee(divisionName, city, employeePosition)	        Hire an employee.
// setAutoJobAssignment(divisionName, city, job, amount)	    Set the auto job assignment for a job
// getOfficeSizeUpgradeCost(divisionName, city, size)	        Cost to Upgrade office size.
// upgradeOfficeSize(divisionName, city, size)                  Upgrade office size.

// getHireAdVertCount(divisionName)	                            Get the number of times you have hired AdVert.
// getHireAdVertCost(divisionName)	                            Get the cost to hire AdVert.
// hireAdVert(divisionName)	                                    Hire AdVert.

// hasResearched(divisionName, researchName)	                Gets if you have unlocked a research
// getResearchCost(divisionName, researchName)	                Get the cost to unlock research
// research(divisionName, researchName)	                        Purchase a research

// throwParty(divisionName, city, costPerEmployee)	            Throw a party for your employees
// buyTea(divisionName, city)	                                Buy tea for your employees

//===========================================================================================================================================================

// WAREHOUSE
// hasWarehouse(divisionName, city)	                                                            Check if you have a warehouse in city
// getWarehouse(divisionName, city)	                                                            Get warehouse data
// purchaseWarehouse(divisionName, city)	                                                    Purchase warehouse for a new city
// upgradeWarehouse(divisionName, city, amt)	                                                Upgrade warehouse
// getUpgradeWarehouseCost(divisionName, city, amt)	                                            Gets the cost to upgrade a warehouse to the next level

// setSmartSupply(divisionName, city, enabled)	                                                Set smart supply
// setSmartSupplyOption(divisionName, city, materialName, option)	                            Set whether smart supply uses leftovers before buying

// sellMaterial(divisionName, city, materialName, amt, price)	                                Set material sell data.
// sellProduct(divisionName, city, productName, amt, price, all)	                            Set product sell data.

// getMaterial(divisionName, city, materialName)	                                            Get material data
// buyMaterial(divisionName, city, materialName, amt)	                                        Set material buy data
// bulkPurchase(divisionName, city, materialName, amt)	                                        Set material to bulk buy
// exportMaterial(sourceDivision, sourceCity, targetDivision, targetCity, materialName, amt)	Set material export data

// cancelExportMaterial(sourceDivision, sourceCity, targetDivision, targetCity, materialName)	Cancel material export
// discontinueProduct(divisionName, productName)	                                            Discontinue a product.
// getProduct(divisionName, cityName, productName)	                                            Get product data
// limitMaterialProduction(divisionName, city, materialName, qty)	                            Limit Material Production.
// limitProductProduction(divisionName, city, productName, qty)	                                Limit Product Production.
// makeProduct(divisionName, city, productName, designInvest, marketingInvest)	                Create a new product
// setMaterialMarketTA1(divisionName, city, materialName, on)	                                Set market TA 1 for a material.
// setMaterialMarketTA2(divisionName, city, materialName, on)	                                Set market TA 2 for a material.
// setProductMarketTA1(divisionName, productName, on)	                                        * Set market TA 1 for a product.
// setProductMarketTA2(divisionName, productName, on)	                                        Set market TA 2 for a product.



/** The Complete Handbook for Creating a Successful Corporation
 * 
 * Getting Started with Corporations
 * To get started, visit the City Hall in Sector-12 in order to create a Corporation. 
 * This requires $150b of your own money, but this $150b will get put into your Corporation's funds. 
 * If you're in BitNode 3 you also have option to get seed money from the government in exchange for 500m shares. 
 * Your Corporation can have many different divisions, each in a different Industry. 
 * There are many different types of Industries, each with different properties. 
 * To create your first division, click the 'Expand' (into new Industry) button at the top of the management UI. 
 * The Agriculture industry is recommended for your first division.
 * 
 * The first thing you'll need to do is hire some employees. 
 * Employees can be assigned to five different positions. 
 * Each position has a different effect on various aspects of your Corporation. It is recommended to have at least one employee at each position.
 * 
 * Each industry uses some combination of Materials in order to produce other Materials and/or create Products. 
 * Specific information about this is displayed in each of your divisions' UI.
 * Products are special, industry-specific objects. 
 * They are different than Materials because you must manually choose to develop them, and you can choose to develop any number of Products. 
 * Developing a Product takes time, but a Product typically generates significantly more revenue than any Material. 
 * Not all industries allow you to create Products. 
 * To create a Product, look for a button in the top-left panel of the division UI (e.g. For the Software Industry, the button says 'Develop Software').
 * 
 * To get your supply chain system started, purchase the Materials that your industry needs to produce other Materials/Products. 
 * This can be done by clicking the 'Buy' button next to the corresponding Material(s). 
 * After you have the required Materials, you will immediately start production. 
 * The amount and quality/effective rating of Materials/Products you produce is based on a variety of factors, such as your employees and their productivity and the quality of materials used for production.
 * 
 * Once you start producing Materials/Products, you can sell them in order to start earning revenue. 
 * This can be done by clicking the 'Sell' button next to the corresponding Material or Product. 
 * The amount of Material/Product you sell is dependent on a wide variety of different factors. 
 * In order to produce and sell a Product you'll have to fully develop it first.
 * 
 * These are the basics of getting your Corporation up and running! Now, you can start purchasing upgrades to improve your bottom line. 
 * If you need money, consider looking for seed investors, who will give you money in exchange for stock shares. 
 * Otherwise, once you feel you are ready, take your Corporation public! 
 * Once your Corporation goes public, you can no longer find investors. 
 * Instead, your Corporation will be publicly traded and its stock price will change based on how well it's performing financially. 
 * In order to make money for yourself you can set dividends for a solid reliable income or you can sell your stock shares in order to make quick money.
 * 
 * Tips/Pointers
 * -Start with one division, such as Agriculture. Get it profitable on it's own, then expand to a division that consumes/produces a material that the division you selected produces/consumes.
 * -Materials are profitable, but Products are where the real money is, although if the product had a low development budget or is produced with low quality materials it won't sell well.
 * -The 'Smart Supply' upgrade is extremely useful. Consider purchasing it as soon as possible.
 * -Purchasing Hardware, Robots, AI Cores, and Real Estate can potentially increase your production. The effects of these depend on what industry you are in.
 * -In order to optimize your production, you will need a good balance of all employee positions, about 1/9 should be interning
 * -Quality of materials used for production affects the quality/effective rating of materials/products produced, so vertical integration is important for high profits.
 * -Materials purchased from the open market are always of quality 1.
 * -The price at which you can sell your Materials/Products is highly affected by the quality/effective rating
 * -When developing a product, different employee positions affect the development process differently, some improve the development speed, some improve the rating of the finished product.
 * -If your employees have low morale or energy, their production will greatly suffer. Having enough interns will make sure those stats get high and stay high.
 * -Don't forget to advertise your company. You won't have any business if nobody knows you.
 * -Having company awareness is great, but what's really important is your company's popularity. Try to keep your popularity as high as possible to see the biggest benefit for your sales
 * -Remember, you need to spend money to make money!
 * -Corporations do not reset when installing Augmentations, but they do reset when destroying a BitNode
 * 
 * NOTES: 
 * buy corporation 
 * start argiculture, get 6 divisions running, export real estate from cheap 
 * 
 * 
*/