/** @param {NS} ns */
export function getFactionNames(ns) {

	//returns (string array) a list of all factions

	return [
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
		case "Fulcrum Secret Technologies": { return "fulcrumassets" }
		default: { return "Unknown" }
	}
}

/** @param {NS} ns */
export function getFactionStats(ns, faction) {

	//returns (array) with stats required

	switch (faction) {
		case "Tian Di Hui": {
			return {
				money: 1e6,
				city: ns.enums.CityName.Chongqing,
				hacklvl: 50
			}
		}
		case "Sector-12": {
			return {
				money: 15e6,
				city: ns.enums.CityName.Sector12
			}
		}
		case "Chongqing": {
			return {
				money: 20e6,
				city: ns.enums.CityName.Chongqing
			}
		}
		case "New Tokyo": {
			return {
				money: 20e6,
				city: ns.enums.CityName.NewTokyo
			}
		}
		case "Ishima": {
			return {
				money: 30e6,
				city: ns.enums.CityName.Ishima
			}
		}
		case "Aevum": {
			return {
				money: 40e6,
				city: ns.enums.CityName.Aevum
			}
		}
		case "Volhaven": {
			return {
				money: 50e6,
				city: ns.enums.CityName.Volhaven
			}
		}
		case "Slum Snakes": {
			return {
				money: 1e6,
				city: ns.getPlayer().city,
				hacklvl: 0,
				str: 30,
				def: 30,
				dex: 30,
				agi: 30,
				charisma: 0,
				karma: -9,
				kills: 0
			}
		}
		case "Tetrads": {
			return {
				money: 0,
				city: ns.enums.CityName.Ishima,
				hacklvl: 0,
				str: 75,
				def: 75,
				dex: 75,
				agi: 75,
				charisma: 75,
				karma: -18,
				kills: 0
			}
		}
		case "Silhouette": {
			return {
				money: 16e6,
				city: ns.getPlayer().city,
				hacklvl: 0,
				str: 0,
				def: 0,
				dex: 0,
				agi: 0,
				charisma: 300,
				karma: -22,
				kills: 0
			}
		}
		case "Speakers for the Dead": {
			return {
				money: 0,
				city: ns.getPlayer().city,
				hacklvl: 100,
				str: 300,
				def: 300,
				dex: 300,
				agi: 300,
				charisma: 0,
				karma: -45,
				kills: 30
			}
		}
		case "The Dark Army": {
			return {
				money: 0,
				city: ns.enums.CityName.Chongqing,
				hacklvl: 300,
				str: 300,
				def: 300,
				dex: 300,
				agi: 300,
				charisma: 0,
				karma: -45,
				kills: 5
			}
		}
		case "The Syndicate": {
			return {
				money: 10e6,
				city: ns.enums.CityName.Sector12,
				hacklvl: 300,
				str: 200,
				def: 200,
				dex: 200,
				agi: 200,
				charisma: 0,
				karma: -90,
				kills: 5
			}
		}
		case "The Covenant": {
			return {
				money: 75e9,
				city: ns.getPlayer().city,
				hacklvl: 850,
				str: 850,
				def: 850,
				dex: 850,
				agi: 850,
				charisma: 0,
				karma: 0,
				kills: 0,
				numAug: 30
			}
		}
		case "Daedalus": {
			return {
				money: 100e9,
				city: ns.getPlayer().city,
				hacklvl: 2500,
				str: 1500,
				def: 1500,
				dex: 1500,
				agi: 1500,
				charisma: 0,
				karma: 0,
				kills: 0,
				numAug: 30
			}
		}
		case "Illuminati": {
			return {
				money: 150e9,
				city: ns.getPlayer().city,
				hacklvl: 1500,
				str: 1200,
				def: 1200,
				dex: 1200,
				agi: 1200,
				charisma: 0,
				karma: 0,
				kills: 0,
				numAug: 30
			}
		}
	}
}
