import { scriptStart, scriptExit, scriptPath } from "lib/scripting"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    scriptStart(ns)
    ns.tail()

    //\\ GENERAL DATA
    const SCRIPT = scriptPath(ns)
    //\\ FUNCTIONS 
    //\\ LOGIC
}
