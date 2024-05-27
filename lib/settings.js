/** @param {NS} ns */
export function scriptStart(ns, test) {

    if (test === undefined || test === false) {
        ns.tprint("Init")
        ns.disableLog("ALL")
        ns.clearLog()

    } else {
        ns.disableLog("ALL")
        ns.clearLog()
        ns.tail()
    }
}

/** @param {NS} ns */
export function scriptExit(ns) {
    ns.tprint("Exit")
    ns.closeTail()
    ns.exit()
}

/** @param {NS} ns */
export function settings(ns) {

    return {
        gang: false,
        killBitnode: true,
    }
}

/////////////////////////////////////////////////////////////////////////////////////

/** @param {NS} ns */
export function scriptPath(ns) {

    // returns path to any script used in operation (string array)

    const genesis = "/bin/genesis/"
    const underworld = "/bin/underworld/"
    const singularity = "/bin/singularity/"
    const corporation = "/bin/corporation/"
    const hacktocracy = "/bin/hacktocracy/"

    return {

        system: "system.js",
        interface: "utils/interface.js",

        // genesis
        collect: genesis + "collect.js",
        hacknet: genesis + "hacknet.js",
        grow: genesis + "pck_grow.js",
        weak: genesis + "pck_weak.js",
        hack: genesis + "pck_hack.js",
        servers: genesis + "servers.js",
        share: genesis + "share.js",
        sharePower: genesis + "sharePower.js",
        stockmarket: genesis + "stockMarket.js",

        // underworld
        hackGang: underworld + "hackGang.js",
        combatGang: underworld + "combatGang.js",

        // singularity
        company: singularity + "company.js",
        core: singularity + "core.js",
        crime: singularity + "crime.js",
        faction: singularity + "faction.js",
        gangs: singularity + "gangs.js",
        gym: singularity + "gym.js",
        install: singularity + "install.js",
        killBN: singularity + "killBN.js",
        neuroflux: singularity + "neuroflux.js",
        programs: singularity + "programs.js",
        ram: singularity + "ram.js",
        reputation: singularity + "reputation.js",
        requirement: singularity + "requirement.js",
        school: singularity + "school.js",

        // corporation
        corporation: corporation + "corporation.js",
        bigCorp: corporation + "bigCorp.js",
        smallCorp: corporation + "smallCorp.js",

        // hacktocracy
        hashnet: hacktocracy + "hashnet.js",

    }
}

/** @param {NS} ns */
export function colorPrint(ns, color, msg) {

    // print text in colors

    const colors = {
        black: "\u001b[30m",
        white: "\u001b[37m",
        green: "\u001b[32m",
        cyan: "\u001b[36m",
        blue: "\u001b[34m",
        magenta: "\u001b[35m",
        yellow: "\u001b[33m",
        red: "\u001b[31m",
        brightBlack: "\u001b[30;1m",
        brightRed: "\u001b[31;1m",
        brightGreen: "\u001b[32;1m",
        brightYellow: "\u001b[33;1m",
        brightBlue: "\u001b[34;1m",
        brightMagenta: "\u001b[35;1m",
        brightCyan: "\u001b[36;1m",
        brightWhite: "\u001b[37;1m",
        reset: "\u001b[0m"
    }

    ns.print(`${colors[color]}` + msg);
}