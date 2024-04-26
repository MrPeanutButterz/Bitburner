import { scriptStart, scriptPath } from "lib/scripting"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    scriptStart(ns)
    ns.tail()

    //\\ GENERAL DATA
    const SCRIPT = scriptPath(ns)

    //\\ FUNCTIONS 
    function runOffice() {

    }

    //\\ LOGIC
    while (true) {
        await ns.corporation.nextUpdate()
        runOffice()
    }
}

// buyTea(divisionName, city)	                                Buy tea for your employees
// getHireAdVertCost(divisionName)	                            Get the cost to hire AdVert.
// getHireAdVertCount(divisionName)	                            Get the number of times you have hired AdVert.
// getOffice(divisionName, city)	                            Get data about an office
// getOfficeSizeUpgradeCost(divisionName, city, size)	        Cost to Upgrade office size.
// getResearchCost(divisionName, researchName)	                Get the cost to unlock research
// hasResearched(divisionName, researchName)	                Gets if you have unlocked a research
// hireAdVert(divisionName)	                                    Hire AdVert.
// hireEmployee(divisionName, city, employeePosition)	        Hire an employee.
// research(divisionName, researchName)	                        Purchase a research
// setAutoJobAssignment(divisionName, city, job, amount)	    Set the auto job assignment for a job
// throwParty(divisionName, city, costPerEmployee)	            Throw a party for your employees
// upgradeOfficeSize(divisionName, city, size)                  Upgrade office size.