class stock {
    constructor(ticker) {

        this.ticker = ticker

    }
}

/** @param {NS} ns */
export async function main(ns) {

    // check all accounts, buy if no present
    // make list of active stocks
    // add or remove stocks if needed
    // buy en sell stocks
    // pump n dump

    //\\ SCRIPT SETTINGS
    ns.tprint("Active")
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    let accounts = false
    let symbols = STOCK.getSymbols()
    let constants = STOCK.getConstants()

    const STOCK = ns.STOCK
    const FORCAST_BUY_THRESHOLD = 0.6
    const FORCAST_SELL_THRESHOLD = 0.4
    const BALANCE_THRESHOLD = 100_000_000
    
    let INTRESTING_STOCKS = []
    let PORTFOLIO = []

    //\\ FUNCTIONS
    function acquireAccounts() {

        // Checks if all accounts are acquired or buys 

        let myBalance = ns.getServerMoneyAvailable("home")

        if (!STOCK.has4SData()) {
            if (myBalance > constants.MarketData4SCost) {
                STOCK.purchase4SMarketData()
                ns.tprint("4S MarktData bought $" + constants.MarketData4SCost)
            }
        } else if (!STOCK.has4SDataTIXAPI()) {
            if (myBalance > constants.MarketDataTixApi4SCost) {
                STOCK.purchase4SMarketData()
                ns.tprint("4S MarktData TIX bought $" + constants.MarketDataTixApi4SCost)
            }
        } else if (!STOCK.hasTIXAPIAccess()) {
            if (myBalance > constants.TIXAPICost) {
                STOCK.purchase4SMarketData()
                ns.tprint("TIX API bought $" + constants.TIXAPICost)
            }
        } else if (!STOCK.hasWSEAccount()) {
            if (myBalance > constants.WSEAccountCost) {
                STOCK.purchase4SMarketData()
                ns.tprint("WSE Account bought $" + constants.WSEAccountCost)
            }
        } else {
            accounts = true

        }
    }

    function addPortfolio(sym) {
        PORTFOLIO.push(sym)
    }

    //\\ MAIN LOGICA
    ns.print("Accounts check...")
    await ns.sleep(1000)
    
    while (!accounts) {
        acquireAccounts()
        await ns.sleep(2000)
        ns.clearLog()
    }

    ns.print("Accounts present")
    await ns.sleep(1000)
    ns.print("Managing Stocks")

    while (true) {

        await ns.sleep(1000)
        ns.clearLog()

        symbols.forEach(sym => {

            if (STOCK.getForecast(sym) >= FORCAST_BUY_THRESHOLD) {

                // buy STOCK
                ns.print(
                    sym +
                    " forcast:" + Math.floor(STOCK.getForecast(sym) * 100) +
                    " volatility:" + (STOCK.getVolatility(sym) * 100).toPrecision(3)
                )


            } else if (STOCK.getForecast(sym) < FORCAST_SELL_THRESHOLD) {

                // sell stock

            }
        })
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
// buyStock(sym, shares)	                    Buy stocks.
// getSaleGain(sym, shares, posType)	        Calculate profit of selling stocks.
// sellStock(sym, shares)	                    Sell stocks.

// getOrganization(sym)	                        Returns the organization associated with a stock symbol.
// nextUpdate()	                                Sleep until the next Stock Market price update has happened.
// placeOrder(sym, shares, price, type, pos)	Place order for stocks.
// buyShort(sym, shares)                        Short stocks.
// sellShort(sym, shares)	                    Sell short stock.


// Rename scripts
// networkStage1.js
// stockStage1.js