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
        buyHacknet: "/Genesis/buyHacknet.js",
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

        findFaction: "/Singularity/findFaction.js",
        requirements: "/Singularity/requirements.js",
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

/** @param {NS} ns */
export function getFactionNames(ns) {

    //returns (string array) a list of all factions

    const list = [
        "CyberSec", 					//Install a backdoor on the CSEC server
        "Tian Di Hui",					//$1m & Hacking Level 50 & Be in Chongqing, New Tokyo, or Ishima
        "Netburners",					//Hacking Level 80 & Total Hacknet Levels of 100 & Total Hacknet RAM of 8 & Total Hacknet Cores of 4
        "Sector-12",					//Be in Sector-12 & $15m
        "Chongqing",					//Be in Chongqing & $20m
        "New Tokyo",					//Be in New Tokyo & $20m
        "Ishima",						//Be in Ishima & $30m
        "Aevum",						//Be in Aevum & $40m
        "Volhaven",						//Be in Volhaven & $50m
        "NiteSec",						//Install a backdoor on the avmnite-02h server
        "The Black Hand",				//Install a backdoor on the I.I.I.I server
        "BitRunners",					//Install a backdoor on the run4theh111z server
        "ECorp",						//Have 400K reputation, Backdooring company server reduces faction requirement to 300k.
        "MegaCorp",						//Have 400K reputation, Backdooring company server reduces faction requirement to 300k.
        "KuaiGong International",		//Have 400K reputation, Backdooring company server reduces faction requirement to 300k.
        "Four Sigma",					//Have 400K reputation, Backdooring company server reduces faction requirement to 300k.
        "NWO",							//Have 400K reputation, Backdooring company server reduces faction requirement to 300k.
        "Blade Industries",				//Have 400K reputation, Backdooring company server reduces faction requirement to 300k.
        "OmniTek Incorporated",			//Have 400K reputation, Backdooring company server reduces faction requirement to 300k.
        "Bachman & Associates",			//Have 400K reputation, Backdooring company server reduces faction requirement to 300k.
        "Clarke Incorporated",			//Have 400K reputation, Backdooring company server reduces faction requirement to 300k.
        "Fulcrum Secret Technologies", 	//Have 500K reputation, Backdooring company server reduces faction requirement to 400K.
        "Slum Snakes",					//All Combat Stats of 30, -9 Karma, $1m
        "Tetrads",						//Be in Chongqing, New Tokyo, or Ishima, All Combat Stats of 75, -18 Karma
        "Silhouette",					//CTO, CFO, or CEO of a company, $15m, -22 Karma
        "Speakers for the Dead",		//Hacking Level 100, All Combat Stats of 300, 30 People Killed, -45 Karma, Not working for CIA or NSA
        "The Dark Army",				//Hacking Level 300, All Combat Stats of 300, Be in Chongqing, 5 People Killed, -45 Karma, Not working for CIA or NSA
        "The Syndicate",				///Hacking Level 200, All Combat Stats of 200, Be in Aevum or Sector-12, $10m, -90 Karma, Not working for CIA or NSA
        "The Covenant",					//20 Augmentations, $75b, Hacking Level of 850, All Combat Stats of 850
        "Daedalus",						//30 Augmentations, $100b, Hacking Level of 2500 OR All Combat Stats of 1500
        "Illuminati",					//30 Augmentations, $150b, Hacking Level of 1500, All Combat Stats of 1200
    ]
    return list
}

/** @param {NS} ns */
export function getFactionServer(ns, factionName) {

    //returns (string) the corresponding server for a faction

    switch (factionName) {
        case "CyberSec": { return "CSEC" }
        case "NiteSec": { return "avmnite-02h" }
        case "The Black Hand": { return "I.I.I.I" }
        case "BitRunners": { return "run4theh111z" }
        case "ECorp": { return "ecorp" }
        case "MegaCorp": { "megacorp" }
        case "KuaiGong International": { return "kuai-gong" }
        case "Four Sigma": { return "4sigma" }
        case "NWO": { return "nwo" }
        case "Blade Industries": { return "blade" }
        case "OmniTek Incorporated": { return "omnia" }
        case "Bachman & Associates": { return "b-and-a" }
        case "Clarke Incorporated": { return "clarkinc" }
        case "Fulcrum Secret Technologies": { return "fulcrumassets" }
    }
}