import { NmapRamServers } from "modules/network";

/** @param {NS} ns */
export async function main(ns) {

    let servers = NmapRamServers(ns)

    servers.forEach(server => {
        ns.rm("bin/genesis/sqn_gw.js", server)
        
    });

    ns.tprint("DONE...")

}