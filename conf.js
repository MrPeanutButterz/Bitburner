/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz
Proces: configurations */

/** @param {NS} ns */
export function getSleepTime(ns) {
    const scriptSpeed = {

        //returns different script speeds

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

    //returns path to any script used in operation

    const path = {

        //GENESIS
        serverExploid: "/Genesis/serverExploid.js",
        serverWeak: "/Genesis/ServerWeak.js",
        serverGrow: "/Genesis/ServerGrow.js",
        serverHack: "/Genesis/ServerHack.js",
        netStumbler: "/Genesis/netStumbler.js",
        netSparker: "/Genesis/netSparker.js",
        metaSploit: "/Genesis/metaSploit.js",
        stockmarket: "/Genesis/StockMarket.js",

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

