/** @param {NS} ns */
export function sleepTime(ns) {

    // return script sleep time (number)

    const sleepTime = {
        ms1: 50,
        ms2: 200,
        s1: 1000,
        s2: 2000,
        s3: 5000,
        toast: 2000,
    }
    return sleepTime
}

/** @param {NS} ns */
export function scriptPath(ns) {

    // returns path to any script used in operation (string array)

    const path = {
        grow: "/bin/genesis/pck_grow.js",
        weak: "/bin/genesis/pck_weak.js",
        hack: "/bin/genesis/pck_hack.js",
        gwh: "/bin/genesis/sqn_gwh.js",
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