/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz
Proces: configurations */

/** @param {NS} ns */
export function getSleepTime(ns) {
    const scriptSpeed = {

        //returns (number) different script speeds

        superFast: 50,
        fast: 200,
        average: 400,
        medium: 1000,
        slow: 2000,
        superSlow: 5000,

    }
    return scriptSpeed
}

/** @param {NS} ns */
export function getScriptsPath(ns) {

    //returns (string array) path to any script used in operation

    const path = {

        //GENESIS
        serverExploid: "/Genesis/serverExploid.js",
        serverWeak: "/Genesis/serverWeak.js",
        serverGrow: "/Genesis/serverGrow.js",
        serverHack: "/Genesis/serverHack.js",
        netStumbler: "/Genesis/netStumbler.js",
        netSparker: "/Genesis/netSparker.js",
        metaSploit: "/Genesis/metaSploit.js",
        stockmarket: "/Genesis/stockMarket.js",

        //SINGULARITY
        buyCore: "/Singularity/buyCore.js",
        buyPrograms: "/Singularity/buyPrograms.js",
        buyRam: "/Singularity/buyRam.js",

        faction: "/Singularity/faction.js",
        requirements: "/Singularity/requirement.js",
        reputation: "/Singularity/reputation.js",
        installation: "/Singularity/installation.js",
        killBitnode: "/Singularity/killBitnode.js",

        //CORPORATOCTACY
        runCorporation: "/Corporatocracy/Corporation.js",

    }
    return path
}

/** @param {NS} ns */
export function getTickerServer(ns, ticker) {

    //returns (string) the corresponding server for a ticker

    switch (ticker) {
        case "ECP": { return "ecorp" }
        case "MGCP": { return "megacorp" }
        case "BLD": { return "blade" }
        case "CLRK": { return "clarkinc" }
        case "OMTK": { return "omnitek" }
        case "FSIG": { return "4sigma" }
        case "KGI": { return "kuai-gong" }
        case "FLCM": { return "fulcrumtech" }
        case "STM": { return "stormtech" }
        case "DCOMM": { return "defcomm" }
        case "HLS": { return "helios" }
        case "VITA": { return "vitalife" }
        case "ICRS": { return "icarus" }
        case "UNV": { return "univ-energy" }
        case "AERO": { return "aerocorp" }
        case "OMN": { return "omnia" }
        case "SLRS": { return "solaris" }
        case "GPH": { return "global-pharm" }
        case "NVMD": { return "nova-med" }
        case "WDS": { return "." }
        case "LXO": { return "lexo-corp" }
        case "RHOC": { return "rho-construction" }
        case "APHE": { return "alpha-ent" }
        case "SYSC": { return "syscore" }
        case "CTK": { return "computek" }
        case "NTLK": { return "netlink" }
        case "OMGA": { return "omega-net" }
        case "FNS": { return "foodnstuff" }
        case "JGN": { return "joesguns" }
        case "SGC": { return "sigma-cosmetics" }
        case "CTYS": { return "catalyst" }
        case "MDYN": { return "microdyne" }
        case "TITN": { return "titan-labs" }
    }
}