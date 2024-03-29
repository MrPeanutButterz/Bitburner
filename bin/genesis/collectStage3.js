/** @param {NS} ns */
export async function main(ns) {

    // make system with ports 
    // on every server run a script that receive instuctions
    // on home calculate en dispatch instructions 

    //

    //\\ SCRIPT SETTINGS
    ns.tprint("Active")
    ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ GENERAL DATA
    //\\ FUNCTIONS
    function broadcastTransaction() {
        
        ns.writePort(1, {});
    }

    //\\ MAIN LOGICA


}