import { scriptStart, scriptPath } from "/lib/settings"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    scriptStart(ns, true)

    //\\ GENERAL DATA
    const SCRIPT = scriptPath(ns)
    const SERVER = "n00dles"
    const API = ns.formulas.hacking

    //\\ FUNCTIONS
    //\\ LOGIC
    while (true) {
        await ns.sleep(1000)
        ns.clearLog()

        ns.print((API.hackTime(ns.getServer(SERVER), ns.getPlayer())))
    }
}

// growPercent(server, threads, player, cores)
/// Calculate the growth multiplier constant for a given server and threads.
/// The actual amount of money grown depends both linearly *and* exponentially on threads; this is only giving the exponential part that is used for the multiplier. See grow for more details.
/// As a result of the above, this multiplier does *not* depend on the amount of money on the server. Changing server.moneyAvailable and server.moneyMax will have no effect.
/// For the most common use-cases, you probably want either formulas.hacking.growThreads or formulas.hacking.growAmount instead.

// growAmount(server, player, threads, cores)
/// Calculate the amount of money a grow action will leave a server with. Starting money is server.moneyAvailable. Note that when simulating the effect of grow, what matters is the state of the server and player when the grow *finishes*, not when it is started.
/// The growth amount depends both linearly *and* exponentially on threads; see grow for more details.
/// The inverse of this function is formulas.hacking.growThreads, although it rounds up to integer threads.

// growThreads(server, player, targetMoney, cores)
/// Calculate how many threads it will take to grow server to targetMoney. Starting money is server.moneyAvailable. Note that when simulating the effect of grow, what matters is the state of the server and player when the grow *finishes*, not when it is started.
/// The growth amount depends both linearly *and* exponentially on threads; see grow for more details.
/// The inverse of this function is formulas.hacking.growAmount, although it can work with fractional threads.

// hackChance(server, player)	Calculate hack chance. (Ex: 0.25 would indicate a 25% chance of success.)
// hackExp(server, player)	Calculate hack exp for one thread.
// hackPercent(server, player)	Calculate hack percent for one thread. (Ex: 0.25 would steal 25% of the server's current value.)


// weakenTime(server, player)	Calculate weaken time.
// growTime(server, player)	Calculate grow time.
// hackTime(server, player)	Calculate hack time.