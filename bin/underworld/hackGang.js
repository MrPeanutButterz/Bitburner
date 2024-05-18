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
     * create a gang
    */

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA
    const API = ns.gang
    const TASK_WANTED = "Ethical Hacking"
    const ASCEND_THRESHOLD = 1.025
    const WANTED_LOWERBAND = 1
    const WANTED_UPPERBAND = 10

    const AUGMENTATIONS = [
        "BitWire",
        "Neuralstimulator",
        "DataJack"
    ]

    const ROOTKITS = [
        "NUKE Rootkit",
        "Soulstealer Rootkit",
        "Demon Rootkit",
        "Hmap Node",
        "Jack the Ripper"
    ]

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
                list.push({ name: member, ascend: (API.getAscensionResult(member).hack * API.getInstallResult(member).hack).toFixed(5) })
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

        if (API.getMemberNames().lenght < 12) {

            if (API.canRecruitMember()) {
                for (var i = 0; i < API.getRecruitsAvailable(); i++) {
                    let name = createMemberName()
                    API.recruitMember(name)
                    API.setMemberTask(name, TASK_WANTED)
                }
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

    //\\ LOGIC
    while (!API.inGang()) {

        await ns.sleep(1000)
        if (API.createGang("NiteSec")) {
            ns.tprint("Hackgang created at NiteSec")
        }
    }

    while (true) {

        ns.clearLog()
        display()
        await API.nextUpdate()

        if (API.getBonusTime() > 5000 && API.getMemberNames().length < 11) {

            recruitMembers()
            memberTaskBonus()

        } else {

            recruitMembers()
            memberTask()
            ascendMembers()
        }
    }
}
