import { scriptStart } from "/lib/scripting"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA
    const API = ns.gang
    const TASK_WANTED = "Ethical Hacking"
    const ASCEND_THRESHOLD = 1.025
    const WANTED_LOWERBAND = 1
    const WANTED_UPPERBAND = 10

    const AUGMENTATIONS = ["BitWire", "Neuralstimulator", "DataJack"]
    const ROOTKITS = ["NUKE Rootkit", "Soulstealer Rootkit", "Demon Rootkit", "Hmap Node", "Jack the Ripper"]

    let memberNum = 0

    //\\ FUNCTIONS 
    function display() {

        let info = API.getGangInformation()
        ns.print("Faction \t" + info.faction)
        ns.print("Money gain \t" + ns.formatNumber(info.moneyGainRate * API.getMemberNames().length))
        ns.print("Respect \t" + Math.round(info.respect))
        ns.print("Wanted lvl \t" + info.wantedLevel.toFixed(3))
        displayAscendMembers()
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
                API.setMemberTask(name, TASK_WANTED)
            }
        }
    }

    function getTask(member) {

        let hackLevel = API.getMemberInformation(member).hack
        switch (true) {
            case hackLevel > 2000: return "Money Laundering"
            case hackLevel > 1500: return "Fraud & Counterfeiting"
            case hackLevel > 1000: return "Identity Theft"
            case hackLevel > 500: return "Phishing"
            default: return "Ransomware"
        }
    }

    function assignTaskMain() {
        API.getMemberNames().forEach(member => {
            API.setMemberTask(member, getTask(member))
        })
    }

    function assignTaskWanted() {
        API.getMemberNames().forEach(member => {
            API.setMemberTask(member, TASK_WANTED)
        })
    }

    function memberTask() {

        // set member task 

        if (API.getGangInformation().wantedLevel === WANTED_LOWERBAND) {

            assignTaskMain()

        } else if (API.getGangInformation().wantedLevel > WANTED_UPPERBAND) {

            assignTaskWanted()
        }
    }

    function getTaskBonus(member) {

        let hackLevel = API.getMemberInformation(member).hack
        switch (true) {
            case hackLevel > 1200: return "Cyberterrorism"
            case hackLevel > 700: return "Plant Virus"
            default: return "DDoS Attacks"
        }
    }

    function assignTaskMainBonus() {

        // assign main task for every member

        API.getMemberNames().forEach(member => {
            API.setMemberTask(member, getTaskBonus(member))
        })
    }

    function memberTaskBonus() {

        // set member task 

        if (API.getGangInformation().wantedLevel === WANTED_LOWERBAND) {

            assignTaskMainBonus()

        } else if (API.getGangInformation().wantedLevel > WANTED_UPPERBAND) {

            assignTaskWanted()
        }
    }

    function getAugmentation(member) {

        // buy augmentations for members

        AUGMENTATIONS.forEach(a => {
            if (!API.getMemberInformation(member).augmentations.includes(a)) {
                if (ns.getServerMoneyAvailable("home") > API.getEquipmentCost(a)) {

                    API.purchaseEquipment(a)
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

    //\\ LOGIC
    while (true) {

        ns.clearLog()
        display()
        await API.nextUpdate()

        if (API.getBonusTime() > 5000 &&
            API.getMemberNames().lenght < 11) {

            recruitMembers()
            memberTaskBonus()

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
