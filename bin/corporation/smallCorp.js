/** @param {NS} ns */
export async function main(ns) {

    /** _                _           
     * | |    ___   __ _(_) ___ __ _ 
     * | |   / _ \ / _` | |/ __/ _` |
     * | |__| (_) | (_| | | (_| (_| |
     * |_____\___/ \__, |_|\___\__,_|
     *              |___/             
     * 
     * corporation > run divisions we have 
     * corporation > try to buy next division 
     *
     * division > expand to all cities first
     * division > get all cities a warehouse, then continue
     * division > run the office
     * division > run the warehouse
     * division > buy export sell
     *
     * warehouse > sell material
     * warehouse > expand warehouse size
    */

    //\\ SCRIPT SETTINGS
    ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ GENERAL DATA
    const SCRIPT = scriptPath(ns)
    const API = ns.corporation

    //\\ FUNCTIONS
    //\\ MAIN LOGIC

}