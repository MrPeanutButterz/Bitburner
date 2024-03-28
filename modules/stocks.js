/** @param {NS} ns */
export function getStockAccounts(ns) {

	//checks if we have all accounts (boolean)

	if (ns.stock.purchaseWseAccount()
		&& ns.stock.purchase4SMarketData()
		&& ns.stock.purchaseTixApi()
		&& ns.stock.purchase4SMarketDataTixApi()) {
		return true
	} else {
		return false
	}
}