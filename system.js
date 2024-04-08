/** @param {NS} ns */
export async function main(ns) {

  //\\ SCRIPT SETTINGS
  ns.disableLog("ALL")
  ns.clearLog()

  //\\ GENERAL DATA
  //\\ FUNCTIONS 
  function calculateHomeRam(script) {
    let ramAvailable = ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
    let scriptRam = ns.getScriptRam(script, "home")
    return ramAvailable >= scriptRam
  }

  //\\ MAIN LOGIC
  ns.tprint("Charlie Charlie, are you there?")
  await ns.sleep(2000)

  // collect
  while (!calculateHomeRam("bin/genesis/collectStage1.js")) { await ns.sleep(1000) }
  ns.run("bin/genesis/collectStage1.js", 1, "foodnstuff")
  await ns.sleep(1000)

  // // hacknet
  // while (!calculateHomeRam("purchase/hacknet.js")) { await ns.sleep(1000) }
  // ns.run("purchase/hacknet.js", 1, 10, 100, 4, 1)
  // await ns.sleep(1000)

  // servers limited 32Gb
  while (!calculateHomeRam("purchase/servers.js")) { await ns.sleep(1000) }
  ns.run("purchase/servers.js", 1, 32)
  await ns.sleep(1000)

  // ram
  while (!calculateHomeRam("purchase/ram.js")) { await ns.sleep(1000) }
  ns.run("purchase/ram.js", 1)
  await ns.sleep(1000)

  // programs
  while (!calculateHomeRam("purchase/programs.js")) { await ns.sleep(1000) }
  ns.run("purchase/programs.js", 1)
  await ns.sleep(1000)

  // servers 
  while (!calculateHomeRam("purchase/servers.js") || ns.isRunning("purchase/servers.js", "home", 32)) { await ns.sleep(1000) }
  ns.run("purchase/servers.js", 1)
  await ns.sleep(1000)

  if (ns.getServerMaxRam("home") > 1024) {
    
    // stockmarket
    while (!calculateHomeRam("bin/genesis/stockMarket.js") && ns.isRunning("bin/genesis/collectStage3.js", "home")) { await ns.sleep(1000) }
    ns.run("bin/genesis/stockMarket.js", 1)
    await ns.sleep(1000)
    
    // core
    while (!calculateHomeRam("purchase/core.js")) { await ns.sleep(1000) }
    ns.run("purchase/core.js", 1)
    await ns.sleep(1000)

  }
}
