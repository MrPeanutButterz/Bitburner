/*Creator: Charles, add me on github ==> https://github.com/MrPeanutbutterz 
Proces: network cleaner  */

import { getServersWithRam, } from "./Default/library.js"

/** @param {NS} ns */
export async function main(ns) {

	//\\ GENERAL DATA
	let servers = getServersWithRam(ns)

	//\\ MAIN LOGICA
	for (let server of servers) {
		ns.killall(server)
	}
}