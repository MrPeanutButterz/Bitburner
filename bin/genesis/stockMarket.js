/** @param {NS} ns */
export async function main(ns) {

    // buy all accounts
    // make list of active stocks
    // buy en sell stocks based on forcast

    // buy max shares 
    // sell max shares

    //\\ SCRIPT SETTINGS
    ns.tprint("Active")
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    const FORCAST_BUY_THRESHOLD = 0.65
    const FORCAST_SELL_THRESHOLD = 0.45
    const BALANCE_THRESHOLD = 100_000_000

    //\\ FUNCTIONS
    //\\ MAIN LOGICA
    ns.print("Accounts check...")
    await ns.sleep(2000)

    while (!ns.stock.hasWSEAccount()
        || !ns.stock.has4SData()
        || !ns.stock.hasTIXAPIAccess()
        || !ns.stock.has4SDataTIXAPI()) {

        await ns.sleep(1000)
        ns.clearLog()

        // buy Wse
        if (!ns.stock.hasWSEAccount()) {
            if (ns.stock.purchaseWseAccount()) { ns.print("WSE account found...") } else { ns.print("No WSE account") }
        }

        // buy 4S data
        if (!ns.stock.has4SData()) {
            if (ns.stock.purchase4SMarketData()) { ns.print("4S data account found...") } else { ns.print("No 4S data account") }
        }

        // buy Tix api
        if (!ns.stock.has4SDataTIXAPI()) {
            if (ns.stock.purchase4SMarketDataTixApi()) { ns.print("Tix Api account found...") } else { ns.print("No Tix Api account") }
        }

        // buy 4s Tix api access
        if (!ns.stock.hasTIXAPIAccess()) {
            if (ns.stock.purchaseTixApi()) { ns.print("Tix Api access account found...") } else { ns.print("No Tix Api access account") }
        }
    }

    ns.print("Accounts are present")
    await ns.sleep(2000)

    ns.print("Managing Stocks")

    const symbols = ns.stock.getSymbols()

    while (true) {

        await ns.stock.nextUpdate()
        ns.clearLog()

        for (let sym of symbols) {

            ns.print(sym + "\t Forcast " + ns.stock.getForecast(sym).toPrecision(3))

            if (ns.stock.getPosition(sym)[0] > 0) {

                ns.print("INFO Shares  " + ns.stock.getPosition(sym)[0] + "/" + ns.stock.getMaxShares(sym))
                ns.print("INFO Profits " + Math.round(ns.stock.getSaleGain(sym, ns.stock.getPosition(sym)[0],"Long") - ns.stock.getPosition(sym)[1] * ns.stock.getPosition(sym)[0]))
                ns.print(" ")

            }

            if (ns.stock.getForecast(sym) > FORCAST_BUY_THRESHOLD && ns.stock.getPosition(sym)[0] === 0) {

                let maxShares = ns.stock.getMaxShares(sym)
                let purchaseCost = Math.ceil(ns.stock.getPurchaseCost(sym, ns.stock.getMaxShares(sym), "Long"))
                
                ns.print("WARN BUY SIGNAL")
                
                if (ns.getServerMoneyAvailable("home") > purchaseCost) {
                    ns.stock.buyStock(sym, maxShares)
                    ns.print("Bought shares: " + ns.stock.getPosition(sym)[0])
                    
                } else {
                    ns.print("PurchaseCost: " + purchaseCost)
                    ns.print("Gap in money: " + Math.round((ns.getServerMoneyAvailable("home") / purchaseCost) * 100) + "%")
                }
                ns.print(" ")

            }

            if (ns.stock.getForecast(sym) < FORCAST_SELL_THRESHOLD && ns.stock.getPosition(sym)[0] > 0) {

                ns.print("WARN SELL SIGNAL")
                ns.print(" ")

                ns.stock.sellStock(sym, ns.stock.getPosition(sym)[0])

            }
        }
    }
}
