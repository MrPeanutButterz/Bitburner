import { scriptPath } from "modules/scripting"

/** @param {NS} ns */
export async function main(ns) {

  //\\ SCRIPT SETTINGS
  ns.disableLog("ALL")
  ns.clearLog()

  //\\ GENERAL DATA
  const SCRIPT = scriptPath(ns)

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
  while (!calculateHomeRam(SCRIPT.collectStage1)) { await ns.sleep(1000) }
  ns.run(SCRIPT.collectStage1, 1)
  await ns.sleep(1000)

  // // hacknet
  // while (!calculateHomeRam("bin/genesis/hacknet.js")) { await ns.sleep(1000) }
  // ns.run("bin/genesis/hacknet.js", 1, 10, 100, 4, 1)
  // await ns.sleep(1000)

  // programs
  while (!calculateHomeRam(SCRIPT.programs)) { await ns.sleep(1000) }
  ns.run(SCRIPT.programs, 1)
  await ns.sleep(1000)

  // ram
  while (!calculateHomeRam(SCRIPT.ram)) { await ns.sleep(1000) }
  ns.run(SCRIPT.ram, 1)
  await ns.sleep(1000)

  // servers
  while (!calculateHomeRam(SCRIPT.servers)) { await ns.sleep(1000) }
  ns.run(SCRIPT.servers, 1)
  await ns.sleep(1000)

  while (ns.getServerMaxRam("home") < 128) { await ns.sleep(1000) }

  // faction
  while (!calculateHomeRam(SCRIPT.faction)) { await ns.sleep(1000) }
  ns.run(SCRIPT.faction, 1, "--story")
  await ns.sleep(1000)

  // stockmarket
  while (!calculateHomeRam(SCRIPT.stockmarket)) { await ns.sleep(1000) }
  ns.run(SCRIPT.stockmarket, 1)
  await ns.sleep(1000)

  if (ns.getServerMaxRam("home") > 8000) {

    // core
    while (!calculateHomeRam(SCRIPT.core)) { await ns.sleep(1000) }
    ns.run(SCRIPT.core, 1)
    await ns.sleep(1000)

  }
}
