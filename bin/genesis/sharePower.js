import { scriptStart, scriptExit, scriptPath } from "lib/scripting"
import { NmapClear, NmapRamServers } from "lib/network"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    const flags = ns.flags([
        ["home", false],
        ["network", false]
    ])
    scriptStart(ns)

    //\\ GENERAL DATA
    const SCRIPT = scriptPath(ns)

    //\\ FUNCTIONS
    function shareHome() {
        let availableRam = ns.getServerMaxRam("home") * 0.9 - ns.getServerUsedRam("home")
        let availableThreads = Math.floor(availableRam / ns.getScriptRam(SCRIPT.share))
        if (availableThreads > 1) { ns.exec(SCRIPT.share, "home", availableThreads) }
    }

    async function shareNetwork() {

        if (ns.scriptRunning(SCRIPT.collectStage2, "home")) { ns.scriptKill(SCRIPT.collectStage2, "home") }
        if (ns.scriptRunning(SCRIPT.preweak, "home")) { ns.scriptKill(SCRIPT.preweak, "home") }

        NmapClear(ns)
        while (true) {

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
    }

    //\\ MAIN LOGICA
    if (flags.home) {

        shareHome()

    } else if (flags.network) {

        shareNetwork()

    } else {

        shareNetwork()
        shareHome()

    }
    scriptExit(ns)
} 
