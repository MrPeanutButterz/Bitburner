import { scriptPath } from "modules/scripting"

/** @param {NS} ns */
export async function main(ns) {

  //\\ SCRIPT SETTINGS
  ns.disableLog("ALL")
  ns.clearLog()

  //\\ GENERAL DATA
  const SCRIPT = scriptPath(ns)

  //\\ FUNCTIONS 
  async function here(s) {
    while (!calculateHomeRam(s)) { await ns.sleep(1000) }
  }

  function calculateHomeRam(script) {
    let ramAvailable = ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
    let scriptRam = ns.getScriptRam(script, "home")
    return ramAvailable >= scriptRam
  }

  //\\ MAIN LOGIC
  ns.tprint("Charlie Charlie, are you there?")
  await ns.sleep(2000)

  // collect
  await here(SCRIPT.collectStage1)
  ns.run(SCRIPT.collectStage1, 1)
  await ns.sleep(1000)

  // programs
  await here(SCRIPT.programs)
  ns.run(SCRIPT.programs, 1)
  await ns.sleep(1000)

  // ram
  await here(SCRIPT.ram)
  ns.run(SCRIPT.ram, 1)
  await ns.sleep(1000)

  // servers
  await here(SCRIPT.servers)
  ns.run(SCRIPT.servers, 1)
  await ns.sleep(1000)

  while (ns.getServerMaxRam("home") < 128) { await ns.sleep(1000) }

  // faction
  await here(SCRIPT.faction)
  ns.run(SCRIPT.faction, 1, "--story")
  await ns.sleep(1000)

  // stockmarket
  await here(SCRIPT.stockmarket)
  ns.run(SCRIPT.stockmarket, 1)
  await ns.sleep(1000)

  if (ns.getServerMaxRam("home") > 2000) {

    // core
    await here(SCRIPT.core)
    ns.run(SCRIPT.core, 1)
    await ns.sleep(1000)

  }
}
