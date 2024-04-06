/** @param {NS} ns */
export function scriptPath(ns) {

    // returns path to any script used in operation (string array)

    const path = {
        grow: "/bin/genesis/pck_grow.js",
        weak: "/bin/genesis/pck_weak.js",
        hack: "/bin/genesis/pck_hack.js",
        gwh: "/bin/genesis/sqn_gwh.js",
        wgh: "/bin/genesis/sqn_wgh.js",
        gw: "/bin/genesis/sqn_gw.js",
    }
    return path
}

/** @param {NS} ns */
export function getLocalTimeDate(inDate) {

    // returns time.now

    var date = new Date();
    date.setTime(inDate.valueOf() + 1000 + 7200000);
    return date;
}

/** @param {NS} ns */
export function colorPrint(ns, color, msg) {

    // print text in colors

    const colors = {
        black: "\u001b[30m",
        red: "\u001b[31m",
        green: "\u001b[32m",
        yellow: "\u001b[33m",
        blue: "\u001b[34m",
        magenta: "\u001b[35m",
        cyan: "\u001b[36m",
        white: "\u001b[37m",
        brightBlack: "\u001b[30;1m",
        brightRed: "\u001b[31;1m",
        brightGreen: "\u001b[32;1m",
        brightYellow: "\u001b[33;1m",
        brightBlue: "\u001b[34;1m",
        brightMagenta: "\u001b[35;1m",
        brightCyan: "\u001b[36;1m",
        brightWhite: "\u001b[37;1m",
        reset: "\u001b[0m"
    }

    ns.print(`${colors[color]}` + msg);
}