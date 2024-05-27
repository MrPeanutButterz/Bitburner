import { scriptPath } from "lib/settings"
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

  async function waitForRam(ram) {
    while (ns.getServerMaxRam("home") < ram) {
      ns.clearLog()
      ns.print("Awaiting more ram on home " + ram)
      await ns.sleep(1000)
    }
  }

  async function run(script) {
    while (!canRunOnHome(ns, script)) {
      ns.clearLog()
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
  // await run(SCRIPT.gangs)

  await waitForRam(256)
  await run(SCRIPT.faction)
  await run(SCRIPT.interface)

  await waitForRam(2048)
  await run(SCRIPT.core)
  await run(SCRIPT.stockmarket)
  // await run(SCRIPT.corporation)

}
