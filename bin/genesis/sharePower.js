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
    const HOME_RAM_USAGE = ns.getServerMaxRam("home") > 1000 ? 0.9 : 0.5

    //\\ FUNCTIONS
    function shareHome() {
        let availableRam = (ns.getServerMaxRam("home") - ns.getServerUsedRam("home")) * HOME_RAM_USAGE
        let availableThreads = Math.floor(availableRam / ns.getScriptRam(SCRIPT.share))
        if (availableThreads > 1) { ns.run(SCRIPT.share, availableThreads) }
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

        await shareNetwork()

    } else {

        shareHome()
        await shareNetwork()

    }
    scriptExit(ns)
} 
