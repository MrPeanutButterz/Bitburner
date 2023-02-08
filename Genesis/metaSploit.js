/*Creator: Charles, add me on github https://github.com/MrPeanutbutterz 
Proces: finds servers with money, creates a timed package to hack, and installs it on servers that have ram. 
Buys en sells stocks, stocks that have a server will not be hackt only grown to pump the stock */

import { getScriptsPath, getSleepTime, getTickerServer } from "./Default/config.js"
import { getUniqueID } from "./Default/library.js"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    ns.toast("metaSploit online", "success", 2000)
    ns.disableLog("ALL")
    ns.clearLog()
    ns.tail()

    //\\ GENERAL DATA
    let script = getScriptsPath(ns)
    let speed = getSleepTime(ns)

    let symbols = ns.stock.getSymbols()
    let sellCommand = ns.args[0]

    const spendRatio = 1
    const buyThresh = 0.6
    const sellThresh = 0.5
    const minCash = 1000000000
    const minSpend = 1000000000

    //\\ SCRIPT SPECIFIC FUNCTIONS
    function displayStocks(portfolio) {

        //shows status in log

        ns.clearLog()
        ns.print("Stock\tShares")
        for (let p of portfolio) {
            ns.print(p.sym + "\t" + p.shares)
        }
    }

    function buyStock(stock) {

        // buy stock based on stock calculator

        let shares = stockBuyQuantCalc(ns.stock.getAskPrice(stock), stock)
        let stockPrice = ns.stock.getAskPrice(stock)
        ns.stock.buyStock(stock, shares)

        ns.print('BUY: ' + stock + ', quant: ' + Math.round(shares) + ' @ $' + Math.round(stockPrice))
    }

    function sellStock(stock) {

        // sell stock
        let position = ns.stock.getPosition(stock)
        let stockPrice = ns.stock.getAskPrice(stock)

        ns.stock.sellStock(stock, position[0])
    }

    function stockBuyQuantCalc(stockPrice, stock) {

        // Calculates how many shares to buy

        let playerMoney = ns.getServerMoneyAvailable('home') - minCash - 100000
        let maxSpend = playerMoney * spendRatio
        let calcShares = Math.floor(maxSpend / stockPrice)
        let position = ns.stock.getPosition(stock)
        let avShares = ns.stock.getMaxShares(stock) - position[0]

        if (calcShares > avShares) { return avShares }
        else { return calcShares }
    }

    function pumpStock(portfolio) {

        //pumps the stock

        let homeFreeRam = (ns.getServerMaxRam("home") - 1024) - ns.getServerUsedRam("home")

        for (let p of portfolio) {

            let server = getTickerServer(ns, p.sym)

            if (homeFreeRam > 512) {
                ns.run(script.serverGrow, 500, server, 0, getUniqueID(ns))
            }
        }
    }

    function sellAllStocks(portfolio) {

        //sells all stocks en kills script 

        for (let p of portfolio) {
            sellStock(p.sym)
        }
        ns.exit()
    }

    //\\ MAIN LOGICA

    while (ns.getServerMoneyAvailable('home') < minCash) {
		ns.print("metaSploit has no money!")
		await ns.sleep(speed.superSlow)
        ns.clearLog()
	}

    while (true) {

        let portfolio = []

        for (const stock of symbols) {
            let pos = ns.stock.getPosition(stock)
            if (pos[0] > 0) {
                portfolio.push({ sym: stock, value: pos[1], shares: pos[0] })
                ns.print('Detected: ' + stock + ', quant: ' + pos[0] + ' @ ' + pos[1])
            }
        }

        if (sellCommand === "sell") {
            sellAllStocks(portfolio)
        }

        let goodoffers = []
        let lenght = 0

        for (const stock of symbols) {

            if (portfolio.findIndex(obj => obj.sym === stock) !== -1) {
                if (ns.stock.getForecast(stock) < sellThresh) {
                    sellStock(stock)
                }
            }

            if (ns.stock.getForecast(stock) >= buyThresh) {
                goodoffers.push([stock, (ns.stock.getForecast(stock) - 0.5) * ns.stock.getVolatility(stock)])
                lenght += 1
            }
        }

        goodoffers.sort((a, b) => b[1] - a[1])

        for (let i = 0; i < lenght; i++) {
            if ((ns.getServerMoneyAvailable('home') - minCash - 100000) * spendRatio > minSpend
                && ns.stock.getMaxShares(goodoffers[i][0]) > ns.stock.getPosition(goodoffers[i][0])[0]) {

                buyStock(goodoffers[i][0])
            }
        }

        pumpStock(portfolio)
        displayStocks(portfolio)
        await ns.sleep(speed.medium)
    }
}