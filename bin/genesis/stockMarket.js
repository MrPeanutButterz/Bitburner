class Stock {
    constructor(ticker, forcast, volatility, maxShares, shares, avrPrice, stockValue) {
        this.ticker = ticker
        this.forcast = forcast
        this.volatility = volatility
        this.maxShares = maxShares
        this.shares = shares
        this.avrPrice = avrPrice
        this.stockValue = stockValue
    }
}

/** @param {NS} ns */
export async function main(ns) {

    // ====================================================
    // check all accounts, buy if no present
    // make list of active stocks
    // add or remove stocks if needed
    // buy en sell stocks
    // pump n dump
    // ====================================================

    //\\ SCRIPT SETTINGS
    ns.tprint("Active")
    ns.disableLog("ALL")
    ns.clearLog()

    //\\ GENERAL DATA
    const sm = ns.stock
    const FORCAST_THRESHOLD = 65
    const BALANCE_THRESHOLD = 100_000_000

    let accounts = false
    let symbols = sm.getSymbols()
    let constants = sm.getConstants()

    let PORTFOLIO = []

    //\\ FUNCTIONS
    function acquireAccounts() {

        // Checks if all accounts are acquired or buys 

        let myBalance = ns.getServerMoneyAvailable("home")
        if (!sm.has4SData()) {
            if (myBalance > constants.MarketData4SCost) {
                sm.purchase4SMarketData()
                ns.tprint("4S MarktData bought $" + constants.MarketData4SCost)
            }
        } else if (!sm.has4SDataTIXAPI()) {
            if (myBalance > constants.MarketDataTixApi4SCost) {
                sm.purchase4SMarketData()
                ns.tprint("4S MarktData TIX bought $" + constants.MarketDataTixApi4SCost)
            }
        } else if (!sm.hasTIXAPIAccess()) {
            if (myBalance > constants.TIXAPICost) {
                sm.purchase4SMarketData()
                ns.tprint("TIX API bought $" + constants.TIXAPICost)
            }
        } else if (!sm.hasWSEAccount()) {
            if (myBalance > constants.WSEAccountCost) {
                sm.purchase4SMarketData()
                ns.tprint("WSE Account bought $" + constants.WSEAccountCost)
            }
        } else {
            accounts = true
            ns.tprint("Accounts present...")
        }
    }

    function portfolio_check() {

        // check active stocks en add to portfolio

        ns.tprint("Active stocks:")

        symbols.forEach(sym => {
            if (sm.getPosition(sym)[0] > 0) {
                portfolio_add(new Stock(
                    sym,
                    Math.floor(sm.getForecast(sym) * 100),
                    (sm.getVolatility(sym) * 100).toPrecision(3),
                    sm.getMaxShares(sym),
                    sm.getPosition(sym)[0],
                    Math.round(sm.getPosition(sym)[1]),
                    sm.getPosition(sym)[0] * Math.round(sm.getPosition(sym)[1]),
                ))
            }
        })
    }

    function portfolio_add(stock) {

        // adds stock to portfolio

        PORTFOLIO.push(stock)
    }

    function portfolio_remove(ticker) {

        // remove stock from portfolio

        let index = PORTFOLIO.findIndex(object => {
            return object.ticker === ticker;
        })

        PORTFOLIO.splice(index, 1)
    }

    //\\ MAIN LOGICA
    ns.tprint("Accounts check...")
    await ns.sleep(1000)

    while (!accounts) {
        acquireAccounts()
        await ns.sleep(2000)
        ns.clearLog()
    }

    portfolio_check()













    
    // ////////////////////////////////////////////////////////////////////////
    for (let p of PORTFOLIO) {
        ns.tprint(p)
    }

    while (true) {

        await ns.sleep(1000)
        ns.clearLog()

        symbols.forEach(sym => {
            if (Math.floor(sm.getForecast(sym) * 100 > FORCAST_THRESHOLD)) {

                ns.print(
                    "name:" + sym +
                    " forcast:" + Math.floor(sm.getForecast(sym) * 100) +
                    " volatility:" + (sm.getVolatility(sym) * 100).toPrecision(3) +
                    " maxShare:" + sm.getMaxShares(sym)
                )
            }
        })
    }
}

// getBonusTime()	                            Get Stock Market bonus time.

// getSymbols()	                                Returns an array of the symbols of the tradable stocks
// getOrders()	                                Returns your order book for the stock market.                       BN8 ONLY
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