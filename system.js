/* 
Kickstart the game
*/

export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    //\\ SCRIPT SPECIFIC FUNCTIONS
    //\\ MAIN LOGIC
    ns.tprint("Booting")
    await ns.sleep(1000)
    ns.tprint("Analyzing...")
    await ns.sleep(1000)
    ns.tprint("Happy hacking!")
}
