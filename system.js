/** @param {NS} ns */
export async function main(ns) {

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
  ns.run("purchase/hacknet.js", 1, 10, 50, 2, 1)


}
