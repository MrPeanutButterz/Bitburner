/** @param {NS} ns */
export function scriptStart(ns) {
    ns.tprint("Init")
    ns.disableLog("ALL")
    ns.clearLog()
}

/** @param {NS} ns */
export function scriptExit(ns) {
    ns.tprint("Exit")
    ns.closeTail()
    ns.exit()
}

/** @param {NS} ns */
export function scriptPath(ns) {

    // returns path to any script used in operation (string array)

    const genesis = "/bin/genesis/"
    const singularity = "/bin/singularity/"
    return {

        system: "system.js",

        // genesis
        collectStage1: genesis + "collectStage1.js",
        collectStage2: genesis + "collectStage2.js",
        collectStage3: genesis + "collectStage3.js",
        hacknet: genesis + "hacknet.js",
        grow: genesis + "pck_grow.js",
        weak: genesis + "pck_weak.js",
        hack: genesis + "pck_hack.js",
        servers: genesis + "servers.js",
        share: genesis + "share.js",
        sharePower: genesis + "sharePower.js",
        gw: genesis + "sqn_gw.js",
        w: genesis + "sqn_w.js",
        stockmarket: genesis + "stockMarket.js",

        // singularity
        company: singularity + "company.js",
        core: singularity + "core.js",
        crime: singularity + "crime.js",
        faction: singularity + "faction.js",
        gym: singularity + "gym.js",
        install: singularity + "install.js",
        programs: singularity + "programs.js",
        ram: singularity + "ram.js",
        reputation: singularity + "reputation.js",
        requirement: singularity + "requirement.js",
        school: singularity + "school.js",

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