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

    //\\ FUNCTIONS
    function logCorporation(corp) {

        // log corp status

        ns.print("Name\t\t" + corp.name)
        ns.print("Funds\t\t" + ns.formatNumber(corp.funds))
        ns.print("Revenue\t\t" + ns.formatNumber(corp.revenue))
        ns.print("Expense\t\t" + ns.formatNumber(corp.expenses))
        ns.print("DividendRate\t" + ns.formatPercent(corp.dividendRate))
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

    function handleProductionMult() {
        
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

            if (expandDivision(divisionData)) {
                // handleWarehouse(divisionData)
                // handleOffice(divisionData)
                // hireAdvert(divisionData.name)
                // handleProduct(divisionData.makesProducts, divisionData.products, divisionData.maxProducts, divisionData.name, divisionData.cities)
                handleProductionMult(divisionData.name, divisionData.cities)
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

    }

}
