/** @param {NS} ns */
export async function main(ns) {

  //\\ SCRIPT SETTINGS
  ns.disableLog("ALL")
  ns.clearLog()

  //\\ GENERAL DATA
  const home = "home"

  const scripts = [
    "bin/genesis/collectStage1.js", // 0
    "purchase/hacknet.js",          // 1
    "purchase/servers.js",          // 2
    "purchase/ram.js",              // 3
    "purchase/programs.js",         // 4
    "bin/genesis/stockMarket.js",   // 5
    "bin/genesis/collectStage3.js", // 6
  ]

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
  while (!calculateHomeRam(scripts[0])) { await ns.sleep(1000) }
  ns.run(scripts[0], 1, "foodnstuff")
  await ns.sleep(1000)

  // // hacknet
  // while (!calculateHomeRam(scripts[1])) { await ns.sleep(1000) }
  // ns.run(scripts[1], 1, 10, 100, 4, 1)
  // await ns.sleep(1000)

  // servers limited 32Gb
  while (!calculateHomeRam(scripts[2])) { await ns.sleep(1000) }
  ns.run(scripts[2], 1, 32)
  await ns.sleep(1000)

  // ram
  while (!calculateHomeRam(scripts[3])) { await ns.sleep(1000) }
  ns.run(scripts[3], 1)
  await ns.sleep(1000)

  // programs
  while (!calculateHomeRam(scripts[4])) { await ns.sleep(1000) }
  ns.run(scripts[4], 1)
  await ns.sleep(1000)

  // servers 
  while (!calculateHomeRam(scripts[2]) || ns.isRunning(scripts[2], "home", 32)) { await ns.sleep(1000) }
  ns.run(scripts[2], 1)
  await ns.sleep(1000)

  // stockmarket
  if (ns.getServerMaxRam("home") > 1024) {
    while (!calculateHomeRam(scripts[4]) && ns.isRunning(scripts[6], "home")) { await ns.sleep(1000) }
    ns.run(scripts[5], 1)
    await ns.sleep(1000)
  }

}
