/* 
Genesis:
hacknet           zou de basis moeten kopen, daarna alleen bij kopen tot (max?) wanneer er meer verdient is dan uitgegeven
=================================================================

Singularity:

faction.js        zou bij het zoeken ook moeten controleren of all pre-reauistities al gekocht zijn of dat ze kunnen gekocht worden bij de factie in kwestie.
reputation.js     moet samenwerken met share.js
reputation.js     zou na x tijd moeten bepalen of het beter is of favor te krijgen en reputation te kopen
install.js        als je favor hebt kopen of neuroflux kopen tot je geld 0 is
=================================================================

Other:

home ram beter gebruiken zodat de startup soepel verloopt (enkel te testen in een nieuwe BN)
maak export functie die de bruikbare ram op home uitrekend, rekening houdend met gereserveerde ruimte
bug squashing zoals altijd!
=================================================================
*/

import { scriptPath } from "modules/scripting"
import { NmapClear, watchForNewServer, NmapFreeRam, NmapTotalRam, NmapRamServers, NmapMoneyServers } from "modules/network"

/** @param {NS} ns */
export async function main(ns) {

  //\\ SCRIPT SETTINGS
  ns.disableLog("ALL")
  ns.clearLog()
  ns.tail()

  //\\ FLAGS & DATA
  const SCRIPT = scriptPath(ns)
  // const flags = ns.flags([
  //   ["go", false]
  // ])

  // let arg = ns.args[0]

  // //\\ FUNCTIONS
  // //\\ MAIN LOGICA
  // if (flags.go) {

  //   ns.tprint("Let GOOOOOO MFFACCKAAA.")
  //   ns.run("test2.js", 1, arg, "--go")

  // } else {

  //   ns.run("test2.js", 1)
  // }


  if (["CyberSec", "NiteSec", "The Black Hand", "BitRunners"].includes("BitRunners")) { ns.print("YES") } else { ns.print("NO")}



}
