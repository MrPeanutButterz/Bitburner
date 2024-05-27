import { scriptPath, scriptStart } from "/lib/settings"
import { NmapTotalRam, canRunOnHome } from "/lib/network"

/** @param {NS} ns */
export async function main(ns) {

    /**
    *   ____                       
    *  / ___| __ _ _ __   __ _ ___ 
    * | |  _ / _` | '_ \ / _` / __|
    * | |_| | (_| | | | | (_| \__ \
    *  \____|\__,_|_| |_|\__, |___/
    *                    |___/    
    *  
    * ✅ create a gang
    * 
    * ✅ management > reqruite new members
    * ✅ management > set task main | bonus time | based on script running
    * ✅ management > ascend members if not in bonus time
    * 
    * ✅ equipment > buy augmentations for hacking
    * ✅ equipment > buy rootkits for hacking
    * 
    * ✅ territory > disengage territory clash
    */

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA
    const API = ns.gang
    const SCRIPT = scriptPath(ns)
    const THRESHOLD_ASCEND_MEMBER = 1.025

    let MEMBER_ID = 0
    let WANTED_LOWERBAND = 1
    let WANTED_UPPERBAND = 10
    let DEESCALATE_WANTED_LEVEL = false

    const ROOTKITS = [
        "NUKE Rootkit",
        "Soulstealer Rootkit",
        "Demon Rootkit",
        "Hmap Node",
        "Jack the Ripper"
    ], AUGMENTATIONS = [
        "BitWire",
        "DataJack",
        "Neuralstimulator",
    ]

    //\\ FUNCTIONS 
    async function createGang() {

        // create gang
        while (!API.inGang()) {

            await ns.sleep(1000)
            ns.clearLog()

            if (ns.getPlayer().karma > -54000) {

                ns.print("Karma is to high, commiting some crime")

                if (canRunOnHome(ns, SCRIPT.crime)) {
                    ns.run(SCRIPT.crime, {threads: 1}, 0, -54000)
                }

            } else {

                if (API.createGang("NiteSec")) {
                    ns.tprint("Hackgang created at NiteSec")
                }
            }
        }
    }

    function info() {

        // print info to console 
        let info = API.getGangInformation()
        ns.print("Faction \t" + info.faction)
        ns.print("Bonus time \t" + isBonusTime())
        ns.print("Money gain \t" + ns.formatNumber(info.moneyGainRate))
        ns.print("Respect \t" + ns.formatNumber(info.respect))
        ns.print("Wanted lvl \t" + info.wantedLevel.toFixed(3))
    }

    function createMemberName() {

        // create member names 
        let gangMemberNames = API.getMemberNames()
        for (let name of gangMemberNames) {

            let number = name.split("-")[1]
            if (number >= MEMBER_ID) {
                MEMBER_ID = number
            }
        }
        MEMBER_ID++
        return `Member-${MEMBER_ID}`
    }

    function recruitMembers() {

        // require a member en set to work asap

        if (API.canRecruitMember()) {
            for (var i = 0; i < API.getRecruitsAvailable(); i++) {
                let name = createMemberName()
                API.recruitMember(name)
                API.setMemberTask(name, "Train Hacking")
            }
        }
    }

    function getMainTask(member) {

        // @return member task
        let hackLevel = API.getMemberInformation(member).hack

        switch (true) {
            case hackLevel > 3000: return "Money Laundering"
            case hackLevel > 2000: return "Fraud & Counterfeiting"
            case hackLevel > 1500: return "Identity Theft"
            // case hackLevel > 1500: return "Phishing"
            // case hackLevel > 1500: return "Ransomware"
            default: return "Train Hacking"
        }
    }

    function getBonusTask(member) {

        // @return member task in bonus time to build respect fast
        let hackLevel = API.getMemberInformation(member).hack

        switch (true) {
            case hackLevel > 3000: return "Cyberterrorism"
            case hackLevel > 2000: return "Plant Virus"
            case hackLevel > 1500: return "DDoS Attacks"
            default: return "Train Hacking"
        }
    }

    function isBonusTime() {
        return API.getBonusTime() > 0
    }

    function setMainTask() {
        API.getMemberNames().forEach(member => {
            API.setMemberTask(member, getMainTask(member))
        })
    }

    function setBonusTask() {
        API.getMemberNames().forEach(member => {
            API.setMemberTask(member, getBonusTask(member))
        })
    }

    function setWantedTask() {
        API.getMemberNames().forEach(member => {
            API.setMemberTask(member, "Ethical Hacking")
        })
    }

    function setTrainTask() {
        API.getMemberNames().forEach(member => {
            API.setMemberTask(member, "Train Hacking")
        })
    }

    function setTaskMembers() {

        // decide fase based on wanted level
        if (API.getGangInformation().wantedLevel === WANTED_LOWERBAND) {
            DEESCALATE_WANTED_LEVEL = false

        } else if (API.getGangInformation().wantedLevel > WANTED_UPPERBAND) {
            DEESCALATE_WANTED_LEVEL = true
        }

        // set members to work
        if (!DEESCALATE_WANTED_LEVEL) {

            // pump money for purchase servers
            // pump money for augmentations
            // train some more
            // deescalate wanted level

            if (!isBonusTime()) {

                if (NmapTotalRam(ns) < 7500) {
                    setMainTask()

                } else if (!ns.getRunningScript(SCRIPT.servers)) {
                    setMainTask()

                } else if (ns.getRunningScript(SCRIPT.neuroflux)) {
                    setMainTask()

                } else {
                    API.getGangInformation().wantedLevel === WANTED_LOWERBAND ? setTrainTask() : setWantedTask()
                }

            } else {

                API.canRecruitMember() ? setBonusTask() : setMainTask()
            }

        } else {

            // de-escalate wanted level
            setWantedTask()
        }
    }

    function ascend() {
        for (let member of API.getMemberNames()) {

            // check if can ascend 
            if (API.getInstallResult(member)) {

                // log data 
                let ascendResult = API.getAscensionResult(member).hack * API.getInstallResult(member).hack
                // ns.print(member + "\t" + ascendResult.toFixed(5))

                // ascend member
                if (ascendResult >= THRESHOLD_ASCEND_MEMBER) { API.ascendMember(member) }
            }
        }
    }

    function ascendMembers() {

        // ascend members out of bonus time 
        if (API.getBonusTime() === 0) {
            ascend()
        }

        if (ns.getRunningScript(SCRIPT.install)) {
            ascend()
        }
    }

    function management() {

        // manage gang aspects
        recruitMembers()
        setTaskMembers()
        ascendMembers()
    }

    function getAugmentation() {

        // get augmentation

        if (!ns.getRunningScript(SCRIPT.install)) {
            API.getMemberNames().forEach(member => {

                let augmentations = API.getMemberInformation(member).augmentations
                AUGMENTATIONS.forEach(augmentation => {

                    if (!augmentations.includes(augmentation) &&
                        ns.getServerMoneyAvailable("home") > API.getEquipmentCost(augmentation)) {
                        API.purchaseEquipment(member, augmentation)
                    }
                })
            })
        }
    }

    function getRootKits() {

        // get rootkits
        API.getMemberNames().forEach(member => {

            let upgrades = API.getMemberInformation(member).upgrades
            ROOTKITS.forEach(upgrade => {

                if (!upgrades.includes(upgrade) &&
                    ns.getServerMoneyAvailable("home") > API.getEquipmentCost(upgrade)) {
                    API.purchaseEquipment(member, upgrade)
                }
            })
        })
    }

    function equipment() {

        // rootkits en augmentations only
        getAugmentation()

        if (ns.scriptRunning(SCRIPT.neuroflux, "home")) {
            getRootKits()
        }
    }

    function territory() {

        // no territory warfare 
        API.setTerritoryWarfare(false)
    }

    //\\ LOGIC
    await createGang()
    while (true) {

        await API.nextUpdate()
        ns.clearLog()

        info()
        management()
        equipment()
        territory()
    }
}

// inGang()	                                    Check if you're in a gang.
// createGang(faction)	                        Create a gang.
// nextUpdate()	                                Sleeps until the next Gang update has happened.

// getGangInformation()	                        Get information about your gang.
// getBonusTime()	                            Get bonus time.

// canRecruitMember()	                        Check if you can recruit a new gang member.
// getRecruitsAvailable()	                    Check how many gang members you can currently recruit.
// recruitMember(name)	                        Recruit a new gang member.
// renameMember(memberName, newName)	        Rename a Gang member to a new unique name.

// respectForNextRecruit()	                    Check the amount of Respect needed for your next gang recruit.
// getMemberNames()	                            List all gang members.
// getMemberInformation(name)	                Get information about a specific gang member.
// getInstallResult(memberName)	                Get the effect of an install on ascension multipliers without installing.
// getAscensionResult(memberName)	            Get the result of an ascension without ascending.
// ascendMember(memberName)	                    Ascend a gang member.

// getTaskNames()	                            List member task names.
// getTaskStats(name)	                        Get stats of a task.
// setMemberTask(memberName, taskName)          Set gang member to task.

// getEquipmentNames()	                        List equipment names.
// getEquipmentStats(equipName)	                Get stats of an equipment.
// getEquipmentType(equipName)	                Get type of an equipment.
// getEquipmentCost(equipName)	                Get cost of equipment.
// purchaseEquipment(memberName, equipName)	    Purchase an equipment for a gang member.

// getOtherGangInformation()	                Get information about the other gangs.
// getChanceToWinClash(gangName)	            Get chance to win clash with other gang.
// setTerritoryWarfare(engage)	                Enable/Disable territory clashes.

// getTaskStats(name)
//
// Train Hacking
// {"name":"Train Hacking","desc":"hacking skills","isHacking":true,"isCombat":true,
// "baseRespect":0,"baseWanted":0,"baseMoney":0,"hackWeight":100,"strWeight":0,"defWeight":0,"dexWeight":0,"agiWeight":0,"chaWeight":0,
// "difficulty":45,"territory":{"money":1,"respect":1,"wanted":1}}
//
// Ransomware
// {"name":"Ransomware","desc":"Earns money - Slightly increases respect - Slightly increases wanted level","isHacking":true,"isCombat":false,
// "baseRespect":0.00005,"baseWanted":0.0001,"baseMoney":3,"hackWeight":100,"strWeight":0,"defWeight":0,"dexWeight":0,"agiWeight":0,"chaWeight":0,
// "difficulty":1,"territory":{"money":1,"respect":1,"wanted":1}}
//
// Phishing
// {"name":"Phishing","desc":"Earns money - Slightly increases respect - Slightly increases wanted level","isHacking":true,"isCombat":false,
// "baseRespect":0.00008,"baseWanted":0.003,"baseMoney":7.5,"hackWeight":85,"strWeight":0,"defWeight":0,"dexWeight":0,"agiWeight":0,"chaWeight":15,
// "difficulty":3.5,"territory":{"money":1,"respect":1,"wanted":1}}
//
// Identity Theft
// {"name":"Identity Theft","desc":"Earns money - Increases respect - Increases wanted level","isHacking":true,"isCombat":false,
// "baseRespect":0.0001,"baseWanted":0.075,"baseMoney":18,"hackWeight":80,"strWeight":0,"defWeight":0,"dexWeight":0,"agiWeight":0,"chaWeight":20,
// "difficulty":5,"territory":{"money":1,"respect":1,"wanted":1}}
//
// Fraud & Counterfeiting
// {"name":"Fraud & Counterfeiting","desc":"Earns money - Slightly increases respect - Slightly increases wanted level","isHacking":true,"isCombat":false,
// "baseRespect":0.0004,"baseWanted":0.3,"baseMoney":45,"hackWeight":80,"strWeight":0,"defWeight":0,"dexWeight":0,"agiWeight":0,"chaWeight":20,
// "difficulty":20,"territory":{"money":1,"respect":1,"wanted":1}}
//
// Money Laundering
// {"name":"Money Laundering","desc":"Earns money - Increases respect - Increases wanted level","isHacking":true,"isCombat":false,
// "baseRespect":0.001,"baseWanted":1.25,"baseMoney":360,"hackWeight":75,"strWeight":0,"defWeight":0,"dexWeight":0,"agiWeight":0,"chaWeight":25,
// "difficulty":25,"territory":{"money":1,"respect":1,"wanted":1}}
//
//
// DDoS Attacks
// {"name":"DDoS Attacks","desc":"Increases respect - Increases wanted level","isHacking":true,"isCombat":false,
// "baseRespect":0.0004,"baseWanted":0.2,"baseMoney":0,"hackWeight":100,"strWeight":0,"defWeight":0,"dexWeight":0,"agiWeight":0,"chaWeight":0,
// "difficulty":8,"territory":{"money":1,"respect":1,"wanted":1}}
//
// Plant Virus
// {"name":"Plant Virus","desc":"Increases respect - Increases wanted level","isHacking":true,"isCombat":false,
// "baseRespect":0.0006,"baseWanted":0.4,"baseMoney":0,"hackWeight":100,"strWeight":0,"defWeight":0,"dexWeight":0,"agiWeight":0,"chaWeight":0,
// "difficulty":12,"territory":{"money":1,"respect":1,"wanted":1}}
//
// Cyberterrorism
// {"name":"Cyberterrorism","desc":"Greatly increases respect - Greatly increases wanted level","isHacking":true,"isCombat":false,
// "baseRespect":0.01,"baseWanted":6,"baseMoney":0,"hackWeight":80,"strWeight":0,"defWeight":0,"dexWeight":0,"agiWeight":0,"chaWeight":20,
// "difficulty":36,"territory":{"money":1,"respect":1,"wanted":1}}
//
// Ethical Hacking
// {"name":"Ethical Hacking","desc":"Earns money - Lowers wanted level","isHacking":true,"isCombat":false,
// "baseRespect":0,"baseWanted":-0.001,"baseMoney":3,"hackWeight":90,"strWeight":0,"defWeight":0,"dexWeight":0,"agiWeight":0,"chaWeight":10,
// "difficulty":1,"territory":{"money":1,"respect":1,"wanted":1}}

// getMemberInformation(name)
//
// {"name":"Member-3","task":"Ransomware","earnedRespect":691.1839986027653,"hack":1572,"str":1,"def":1,"dex":1,"agi":1,"cha":1,
// "hack_exp":23982.514255049944,"str_exp":0,"def_exp":0,"dex_exp":0,"agi_exp":0,"cha_exp":0.7333333333333333,
// "hack_mult":1,"str_mult":1,"def_mult":1,"dex_mult":1,"agi_mult":1,"cha_mult":1,
// "hack_asc_mult":12.741654058612314,"str_asc_mult":1,"def_asc_mult":1,"dex_asc_mult":1,"agi_asc_mult":1,"cha_asc_mult":1,
// "hack_asc_points":324699.4962987033,"str_asc_points":0,"def_asc_points":0,"dex_asc_points":0,"agi_asc_points":0,"cha_asc_points":0,
// "upgrades":[],"augmentations":[],"respectGain":0.17545760603908767,"wantedLevelGain":0.000003829057162623536,"moneyGain":831.1390818507537}
