
/** @param {NS} ns */
export function getStockAccounts(ns) {

	//checks if we have all accounts (boolean)

	if (ns.stock.purchaseWseAccount() == true
		&& ns.stock.purchase4SMarketData() == true
		&& ns.stock.purchaseTixApi() == true
		&& ns.stock.purchase4SMarketDataTixApi() == true) {
		return true
	} else {
		return false
	}
}