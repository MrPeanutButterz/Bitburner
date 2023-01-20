// Creator: https://github.com/MrPeanutbutterz 
/* this script grows the money of a server, use arg to define target server with a delay */

/** @param {NS} ns */
export async function main(ns) {
    
    //\\ GENERAL DATA
    let target = ns.args[0];
    let delay = ns.args[1];

    //\\ MAIN LOGICA
    await ns.sleep(delay)
    await ns.grow(target)
}