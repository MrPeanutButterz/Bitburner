import { scriptStart } from "/lib/scripting"

/** @param {NS} ns */
export async function main(ns) {

    /** _                _           
     * | |    ___   __ _(_) ___ __ _ 
     * | |   / _ \ / _` | |/ __/ _` |
     * | |__| (_) | (_| | | (_| (_| |
     * |_____\___/ \__, |_|\___\__,_|
     *              |___/             
     * 
     * 
     * 
     * ✅ create gang
     * ✅ create gang > display current gang
     * 
     * ✅ management > recruite gang members
     * management > set task
     * management > ascend members
     * 
     * equipment > buy augmentations 
     * 
     * territory > set clash
    */

    //\\ SCRIPT SETTINGS
    scriptStart(ns)
    ns.tail()

    //\\ GENERAL DATA
    const API = ns.gang
    const TASK_MAIN = "Mug People"
    const ASCEND_THRESHOLD = 1.0250

    const WANTED_LOWERBAND = 1
    const WANTED_UPPERBAND = 10

    const AUGMENTATIONS = []

    let memberNum = 0

    //\\ FUNCTIONS 
    function createGang() {

        // create gang if not in one, or log gang
        if (!API.inGang()) {

            API.createGang("Slum Snakes")

        } else {

            let info = API.getGangInformation()
            ns.print("Faction \t" + info.faction)
            ns.print("Money gain \t" + ns.formatNumber(info.moneyGainRate * API.getMemberNames().length))
            ns.print("Respect \t" + Math.round(info.respect))
            ns.print("Wanted lvl \t" + info.wantedLevel.toFixed(3))
            displayAscendMembers()
        }
    }

    function displayAscendMembers() {

        // display ascend members 

        let list = []
        for (let member of API.getMemberNames()) {
            if (API.getInstallResult(member)) {
                list.push({ name: member, ascend: (API.getAscensionResult(member).hack * API.getInstallResult(member).hack).toFixed(4) })
            }
        }
        list.sort((a, b) => a.ascend - b.ascend).reverse()
        ns.print("\nMembers ascend @" + ASCEND_THRESHOLD)
        list.forEach(i => { ns.print(i.name + "\t" + i.ascend) })
    }

    function createMemberName() {

        // create member names 
        // find member.max() add one

        let gangMemberNames = API.getMemberNames()
        for (let name of gangMemberNames) {
            let number = name.split("-")[1]
            if (number >= memberNum) {
                memberNum = number
            }
        }

        memberNum++;
        return `Member-${memberNum}`
    }

    function recruitMembers() {

        // require a member en set to work asap

        if (API.canRecruitMember()) {
            for (var i = 0; i < API.getRecruitsAvailable(); i++) {
                let name = createMemberName()
                API.recruitMember(name)
                API.setMemberTask(name, "Vigilante Justice")
            }
        }
    }

    function getTask(member) {

        let str = API.getMemberInformation(member).str
        let def = API.getMemberInformation(member).def
        let dex = API.getMemberInformation(member).dex
        let agi = API.getMemberInformation(member).agi

        let level = str + def + dex + agi

        switch (true) {
            case level > 8000: return "Territory Warfare"
            case level > 6000: return "Terrorism"
            case level > 4000: return "Human Trafficking"
            case level > 2000: return "Traffick Illegal Arms"
            case level > 1000: return "Strongarn Civilians"
            case level > 500: return "Deal Drugs"
            default: return "Mug People"
        }
    }

    function memberTask() {

        // set member task 

        if (API.getGangInformation().wantedLevel === WANTED_LOWERBAND) {

            API.getMemberNames().forEach(member => {
                API.setMemberTask(member, getTask(member))
            })

        } else if (API.getGangInformation().wantedLevel > WANTED_UPPERBAND) {

            API.getMemberNames().forEach(member => {
                API.setMemberTask(member, "Vigilante Justice")
            })
        }
    }

    function getAugmentation(member) {

        // buy augmentations for members

        AUGMENTATIONS.forEach(a => {
            if (!API.getMemberInformation(member).augmentations.includes(a)) {
                if (ns.getServerMoneyAvailable("home") > API.getEquipmentCost(a)) {

                    API.purchaseEquipment(member, a)
                }
            }
        })
    }

    function ascendMembers() {

        // ascend members if posible

        for (let member of API.getMemberNames()) {
            if (API.getInstallResult(member)) {
                if (API.getAscensionResult(member).hack * API.getInstallResult(member).hack >= ASCEND_THRESHOLD) {
                    API.ascendMember(member)
                    getAugmentation(member)
                }
            }
        }
    }

    function management() {

        // manage gang

        recruitMembers()
        memberTask()
        // ascendMembers()
    }

    //\\ LOGIC
    while (true) {

        await API.nextUpdate()
        ns.clearLog()

        createGang()
        management()
    }
}

// hackging gangs is more straight forward
// combat gangs for teritory

// nextUpdate()	                                Sleeps until the next Gang update has happened.

// inGang()	                                    Check if you're in a gang.
// createGang(faction)	                        Create a gang.
// getGangInformation()	                        Get information about your gang.
// getBonusTime()	                            Get bonus time.

// canRecruitMember()	                        Check if you can recruit a new gang member.
// getRecruitsAvailable()	                    Check how many gang members you can currently recruit.
// recruitMember(name)	                        Recruit a new gang member.
// renameMember(memberName, newName)	        Rename a Gang member to a new unique name.

// respectForNextRecruit()	                    Check the amount of Respect needed for your next gang recruit.
// getMemberNames()	                            List all gang members.
// getMemberInformation(name)	                Get information about a specific gang member.
// getAscensionResult(memberName)	            Get the result of an ascension without ascending.
// ascendMember(memberName)	                    Ascend a gang member.
// getInstallResult(memberName)	                Get the effect of an install on ascension multipliers without installing.

// getTaskNames()	                            List member task names.
// getTaskStats(name)	                        Get stats of a task.
// setMemberTask(memberName, taskName)          Set gang member to task.

// getEquipmentNames()	                        List equipment names.
// getEquipmentStats(equipName)	                Get stats of an equipment.
// getEquipmentType(equipName)	                Get type of an equipment.
// getEquipmentCost(equipName)	                Get cost of equipment.
// purchaseEquipment(memberName, equipName)	    Purchase an equipment for a gang member.

// getOtherGangInformation()	                Get information about the other gangs.
// setTerritoryWarfare(engage)	                Enable/Disable territory clashes.
// getChanceToWinClash(gangName)	            Get chance to win clash with other gang.


// Certain Factions (Slum Snakes, Tetrads, The Syndicate, The Dark Army, Speakers for the Dead, NiteSec, The Black Hand)
// give the player the ability to form and manage their own gang, which can earn the player money and reputation with the corresponding Faction.
// Gangs offer more Augmentations than Factions, and in BitNode-2 offer a way to destroy the BitNode.
