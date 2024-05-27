import { scriptPath, scriptStart } from "/lib/settings"
import { NmapTotalRam } from "/lib/network"

/** @param {NS} ns */
export async function main(ns) {

    /** _                _           
     * | |    ___   __ _(_) ___ __ _ 
     * | |   / _ \ / _` | |/ __/ _` |
     * | |__| (_) | (_| | | (_| (_| |
     * |_____\___/ \__, |_|\___\__,_|
     *              |___/             
     * 
     * ✅ create gang
     * 
     * ✅ management > recruite gang members
     * ✅ management > set task
     * ✅ management > ascend members
     * 
     * equipment > buy augmentations
     * 
     * ✅ territory > set clash
    */

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA
    const SCRIPT = scriptPath(ns)
    const API = ns.gang

    const ASCEND_THRESHOLD = 3.4
    const WANTED_LOWERBAND = 1
    const WANTED_UPPERBAND = 10

    let LOWER_WANTED_LEVEL = false

    const AUGMENTATIONS = []

    let memberNum = 0

    //\\ FUNCTIONS 
    async function createGang() {

        // create gang

        while (!API.inGang()) {

            await ns.sleep(1000)
            API.createGang("Slum Snakes")
        }
    }

    function displayInfo() {
        let info = API.getGangInformation()
        ns.print("Faction \t" + info.faction)
        ns.print("Money gain \t" + ns.formatNumber(info.moneyGainRate * API.getMemberNames().length))
        ns.print("Respect \t" + Math.round(info.respect))
        ns.print("Wanted lvl \t" + info.wantedLevel.toFixed(3))
        ns.print("Warefare \t" + info.territoryWarfareEngaged)
        ns.print("Territory \t" + ns.formatPercent(info.territory))
        ns.print("Territory \t" + info.territory)
        displayClash()
        displayAscendMembers()
    }

    function displayClash() {

        let data = []
        const gangs = ["Tetrads", "The Syndicate", "The Dark Army", "Speakers for the Dead", "NiteSec", "The Black Hand"]

        gangs.forEach(gang => {
            data.push({ chance: API.getChanceToWinClash(gang), gangName: gang })
        })

        data.sort((a, b) => a.chance - b.chance).reverse()
        ns.print("\nClash Chance")
        data.forEach(e => { ns.print(ns.formatPercent(e.chance) + "\t\t" + e.gangName) })
    }

    function displayAscendMembers() {

        // display ascend members 

        let list = []
        for (let member of API.getMemberNames()) {
            if (API.getInstallResult(member)) {

                let ascentRes = API.getAscensionResult(member).str +
                    API.getAscensionResult(member).def +
                    API.getAscensionResult(member).dex +
                    API.getAscensionResult(member).agi / 4

                list.push({ name: member, ascend: ascentRes.toFixed(4) })
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
                API.setMemberTask(name, "Train Combat")
            }
        }
    }

    function calculateMemberLevel(member) {

        let str = API.getMemberInformation(member).str
        let def = API.getMemberInformation(member).def
        let dex = API.getMemberInformation(member).dex
        let agi = API.getMemberInformation(member).agi

        return str + def + dex + agi
    }

    function allMembersInWarfare() {

        let allInWarefare = true
        let members = API.getMemberNames()

        members.forEach(member => {
            if (calculateMemberLevel(member) < 10000) {
                allInWarefare = false
            }
        })
        return allInWarefare
    }

    function getTask(member) {

        let level
        if (NmapTotalRam(ns) < 7500 || ns.getRunningScript(SCRIPT.install)) {

            API.setTerritoryWarfare(false)
            level = calculateMemberLevel(member)

            switch (true) {
                case level > 5000: return "Human Trafficking"
                case level > 4000: return "Threaten & Blackmail"
                case level > 3000: return "Traffic Illegal Arms"
                case level > 2000: return "Armed Robbery"
                case level > 1500: return "Run a Con"
                case level > 1000: return "Strongarm Civilians"
                default: return "Train Combat"
            }

        } else {

            if (allMembersInWarfare() && API.getGangInformation().territory < 1) {

                API.setTerritoryWarfare(true)
                return "Territory Warfare"

            } else if (API.getGangInformation().territory === 1) {

                API.setTerritoryWarfare(false)
                level = calculateMemberLevel(member)

                switch (true) {
                    case level > 10000: return "Human Trafficking"
                    case level <= 10000: return "Train Combat"
                    default: return "Train Combat"
                }

            } else {

                API.setTerritoryWarfare(false)
                return "Train Combat"
            }
        }
    }

    function memberTask() {

        // set member task 

        if (API.getGangInformation().wantedLevel === WANTED_LOWERBAND) {

            LOWER_WANTED_LEVEL = false

        } else if (API.getGangInformation().wantedLevel > WANTED_UPPERBAND) {

            LOWER_WANTED_LEVEL = true
        }


        if (!LOWER_WANTED_LEVEL) {

            API.getMemberNames().forEach(member => {
                API.setMemberTask(member, getTask(member))
            })

        } else {

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

                let instRes = API.getInstallResult(member).str +
                    API.getInstallResult(member).def +
                    API.getInstallResult(member).dex +
                    API.getInstallResult(member).agi

                let ascentRes = API.getAscensionResult(member).str +
                    API.getAscensionResult(member).def +
                    API.getAscensionResult(member).dex +
                    API.getAscensionResult(member).agi / 4


                if (ascentRes >= ASCEND_THRESHOLD) {
                    API.ascendMember(member)
                    getAugmentation(member)
                }
            }
        }
    }


    //\\ LOGIC
    await createGang()
    while (true) {

        await API.nextUpdate()
        ns.clearLog()
        displayInfo()

        if (API.getBonusTime() > 5000 && API.getMemberNames().length < 12) {

            recruitMembers()
            memberTask()

        } else {

            recruitMembers()
            memberTask()
            ascendMembers()
        }
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
