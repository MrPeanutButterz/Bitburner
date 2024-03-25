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
        grow: "/bin/gen/helpers/grow.js",
        weak: "/bin/gen/helpers/weak.js",
        hack: "/bin/gen/helpers/hack.js",
    }
    return path
}

/** @param {NS} ns */
export function consoleLog(ns, msg) {

    // shows toast on script startup 

    ns.tprint(msg)
}

/** @param {NS} ns */
export function getLocalTimeDate(inDate) {

    // returns time.now
    
    var date = new Date();
    date.setTime(inDate.valueOf() + 1000 + 7200000);
    return date;
}