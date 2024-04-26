import { scriptPath } from "lib/scripting"
import { canRunOnHome } from "lib/network"

/** @param {NS} ns */
export async function main(ns) {

  //\\ SCRIPT SETTINGS
  ns.disableLog("ALL")
  ns.clearLog()

  //\\ GENERAL DATA
  const SCRIPT = scriptPath(ns)

  //\\ FUNCTIONS 
  async function intro() {
    ns.tprint("\n\nWake up, Neo...\nThe matrix has you...\n\n")
    await ns.sleep(5000)
  }

  async function run(script) {
    while (!canRunOnHome(ns, script)) { await ns.sleep(1000) }
    ns.run(script, 1)
    await ns.sleep(1000)
  }

  //\\ MAIN MAGIC
  await intro()
  await run(SCRIPT.collect)
  await run(SCRIPT.programs)
  await run(SCRIPT.servers)
  await run(SCRIPT.ram)
  await ns.sleep(2000)

  while (ns.getServerMaxRam("home") < 128) { await ns.sleep(1000) }
  await run(SCRIPT.faction)
  await run(SCRIPT.crime)
  await run("utils/interface.js")

  if (ns.getServerMaxRam("home") > 2000) {
    await run(SCRIPT.core)
    await run(SCRIPT.stockmarket)
  }
}
