/** @param {NS} ns */
export async function main(ns) {

    // PROCES:
    // 

    //\\ SCRIPT SETTINGS
    ns.tprint("Active")
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    const stock = ns.stock
    let symbols = stock.getSymbols()

    //\\ MAIN LOGICA

    symbols.forEach(sym => {
        ns.print(
            "name:" + sym + 
            " forcast:" + Math.floor(stock.getForecast(sym) * 100) + 
            " volatility:" + (stock.getVolatility(sym) * 100).toPrecision(3) + 
            " maxShare:" + stock.getMaxShares(sym)
            )

    })
}

// has4SData()	                                Returns true if the player has access to the 4S Data
// has4SDataTIXAPI()	                        Returns true if the player has access to the 4SData TIX API
// hasTIXAPIAccess()	                        Returns true if the player has access to the TIX API
// hasWSEAccount()	                            Returns true if the player has access to a WSE Account
// purchase4SMarketData()	                    Purchase 4S Market Data Access.
// purchase4SMarketDataTixApi()	                Purchase 4S Market Data TIX API Access.
// purchaseTixApi()	                            Purchase TIX API Access
// purchaseWseAccount()	                        Purchase WSE Account.


// getBonusTime()	                            Get Stock Market bonus time.
// getConstants()	                            Get game constants for the stock market mechanic.

// getSymbols()	                                Returns an array of the symbols of the tradable stocks
// getOrders()	                                Returns your order book for the stock market.
// getPosition(sym)	                            Returns the player’s position in a stock.

// getForecast(sym)	                            Returns the probability that the specified stock’s price will increase (as opposed to decrease) during the next tick.
// getMaxShares(sym)	                        Returns the maximum number of shares of a stock.
// getVolatility(sym)	                        Returns the volatility of the specified stock.


// buyShort(sym, shares)                        Short stocks.
// buyStock(sym, shares)	                    Buy stocks.
// cancelOrder(sym, shares, price, type, pos)	Cancel order for stocks.
// getAskPrice(sym)	                            Returns the ask price of that stock.
// getBidPrice(sym)	                            Returns the bid price of that stock.
// getOrganization(sym)	                        Returns the organization associated with a stock symbol.
// getPrice(sym)	                            Returns the price of a stock.
// getPurchaseCost(sym, shares, posType)	    Calculates cost of buying stocks.
// getSaleGain(sym, shares, posType)	        Calculate profit of selling stocks.
// nextUpdate()	                                Sleep until the next Stock Market price update has happened.
// placeOrder(sym, shares, price, type, pos)	Place order for stocks.
// sellShort(sym, shares)	                    Sell short stock.
// sellStock(sym, shares)	                    Sell stocks.