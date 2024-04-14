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
				money: 1000000,
				city: "Chongqing",
				hacklvl: 50
			}
		}
		case "Sector-12": {
			return {
				money: 15000000,
				city: "Sector-12"
			}
		}
		case "Chongqing": {
			return {
				money: 20000000,
				city: "Chongqing"
			}
		}
		case "New Tokyo": {
			return {
				money: 20000000,
				city: "New Tokyo"
			}
		}
		case "Ishima": {
			return {
				money: 30000000,
				city: "Ishima"
			}
		}
		case "Aevum": {
			return {
				money: 40000000,
				city: "Aevum"
			}
		}
		case "Volhaven": {
			return {
				money: 50000000,
				city: "Volhaven"
			}
		}
		case "Slum Snakes": {
			return {
				money: 1000000,
				city: ns.getPlayer().city,
				hacklvl: 0,
				strength: 30,
				defense: 30,
				dexterity: 30,
				agility: 30,
				charisma: 0,
				karma: -9,
				kills: 0
			}
		}
		case "Tetrads": {
			return {
				money: 0,
				city: "Ishima",
				hacklvl: 0,
				strength: 75,
				defense: 75,
				dexterity: 75,
				agility: 75,
				charisma: 75,
				karma: -18,
				kills: 0
			}
		}
		case "Silhouette": {
			return {
				money: 15000000,
				city: ns.getPlayer().city,
				hacklvl: 0,
				strength: 0,
				defense: 0,
				dexterity: 0,
				agility: 0,
				charisma: 300,
				karma: -22,
				kills: 0
			}
		}
		case "Speakers for the Dead": {
			return {
				money: 15000000,
				city: ns.getPlayer().city,
				hacklvl: 100,
				strength: 300,
				defense: 300,
				dexterity: 300,
				agility: 300,
				charisma: 0,
				karma: -45,
				kills: 30
			}
		}
		case "The Dark Army": {
			return {
				money: 0,
				city: "Chongqing",
				hacklvl: 300,
				strength: 300,
				defense: 300,
				dexterity: 300,
				agility: 300,
				charisma: 0,
				karma: -45,
				kills: 5
			}
		}
		case "The Syndicate": {
			return {
				money: 10000000,
				city: "Sector-12",
				hacklvl: 300,
				strength: 200,
				defense: 200,
				dexterity: 200,
				agility: 200,
				charisma: 0,
				karma: -90,
				kills: 5
			}
		}
		case "The Covenant": {
			return {
				money: 75000000,
				city: ns.getPlayer().city,
				hacklvl: 850,
				strength: 850,
				defense: 850,
				dexterity: 850,
				agility: 850,
				charisma: 0,
				karma: 0,
				kills: 0,
				numAug: 30
			}
		}
		case "Daedalus": {
			return {
				money: 100000000,
				city: ns.getPlayer().city,
				hacklvl: 2500,
				strength: 1500,
				defense: 1500,
				dexterity: 1500,
				agility: 1500,
				charisma: 0,
				karma: 0,
				kills: 0,
				numAug: 30
			}
		}
		case "Illuminati": {
			return {
				money: 1500000000,
				city: ns.getPlayer().city,
				hacklvl: 1500,
				strength: 1200,
				defense: 1200,
				dexterity: 1200,
				agility: 1200,
				charisma: 0,
				karma: 0,
				kills: 0,
				numAug: 30
			}
		}
	}
}
