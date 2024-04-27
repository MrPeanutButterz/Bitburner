import { installBackdoor } from "/lib/network"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ GENERAL DATA
    // const SCRIPT = scriptPath(ns)
    const API = ns.gang

    //\\ FUNCTIONS 
    //\\ LOGIC
    while (true) {

        await API.nextUpdate()
        ns.clearLog()

        if (!API.inGang()) {

            // get a gang started
            if (API.createGang("NiteSec")) {

                ns.print("Gang created")

            } else {

                ns.print("Unable to create gang")
                await installBackdoor(ns, "avmnite-02h")
            }

        } else {

            // run gang

            ns.print(API.getGangInformation())



        }
    }
}

// nextUpdate()	                                Sleeps until the next Gang update has happened.

// inGang()	                                    Check if you're in a gang.
// createGang(faction)	                        Create a gang.
// getGangInformation()	                        Get information about your gang.
// getBonusTime()	                            Get bonus time.

// getRecruitsAvailable()	                    Check how many gang members you can currently recruit.
// canRecruitMember()	                        Check if you can recruit a new gang member.
// recruitMember(name)	                        Recruit a new gang member.
// renameMember(memberName, newName)	        Rename a Gang member to a new unique name.
// respectForNextRecruit()	                    Check the amount of Respect needed for your next gang recruit.
// getMemberNames()	                            List all gang members.
// getMemberInformation(name)	                Get information about a specific gang member.
// getAscensionResult(memberName)	            Get the result of an ascension without ascending.
// getInstallResult(memberName)	                Get the effect of an install on ascension multipliers without installing.
// ascendMember(memberName)	                    Ascend a gang member.

// getEquipmentNames()	                        List equipment names.
// getEquipmentStats(equipName)	                Get stats of an equipment.
// getEquipmentType(equipName)	                Get type of an equipment.
// getEquipmentCost(equipName)	                Get cost of equipment.

// getTaskNames()	                            List member task names.
// getTaskStats(name)	                        Get stats of a task.
// setMemberTask(memberName, taskName)          Set gang member to task.
// purchaseEquipment(memberName, equipName)	    Purchase an equipment for a gang member.

// getOtherGangInformation()	                Get information about the other gangs.
// setTerritoryWarfare(engage)	                Enable/Disable territory clashes.
// getChanceToWinClash(gangName)	            Get chance to win clash with other gang.


// Certain Factions (Slum Snakes, Tetrads, The Syndicate, The Dark Army, Speakers for the Dead, NiteSec, The Black Hand)
// give the player the ability to form and manage their own gang, which can earn the player money and reputation with the corresponding Faction.
// Gangs offer more Augmentations than Factions, and in BitNode-2 offer a way to destroy the BitNode.
