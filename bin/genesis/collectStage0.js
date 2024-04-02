import { watchForNewServer, NmapMoneyServers, NmapRamServers } from "modules/network"
import { scriptPath } from "modules/scripting"

/** @param {NS} ns */
export async function main(ns) {

    /* 
    stage 0 hack script, 
    loops servers with money, 
    calculates threads needed on grow +50%, 
    installs threads, 
    find active threads in network, 
    remove unused threads, 
    next target if all threads are running correct, 
    grow untill 100%, 
    weaken to min + 5, 
    hack 45% of 100%
    */

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    const scripts = scriptPath(ns)
    let MONEY_SERVER = NmapMoneyServers(ns)

    //\\ FUNCTIONS
    function displayStatus(target, growThreads, activeThreads) {
        ns.print(target + " G:" + growThreads + " A:" + activeThreads)
    }

    function sortMoneyServerByThreads() {

        let sort = []
        let unsort = NmapMoneyServers(ns)

        unsort.forEach(server => {
            sort.push({server: server, threads: Math.ceil(ns.growthAnalyze(server, 2))})
        })
       
        sort.sort(function (a, b) { 
            return a.threads - b.threads
        })

       return sort
    }

    function countActiveThreads(target) {

        // count threads active in network

        let t = 0
        let ramServers = NmapRamServers(ns)

        ramServers.forEach(server => {
            let script = ns.getRunningScript(scripts.wgh, server, target)
            if (script) { t += script.threads }
        })
        return t
    }

    function install(target, threads) {

        // install script in network

        const ramServers = NmapRamServers(ns)

        for (let server of ramServers) {

            let ramAvailable = ns.getServerMaxRam(server) - ns.getServerUsedRam(server)
            let threadsAvailable = Math.floor(ramAvailable / ns.getScriptRam(scripts.wgh))

            if (threadsAvailable >= 1) {

                if (threadsAvailable > threads) {
                    ns.exec(scripts.wgh, server, threads, target)
                    break
                }

                if (threadsAvailable < threads) {
                    ns.exec(scripts.wgh, server, threadsAvailable, target)
                    threads -= threadsAvailable
                }
            }
        }
    }

    //\\ MAIN LOGIC
    while (true) {

        let loopbreak = 10
        await ns.sleep(50)
        ns.clearLog()

        let list = sortMoneyServerByThreads()

        for (let i = 0; i < list.length;) {

            loopbreak--

            await ns.sleep(1000)
            watchForNewServer(ns)

            let target = list[i].server
            let growThreads = Math.ceil(ns.growthAnalyze(target, 2))
            let activeThreads = countActiveThreads(target)


            displayStatus(target, growThreads, activeThreads)

            if (growThreads > activeThreads) {

                // install grow
                install(target, growThreads)

            } else if (growThreads < activeThreads) {

                // remove grow 


            } else {

                // next server
                i++

            }

            if (loopbreak === 0) { break }

        }
    }
}
