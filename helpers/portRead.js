/** @param {NS} ns */
export async function main(ns) {

    // check for space to run scripts 
    // read port 
    // execute command 

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ GENERAL DATA   
    const port = 1

    //\\ FUNCTIONS
    //\\ MAIN LOGICA

    //Reads a value from port 1 and then prints it

    if (ns.peek(port) !== "NULL PORT DATA") {

        let data = ns.readPort(port)
        ns.tprint(data.name)
        ns.tprint(data.action)
        ns.tprint(data.threads)
    }
}
