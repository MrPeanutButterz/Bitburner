/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz
Proces: configurations */

/** @param {NS} ns */
export function getSleepTime(ns) {

    //returns (number) different script speeds

    const scriptSpeed = {
        superFast: 50,
        fast: 200,
        average: 600,
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

        //ROOT
        main: "main.js",

        //DEFAULT
        netCleaner: "/Default/netCleaner.js",

        //GENESIS
        buyHacknet: "/Genesis/buyHacknet.js",
        buyServers: "/Genesis/buyServers.js",

        serverExploid: "/Genesis/serverExploid.js",
        serverWeak: "/Genesis/serverWeak.js",
        serverGrow: "/Genesis/serverGrow.js",
        serverHack: "/Genesis/serverHack.js",

        netStumbler: "/Genesis/netStumbler.js",
        netSparker: "/Genesis/netSparker.js",
        metaSploit: "/Genesis/metaSploit.js",

        //SINGULARITY
        buyCore: "/Singularity/buyCore.js",
        buyPrograms: "/Singularity/buyPrograms.js",
        buyRam: "/Singularity/buyRam.js",

        findFaction: "/Singularity/findFaction.js",
        requirements: "/Singularity/requirements.js",
        reputation: "/Singularity/reputation.js",
        installation: "/Singularity/installation.js",
        killBitnode: "/Singularity/killBitnode.js",

    }
    return path
}

/** @param {NS} ns */
export function getDynamicNetwork(ns, netRam) {

    //returns (array) of settings for hacking

    //max network ram 12587548 Gb

    if (netRam < 20000) {
        return { growth: 1.030, steal: 0.010, defence: 8, chance: 0.8, version: "lvl.1", }

    } else if (netRam < 22500) {
        return { growth: 1.063, steal: 0.017, defence: 7, chance: 0.8, version: "lvl.2", }

    } else if (netRam < 35000) {
        return { growth: 1.096, steal: 0.033, defence: 6, chance: 0.7, version: "lvl.3", }

    } else if (netRam < 50000) {
        return { growth: 1.129, steal: 0.049, defence: 5, chance: 0.7, version: "lvl.4", }

    } else if (netRam < 80000) {
        return { growth: 1.162, steal: 0.065, defence: 4, chance: 0.6, version: "lvl.5", }

    } else if (netRam < 150000) {
        return { growth: 1.195, steal: 0.081, defence: 4, chance: 0.6, version: "lvl.6", }

    } else {
        return { growth: 1.327, steal: 0.145, defence: 2, chance: 0.1, version: "lvl.7", }

    }
}

/** @param {NS} ns */
export function getStockSettings(ns) {

    //returns (number) of stock settings

    const stockSettings = {
        forecastThresh: 0.6,
        minCash: 1000000000,
        sellThresh: 0.5,
        spendRatio: 1,
        minSpend: 1000000000,
    }
    return stockSettings
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

/** @param {NS} ns */
export function getFactionNames(ns) {

    //returns (string array) a list of all factions

    const list = [
        "Netburners",					//Hacking lvl 80 & Total Hacknet Levels of 100 & Total Hacknet RAM of 8 & Total Hacknet Cores of 4
        "Tian Di Hui",					//$1m & Hacking lvl 50 & Be in Chongqing, New Tokyo, or Ishima
        "Sector-12",					//Be in Sector-12 & $15m
        "Chongqing",					//Be in Chongqing & $20m
        "New Tokyo",					//Be in New Tokyo & $20m
        "Ishima",						//Be in Ishima & $30m
        "Aevum",						//Be in Aevum & $40m
        "Volhaven",						//Be in Volhaven & $50m
        "CyberSec", 					//Install a backdoor on the CSEC server
        "NiteSec",						//Install a backdoor on the avmnite-02h server
        "The Black Hand",				//Install a backdoor on the I.I.I.I server
        "BitRunners",					//Install a backdoor on the run4theh111z server
        "ECorp",						//Have 400K reputation, Backdooring company server reduces faction requirement to 300k
        "MegaCorp",						//Have 400K reputation, Backdooring company server reduces faction requirement to 300k
        "KuaiGong International",		//Have 400K reputation, Backdooring company server reduces faction requirement to 300k
        "Four Sigma",					//Have 400K reputation, Backdooring company server reduces faction requirement to 300k
        "NWO",							//Have 400K reputation, Backdooring company server reduces faction requirement to 300k
        "Blade Industries",				//Have 400K reputation, Backdooring company server reduces faction requirement to 300k
        "OmniTek Incorporated",			//Have 400K reputation, Backdooring company server reduces faction requirement to 300k
        "Bachman & Associates",			//Have 400K reputation, Backdooring company server reduces faction requirement to 300k
        "Clarke Incorporated",			//Have 400K reputation, Backdooring company server reduces faction requirement to 300k
        "Fulcrum Secret Technologies", 	//Have 500K reputation, Backdooring company server reduces faction requirement to 400K
        "Slum Snakes",					//All Combat Stats of 30, -9 Karma, $1m
        "Tetrads",						//Be in Chongqing, New Tokyo, or Ishima, All Combat Stats of 75, -18 Karma
        "Silhouette",					//CTO, CFO, or CEO of a company, $15m, -22 Karma
        "Speakers for the Dead",		//Hacking lvl 100, All Combat Stats of 300, 30 People Killed, -45 Karma, Not working for CIA or NSA
        "The Dark Army",				//Hacking lvl 300, All Combat Stats of 300, Be in Chongqing, 5 People Killed, -45 Karma, Not working for CIA or NSA
        "The Syndicate",				///Hacking lvl 200, All Combat Stats of 200, Be in Aevum or Sector-12, $10m, -90 Karma, Not working for CIA or NSA
        "The Covenant",					//20 Augmentations, $75b, Hacking lvl of 850, All Combat Stats of 850
        "Daedalus",						//30 Augmentations, $100b, Hacking lvl of 2500 OR All Combat Stats of 1500
        "Illuminati",					//30 Augmentations, $150b, Hacking lvl of 1500, All Combat Stats of 1200
    ]
    return list
}

/** @param {NS} ns */
export function getFactionServer(ns, faction) {

    //returns (string) the faction corresponding server

    switch (faction) {
        case "CyberSec": { return "CSEC" }
        case "NiteSec": { return "avmnite-02h" }
        case "The Black Hand": { return "I.I.I.I" }
        case "BitRunners": { return "run4theh111z" }
        case "ECorp": { return "ecorp" }
        case "MegaCorp": { return "megacorp" }
        case "KuaiGong International": { return "kuai-gong" }
        case "Four Sigma": { return "4sigma" }
        case "NWO": { return "nwo" }
        case "Blade Industries": { return "blade" }
        case "OmniTek Incorporated": { return "omnitek" }
        case "Bachman & Associates": { return "b-and-a" }
        case "Clarke Incorporated": { return "clarkinc" }
        case "Fulcrum Secret Technologies": { return "fulcrumtech" }
        default: { return "Unknown" }
    }
}

/** @param {NS} ns */
export function getFactionStats(ns, faction) {

    //returns (array) with stats required

    switch (faction) {
        case "Tian Di Hui": { return { money: 1000000, city: "Chongqing", hacklvl: 0, strength: 0, defense: 0, dexterity: 0, agility: 0, charisma: 0, karma: 0, kills: 0 } }
        case "Sector-12": { return { money: 15000000, city: "Sector-12", hacklvl: 0, strength: 0, defense: 0, dexterity: 0, agility: 0, charisma: 0, karma: 0, kills: 0 } }
        case "Chongqing": { return { money: 20000000, city: "Chongqing", hacklvl: 0, strength: 0, defense: 0, dexterity: 0, agility: 0, charisma: 0, karma: 0, kills: 0 } }
        case "New Tokyo": { return { money: 20000000, city: "New Tokyo", hacklvl: 0, strength: 0, defense: 0, dexterity: 0, agility: 0, charisma: 0, karma: 0, kills: 0 } }
        case "Ishima": { return { money: 30000000, city: "Ishima", hacklvl: 0, strength: 0, defense: 0, dexterity: 0, agility: 0, charisma: 0, karma: 0, kills: 0 } }
        case "Aevum": { return { money: 40000000, city: "Aevum", hacklvl: 0, strength: 0, defense: 0, dexterity: 0, agility: 0, charisma: 0, karma: 0, kills: 0 } }
        case "Volhaven": { return { money: 50000000, city: "Volhaven", hacklvl: 0, strength: 0, defense: 0, dexterity: 0, agility: 0, charisma: 0, karma: 0, kills: 0 } }
        case "Slum Snakes": { return { money: 1000000, city: ns.getPlayer().city, hacklvl: 0, strength: 30, defense: 30, dexterity: 30, agility: 30, charisma: 0, karma: -9, kills: 0 } }
        case "Tetrads": { return { money: 0, city: "Ishima", hacklvl: 0, strength: 75, defense: 75, dexterity: 75, agility: 75, charisma: 75, karma: -18, kills: 9 } }
        case "Silhouette": { return { money: 15000000, city: ns.getPlayer().city, hacklvl: 0, strength: 0, defense: 0, dexterity: 0, agility: 0, charisma: 300, karma: -22, kills: 0 } }
        case "Speakers for the Dead": { return { money: 15000000, city: ns.getPlayer().city, hacklvl: 100, strength: 300, defense: 300, dexterity: 300, agility: 300, charisma: 0, karma: -45, kills: 30 } }
        case "The Dark Army": { return { money: 0, city: "Chongqing", hacklvl: 300, strength: 300, defense: 300, dexterity: 300, agility: 300, charisma: 0, karma: -45, kills: 5 } }
        case "The Syndicate": { return { money: 10000000, city: "Sector-12", hacklvl: 300, strength: 200, defense: 200, dexterity: 200, agility: 200, charisma: 0, karma: -90, kills: 5 } }
        case "The Covenant": { return { money: 75000000, city: ns.getPlayer().city, hacklvl: 850, strength: 850, defense: 850, dexterity: 850, agility: 850, charisma: 0, karma: 0, kills: 0 } }
        case "Daedalus": { return { money: 100000000, city: ns.getPlayer().city, hacklvl: 2500, strength: 1500, defense: 1500, dexterity: 1500, agility: 1500, charisma: 0, karma: 0, kills: 0 } }
        case "Illuminati": { return { money: 1500000000, city: ns.getPlayer().city, hacklvl: 1500, strength: 1200, defense: 1200, dexterity: 1200, agility: 1200, charisma: 0, karma: 0, kills: 0 } }
    }
}