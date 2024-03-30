/** @param {NS} ns */
export async function main(ns) {

  // game starts with 8gb of ram

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
  await ns.sleep(2000)

  if (ns.getServerMaxRam("home") < 130 ) {

    ns.run("bin/genesis/collectStage1.js")

  } else if (ns.getServerMaxRam("home") < 4000) { 

    ns.run("bin/genesis/collectStage2.js")

  } else {

    ns.run("bin/genesis/collectStage3.js")

  }
  
  await ns.sleep(1000)
  ns.run("purchase/hacknet.js", 1)
  await ns.sleep(1000)
  ns.run("purchase/servers.js", 1)

}
