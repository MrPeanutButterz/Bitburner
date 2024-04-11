/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ GENERAL DATA
    const TRAVEL_COST = 2e5
    const GYM_lOCATION = ns.enums.CityName.Sector12
    const STATS = { str: ns.args[0], def: ns.args[1], agi: ns.args[2], dex: ns.args[3] }

    //\\ FUNCTIONS 
    //\\ MAIN LOGIC
    while (true) {

        await ns.sleep(500)
        ns.clearLog()

        let city = ns.getPlayer().city
        let skill = ns.getPlayer().skills
        let work = ns.singularity.getCurrentWork()
        let money = ns.getServerMoneyAvailable("home")

        if (city !== GYM_lOCATION && money > TRAVEL_COST) {

            ns.print("Traveling to " + GYM_lOCATION)
            ns.singularity.travelToCity(GYM_lOCATION)

        } else if (ns.singularity.isBusy()) {

            if (work.type === "CREATE_PROGRAM") {

                ns.print("Working on " + work.programName)
                await ns.sleep(1000)

            } else if (work.type === "FACTION") {

                ns.print("Working at " + work.factionName)
                await ns.sleep(1000)

            } else if (work.type === "CLASS") {

                ns.print("Working out at the gym")
                ns.print("Strenght \t" + skill.strength + " / " + STATS.str)
                ns.print("Defence \t" + skill.defense + " / " + STATS.def)
                ns.print("Dexterity \t" + skill.dexterity + " / " + STATS.dex)
                ns.print("agility \t" + skill.agility + " / " + STATS.agi)

                if (skill.strength >= STATS.str && work.classType === "str") {

                    ns.singularity.stopAction()

                } else if (skill.defense >= STATS.def && work.classType === "def") {

                    ns.singularity.stopAction()

                } else if (skill.dexterity >= STATS.dex && work.classType === "dex") {

                    ns.singularity.stopAction()

                } else if (skill.agility >= STATS.agi && work.classType === "agi") {

                    ns.singularity.stopAction()

                }
            }

        } else {

            if (skill.strength < STATS.str) {

                ns.singularity.gymWorkout("Iron Gym", ns.enums.GymType.strength, false)

            } else if (skill.defense < STATS.def) {

                ns.singularity.gymWorkout("Iron Gym", ns.enums.GymType.defense, false)

            } else if (skill.dexterity < STATS.dex) {

                ns.singularity.gymWorkout("Iron Gym", ns.enums.GymType.dexterity, false)

            } else if (skill.agility < STATS.agi) {

                ns.singularity.gymWorkout("Iron Gym", ns.enums.GymType.agility, false)

            } else if (
                skill.strength >= STATS.str && skill.defense >= STATS.def &&
                skill.dexterity >= STATS.dex && skill.agility >= STATS.agi) {
                ns.exit()
            }
        }
    }
}
