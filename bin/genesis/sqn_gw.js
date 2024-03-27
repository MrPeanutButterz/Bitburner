/** @param {NS} ns */
export async function main(ns) {

    // only servers with hackchance 90%
    // weaken server defense below threshhold
    // grow server money, baseline grows incremental

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    let servers = []
    const hackChance = 0.85

    //\\ SCRIPT SPECIFIC FUNCTIONS
    function Nmap() {

        // returns a list of all servers names in the network

        let servers = []
        let serversToScan = ns.scan("home")
        while (serversToScan.length > 0) {

            let server = serversToScan.shift()
            if (!servers.includes(server) && server !== "home") {
                servers.push(server)
                serversToScan = serversToScan.concat(ns.scan(server))
            }
        }
        return servers
    }

    function NmapMoneyServers() {

        //returns a list of servers names with money

        let servers = Nmap(ns)
        let list = []

        for (let server of servers) {
            if (ns.getServerMaxMoney(server) > 0) {
                list.push(server)
            }
        }
        return list
    }

    //\\ MAIN LOGIC
    while (true) {
        await ns.sleep(1000)
        servers = NmapMoneyServers()

        for (let server of servers) {
            if (ns.hackAnalyzeChance(server) > hackChance) {

                if (ns.getServerSecurityLevel(server) > ns.getServerMinSecurityLevel(server) + 5) {
                    ns.print("Weaken " + server)
                    await ns.weaken(server)

                } else {
                    ns.print("Growing " + server)
                    await ns.grow(server)
                }
            }
        }
    }
}
