import { scriptStart } from "lib/scripting"
import { colorPrint } from "lib/scripting";

/** @param {NS} ns */
export async function main(ns) {

    // buy all accounts
    // fill / remove portfolio with intresting stocks 
    // buy en sell stocks based on forcast

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA
    const FORCAST_BUY_THRESHOLD = 0.61
    const FORCAST_SELL_THRESHOLD = 0.5
    const BALANCE_TRIGGER_THRESHOLD = 6e9 // 6b spend 
    const BALANCE_RESERVE_THRESHOLD = 1e9 // 1b keep

    let SYMBOLS
    let PORTFOLIO = []

    //\\ FUNCTIONS
    function getAccounts() {

        // get all accounts

        if (!ns.stock.hasWSEAccount()) {
            ns.stock.purchaseWseAccount() ? ns.print("WSE account active") : ns.print("WSE account missing")

        } else if (!ns.stock.has4SData()) {
            ns.stock.purchase4SMarketData() ? ns.print("4S markt data account active") : ns.print("4S markt data account missing")

        } else if (!ns.stock.hasTIXAPIAccess()) {
            ns.stock.purchaseTixApi() ? ns.print("TIX API access active") : ns.print("TIX API acccess missing")

        } else if (!ns.stock.has4SDataTIXAPI()) {
            ns.stock.purchase4SMarketDataTixApi() ? ns.print("4S markt data TIX API active") : ns.print("4S markt data TIX API missing")
        }
    }

    function isOwnedStock(symbol) {
        return Boolean(PORTFOLIO.find(portfolio => portfolio.sym === symbol))
    }

    function updatePortfolio() {

        // list stock above threshold en sort top

        for (let sym of SYMBOLS) {

            // add to portfolio based on threshold or position in stock

            let forcast = ns.stock.getForecast(sym)
            let shares = ns.stock.getPosition(sym)[0]

            if (forcast > FORCAST_BUY_THRESHOLD || shares > 0) {

                if (!isOwnedStock(sym)) {

                    PORTFOLIO.push({
                        sym: sym,
                        forcast: forcast.toPrecision(3)
                    })
                }

            } else if (shares === 0) {

                // remove if position is 0

                if (isOwnedStock(sym)) {
                    PORTFOLIO.splice(PORTFOLIO.findIndex(stock => stock.sym === sym))
                }
            }
        }

        PORTFOLIO.sort(function (a, b) { return a.forcast - b.forcast })
        PORTFOLIO.reverse()
    }

    function displayStatus() {

        // print stock info from portfolio

        PORTFOLIO.forEach(stock => {

            let sharesOwnedProcent = Math.round((ns.stock.getPosition(stock.sym)[0] / ns.stock.getMaxShares(stock.sym)) * 100)
            let profit = Math.round(ns.stock.getSaleGain(stock.sym, ns.stock.getPosition(stock.sym)[0], "Long") - ns.stock.getPosition(stock.sym)[1] * ns.stock.getPosition(stock.sym)[0])

            ns.print(" ")
            ns.print("\t" + stock.sym)
            ns.print("forcas\t" + ns.stock.getForecast(stock.sym).toPrecision(3))
            ns.print("volati\t" + (ns.stock.getVolatility(stock.sym) * 100).toPrecision(3) + "%")
            ns.print("shares \t" + sharesOwnedProcent + "%")
            profit >= 0 ? ns.print("profit\t" + ns.formatNumber(profit)) : colorPrint(ns, "red", "losses\t" + ns.formatNumber(profit))
        })
    }

    function sellShares() {

        // sell if below threshold
        // sell if not in portfolio

        for (let stock of PORTFOLIO) {

            if (ns.stock.getForecast(stock.sym) < FORCAST_SELL_THRESHOLD) {

                let shares = ns.stock.getPosition(stock.sym)[0]
                if (shares > 0) {
                    ns.stock.sellStock(stock.sym, shares)
                }
            }
        }
    }

    function buyShares() {

        // buy 
        // calculate how many to buy
        // buy all or in parts 

        for (let stock of PORTFOLIO) {

            let availableShares = ns.stock.getMaxShares(stock.sym) - ns.stock.getPosition(stock.sym)[0]
            let availableMoney = ns.getServerMoneyAvailable("home")
            let spendableMoney = availableMoney - BALANCE_RESERVE_THRESHOLD
            let priceMaxShares = availableShares * ns.stock.getPrice(stock.sym)

            if (availableShares > 0 && availableMoney > BALANCE_TRIGGER_THRESHOLD) {

                if (spendableMoney > priceMaxShares) {

                    // buy all 
                    ns.stock.buyStock(stock.sym, availableShares)

                } else {

                    // buy parts 
                    let partShares = Math.floor(spendableMoney / ns.stock.getPrice(stock.sym))
                    ns.stock.buyStock(stock.sym, partShares)
                }
            }
        }
    }

    //\\ MAIN LOGICA
    while (!ns.stock.hasWSEAccount() ||
        !ns.stock.has4SData() ||
        !ns.stock.hasTIXAPIAccess() ||
        !ns.stock.has4SDataTIXAPI()) {
        await ns.sleep(5000)
        ns.clearLog()
        getAccounts()
    }

    SYMBOLS = ns.stock.getSymbols()

    // managing stocks
    while (true) {

        displayStatus()
        await ns.stock.nextUpdate()
        ns.clearLog()

        updatePortfolio()
        sellShares()

        updatePortfolio()
        buyShares()

    }
}
