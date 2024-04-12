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
  // while (!calculateHomeRam("bin/genesis/hacknet.js")) { await ns.sleep(1000) }
  // ns.run("bin/genesis/hacknet.js", 1, 10, 100, 4, 1)
  // await ns.sleep(1000)

  // servers limited 32Gb
  while (!calculateHomeRam("bin/genesis/servers.js")) { await ns.sleep(1000) }
  ns.run("bin/genesis/servers.js", 1, 32)
  await ns.sleep(1000)

  // ram
  while (!calculateHomeRam("bin/singularity/ram.js")) { await ns.sleep(1000) }
  ns.run("bin/singularity/ram.js", 1)
  await ns.sleep(1000)

  // programs
  while (!calculateHomeRam("bin/singularity/programs.js")) { await ns.sleep(1000) }
  ns.run("bin/singularity/programs.js", 1)
  await ns.sleep(1000)

  // servers 
  while (!calculateHomeRam("bin/genesis/servers.js") || ns.isRunning("bin/genesis/servers.js", "home", 32)) { await ns.sleep(1000) }
  ns.run("bin/genesis/servers.js", 1)
  await ns.sleep(1000)

  if (ns.getServerMaxRam("home") > 1024) {
    
    // stockmarket
    while (!calculateHomeRam("bin/genesis/stockMarket.js") && ns.isRunning("bin/genesis/collectStage3.js", "home")) { await ns.sleep(1000) }
    ns.run("bin/genesis/stockMarket.js", 1)
    await ns.sleep(1000)
    
    // core
    while (!calculateHomeRam("bin/singularity/core.js")) { await ns.sleep(1000) }
    ns.run("bin/singularity/core.js", 1)
    await ns.sleep(1000)
    
    // faction
    while (!calculateHomeRam("bin/singularity/faction.js")) { await ns.sleep(1000) }
    ns.run("bin/singularity/faction.js", 1)
    await ns.sleep(1000)

  }
}
