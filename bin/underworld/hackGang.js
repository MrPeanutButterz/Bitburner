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
    * ✅ management > reqruite new members
    * ✅ management > set task main | bonus time | based on script running
    * ✅ management > ascend members if not in bonus time
    * ✅ equipment > buy augmentations for hacking
    * ✅ equipment > buy rootkits for hacking
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
