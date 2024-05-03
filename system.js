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

  async function waitForRam() {
    while (ns.getServerMaxRam("home") < 128) {
      ns.print("Awaiting more ram on home")
      await ns.sleep(1000)
    }
  }

  async function run(script) {
    while (!canRunOnHome(ns, script)) {
      ns.print("Next is " + script)
      await ns.sleep(1000)
    }

    ns.run(script, 1)
    await ns.sleep(1000)
  }

  //\\ MAIN MAGIC
  await intro()

  await run(SCRIPT.collect)
  await run(SCRIPT.programs)
  await run(SCRIPT.ram)
  await run(SCRIPT.servers)
  await run(SCRIPT.crime)
  await run(SCRIPT.faction)
  // await run(SCRIPT.hackGang)
  await run(SCRIPT.core)
  await run(SCRIPT.stockmarket)
  await run(SCRIPT.corporation)
  await run("utils/interface.js")

}
