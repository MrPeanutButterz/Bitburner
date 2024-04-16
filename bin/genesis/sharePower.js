import { scriptStart, scriptExit, scriptPath } from "modules/scripting"
import { NmapClear, NmapRamServers, NmapTotalRam } from "modules/network"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA
    const SCRIPT = scriptPath(ns)

    //\\ MAIN LOGICA
    if (ns.scriptRunning(SCRIPT.collectStage2, "home")) { ns.scriptKill(SCRIPT.collectStage2, "home") }
    if (ns.scriptRunning(SCRIPT.preweak, "home")) { ns.scriptKill(SCRIPT.preweak, "home") }

    NmapClear(ns)
    while (NmapTotalRam(ns) != 26216588) {

        await ns.sleep(1000)
        NmapRamServers(ns).forEach(server => {

            if (ns.hasRootAccess(server)) {
                if (ns.scp(SCRIPT.share, server, "home")) {

                    let ramAvailable = ns.getServerMaxRam(server) - ns.getServerUsedRam(server)
                    let threadsAvailable = Math.floor(ramAvailable / ns.getScriptRam(SCRIPT.share))
                    if (threadsAvailable > 1) {
                        ns.exec(SCRIPT.share, server, threadsAvailable)
                    }

                }
            }
        })
    }

    let availableRam = ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
    let availableThreads = Math.floor(availableRam / ns.getScriptRam(SCRIPT.share))
    if (availableThreads > 1) { ns.exec(SCRIPT.share, "home", availableThreads) }
    scriptExit(ns)
} 
