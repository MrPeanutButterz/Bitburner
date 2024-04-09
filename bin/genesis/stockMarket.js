import { colorPrint } from "modules/scripting";

/** @param {NS} ns */
export async function main(ns) {

    // buy all accounts
    // make list of active stocks
    // buy en sell stocks based on forcast

    // incorporate grow to pump stock 

    //\\ SCRIPT SETTINGS
    // ns.tprint("Active")
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    const FORCAST_BUY_THRESHOLD = 0.6
    const FORCAST_SELL_THRESHOLD = 0.5
    const BALANCE_TRIGGER_THRESHOLD = 2e9 // 1b
    const BALANCE_RESERVE_THRESHOLD = 5e8 // 500m

    //\\ FUNCTIONS
    function displayLog(forcast, sym) {

        // first print stock

        if (ns.stock.getPosition(sym)[0] > 0) {
            colorPrint(ns, "brightGreen", sym + "\t Forcast: " + forcast)

        } else if (forcast >= 0.6) {
            colorPrint(ns, "white", sym + "\t Forcast: " + forcast)

        }

        // add additional info if we own the stock

        if (ns.stock.getPosition(sym)[0] > 0) {

            let sharesOwnedProcent = Math.round((ns.stock.getPosition(sym)[0] / ns.stock.getMaxShares(sym)) * 100)
            let profit = Math.round(ns.stock.getSaleGain(sym, ns.stock.getPosition(sym)[0], "Long") - ns.stock.getPosition(sym)[1] * ns.stock.getPosition(sym)[0])

            if (sharesOwnedProcent === 100) {
                colorPrint(ns, "green", "shares:  " + sharesOwnedProcent + "%")

            } else {
                colorPrint(ns, "yellow", "shares:  " + sharesOwnedProcent + "%")

            }

            if (profit > 0) {
                colorPrint(ns, "green", "profit:  " + profit)

            } else {
                colorPrint(ns, "red", "profit: " + profit)

            }
        }
    }

    function getAccounts() {

        // get all accounts

        ns.clearLog()
        if (!ns.stock.hasWSEAccount()) { // buy Wse
            if (ns.stock.purchaseWseAccount()) { ns.print("WSE account found...") } else { ns.print("No WSE account") }

        } else if (!ns.stock.has4SData()) { // buy 4S data
            if (ns.stock.purchase4SMarketData()) { ns.print("4S data account found...") } else { ns.print("No 4S data account") }

        } else if (!ns.stock.hasTIXAPIAccess()) { // buy 4s Tix api access
            if (ns.stock.purchaseTixApi()) { ns.print("Tix Api access account found...") } else { ns.print("No Tix Api access account") }

        } else if (!ns.stock.has4SDataTIXAPI()) { // buy Tix api
            if (ns.stock.purchase4SMarketDataTixApi()) { ns.print("Tix Api account found...") } else { ns.print("No Tix Api account") }

        }
    }

    function sellAllShares(sym) {

        // sell stock
         
        colorPrint(ns, "yellow", "SELLING SHARES")
        ns.stock.sellStock(sym, ns.stock.getPosition(sym)[0])
    }

    function buyShares(sym) {

        // get max shares minus owned
        // buy all or buy in segments

        let availableShares = ns.stock.getMaxShares(sym) - ns.stock.getPosition(sym)[0]
        let availableMoney = ns.getServerMoneyAvailable("home")

        if (availableMoney > BALANCE_TRIGGER_THRESHOLD) {

            colorPrint(ns, "yellow", "WARNING")
            
            let spendable = BALANCE_RESERVE_THRESHOLD + (ns.getServerMoneyAvailable("home") - BALANCE_TRIGGER_THRESHOLD)
            let price = availableShares * ns.stock.getPrice(sym)
            
            if (spendable > price) {
                
                // all in
                if (ns.stock.buyStock(sym, availableShares)) {
                    
                    colorPrint(ns, "yellow", "BUYING SHARES")
                }
                
            } else {
                
                // buy bits
                let partShares = Math.floor(spendable / ns.stock.getPrice(sym))
                if (ns.stock.buyStock(sym, partShares)) {
                    
                    colorPrint(ns, "yellow", "BUYING SHARES")
                }
            }
        }
    }

    //\\ MAIN LOGICA

    // check accounts 
    ns.print("Accounts check...")
    await ns.sleep(2000)

    while (!ns.stock.hasWSEAccount()
        || !ns.stock.has4SData()
        || !ns.stock.hasTIXAPIAccess()
        || !ns.stock.has4SDataTIXAPI()) {
        await ns.sleep(1000)
        getAccounts()
    }

    ns.print("Accounts are present")
    await ns.sleep(2000)

    ns.print("Managing Stocks")
    await ns.sleep(1000)

    // managing stocks
    const symbols = ns.stock.getSymbols()
    while (true) {

        await ns.stock.nextUpdate()
        ns.clearLog()

        for (let sym of symbols) {

            let forcast = ns.stock.getForecast(sym).toPrecision(3)
            displayLog(forcast, sym)

            // buy 
            if (ns.stock.getForecast(sym) > FORCAST_BUY_THRESHOLD &&
                ns.stock.getPosition(sym)[0] !== ns.stock.getMaxShares(sym)) {
                buyShares(sym)
            }

            // sell
            if (ns.stock.getForecast(sym) < FORCAST_SELL_THRESHOLD &&
                ns.stock.getPosition(sym)[0] > 0) {
                sellAllShares(sym)

            }
        }
    }
}
