/** @param {NS} ns */
export async function main(ns) {

  // game starts with 8gb of ram
  // run system & hashcat
  // at the start we need hacknet / hashcat / servers = 20gb ram
  // step one: get ram up to at least 32gb

  //\\ SCRIPT SETTINGS
  ns.disableLog("ALL")
  ns.clearLog()

  //\\ GENERAL DATA
  //\\ SCRIPT SPECIFIC FUNCTIONS
  //\\ MAIN LOGIC
  ns.tprint("Booting")
  await ns.sleep(1000)
  ns.tprint("Analyzing...")
  await ns.sleep(1000)
  ns.tprint("INIT Process")
  
  ns.run("bin/genesis/hashCat.js")
  ns.run("purchase/hacknet.js", 1, 10, 75, 2, 1)
  ns.run("purchase/servers.js")

}

// system.js                               2.60GB
// bin/genesis/hashCat.js                  5.30GB
// purchase/servers.js                     7.45GB
// purchase/hacknet.js                     6.10GB