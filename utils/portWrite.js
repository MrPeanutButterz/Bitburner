/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    // ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ GENERAL DATA   
    const port = 1
    //\\ MAIN LOGICA
    
    //Writes the value of i to port 1

    const obj = { name: "n00dles", action: "G", threads: 1 }
    ns.writePort(port, obj);

}
