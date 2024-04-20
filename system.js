import { scriptPath } from "lib/scripting"

/** @param {NS} ns */
export async function main(ns) {

  //\\ SCRIPT SETTINGS
  ns.disableLog("ALL")
  ns.clearLog()

  //\\ GENERAL DATA
  const SCRIPT = scriptPath(ns)

  //\\ FUNCTIONS 
  async function intro() {
    ns.tprint("\n\nNeo...\nare you there?\n\n")
    await ns.sleep(5000)
  }

  async function here(s) {
    while (!calculateHomeRam(s)) { await ns.sleep(1000) }
  }

  function calculateHomeRam(script) {
    let ramAvailable = ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
    let scriptRam = ns.getScriptRam(script, "home")
    return ramAvailable >= scriptRam
  }

  async function run(s) {
    await here(s)
    ns.run(s, 1)
    await ns.sleep(1000)
  }

  //\\ MAIN MAGIC
  await intro()
  await run(SCRIPT.collect)
  await run(SCRIPT.programs)
  await run(SCRIPT.ram)
  await run(SCRIPT.servers)

  while (ns.getServerMaxRam("home") < 128) { await ns.sleep(1000) }
  await run(SCRIPT.faction)
  await run(SCRIPT.stockmarket)

  if (ns.getServerMaxRam("home") > 2000) {
    await run(SCRIPT.core)
    await run("utils/interface.js")
  }
}
