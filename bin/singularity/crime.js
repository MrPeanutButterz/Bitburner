/** @param {NS} ns */
export async function main(ns) {

    // make list of crimes 
    // sort on chance
    // sort chance to max profit 
    // commit crime 

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ GENERAL DATA
    const CRIMECHANCE = 0.8

    const crimeTypes = [
        "Shoplift",
        "Rob Store",
        "Mug",
        "Larceny",
        "Deal Drugs",
        "Bond Forgery",
        "Traffick Arms",
        "Homicide",
        "Grand Theft Auto",
        "Kidnap",
        "Assassination",
        "Heist"
    ]

    //\\ FUNCTIONS 
    function calculateProfitToMinute(crimeType) {

        let profit = 0
        let wages = ns.singularity.getCrimeStats(crimeType).money
        let time = ns.singularity.getCrimeStats(crimeType).time

        if (time < 60_000) {
            profit = (60000 / time) * wages

        } else if (time === 60_000) {
            profit = wages

        } else {
            profit = (time / 60000) * wages
        }

        return Math.round(profit)

    }

    //\\ MAIN LOGIC
    for (let i = 0; i < crimeTypes.length; i++) {


        ns.print(crimeTypes[i])
        ns.print("Chance " + Math.round(ns.singularity.getCrimeChance(crimeTypes[i]) * 100))
        ns.print("Profit " + calculateProfitToMinute(crimeTypes[i]))
        ns.print("-- ")
    }

}
// getCrimeStats(crime)	Get stats related to a crime.
// getCrimeChance(crime)	Get chance to successfully commit a crime.
// commitCrime(crime, focus)	Commit a crime.
// getCurrentWork()	Get the current work the player is doing.
// hospitalize()	Hospitalize the player.
// isBusy()	Check if the player is busy.
// isFocused()	Check if the player is focused.
// setFocus(focus)	Set the players focus.
// stopAction()	Stop the current action.