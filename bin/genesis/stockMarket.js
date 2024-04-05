/** @param {NS} ns */
export async function main(ns) {

    // check all accounts, buy if no present
    // make list of active stocks
    // buy en sell stocks

    // buy max shares 
    // sell max shares

    //\\ SCRIPT SETTINGS
    ns.tprint("Active")
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    const FORCAST_BUY_THRESHOLD = 0.65
    const FORCAST_SELL_THRESHOLD = 0.4
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

                ns.print("INFO Shares")
                ns.print("INFO " + ns.stock.getPosition(sym)[0] + " / " + ns.stock.getMaxShares(sym))
                ns.print(" ")


            }

            if (ns.stock.getForecast(sym) > FORCAST_BUY_THRESHOLD && ns.stock.getPosition(sym)[0] === 0) {

                let maxShares = ns.stock.getMaxShares(sym)
                let askPrice = ns.stock.getAskPrice(sym)
                let purchaseCost = Math.ceil(ns.stock.getPurchaseCost(sym, ns.stock.getMaxShares(sym), "Long"))
                
                ns.print("WARN BUY")
                
                if (ns.getServerMoneyAvailable("home") > purchaseCost) {
                    ns.stock.buyStock(sym, maxShares)
                    ns.print("Shares: " + ns.stock.getPosition(sym)[0])
                    
                } else {
                    ns.print("PurchaseCost: " + purchaseCost)
                    ns.print("We don't have the money...")
                }
                ns.print(" ")

            }

            if (ns.stock.getForecast(sym) < FORCAST_SELL_THRESHOLD && ns.stock.getPosition(sym)[0] > 0) {

                ns.print("WARN SELL")
                ns.print(" ")

                ns.stock.sellStock(sym, ns.stock.getPosition(sym)[0])

            }
        }
    }
}

// getBonusTime()	                            Get Stock Market bonus time.

// getSymbols()	                                Returns an array of the symbols of the tradable stocks
// getPosition(sym)	                            Returns the player’s position in a stock.

// getForecast(sym)	                            Returns the probability that the specified stock’s price will increase (as opposed to decrease) during the next tick.
// getMaxShares(sym)	                        Returns the maximum number of shares of a stock.
// getVolatility(sym)	                        Returns the volatility of the specified stock.

// getPrice(sym)	                            Returns the price of a stock.
// getPurchaseCost(sym, shares, posType)	    Calculates cost of buying stocks.
// getAskPrice(sym)	                            Returns the ask price of that stock.
// getBidPrice(sym)	                            Returns the bid price of that stock.
// cancelOrder(sym, shares, price, type, pos)	Cancel order for stocks.
// getSaleGain(sym, shares, posType)	        Calculate profit of selling stocks.
// buyStock(sym, shares)	                    Buy stocks.
// sellStock(sym, shares)	                    Sell stocks.

// getOrganization(sym)	                        Returns the organization associated with a stock symbol.
// nextUpdate()	                                Sleep until the next Stock Market price update has happened.
// placeOrder(sym, shares, price, type, pos)	Place order for stocks.
// buyShort(sym, shares)                        Short stocks.
// sellShort(sym, shares)	                    Sell short stock.
