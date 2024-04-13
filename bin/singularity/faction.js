import { scriptStart, scriptPath } from "modules/scripting"
import { getFactionNames } from "modules/factions"

/** @param {NS} ns */
export async function main(ns) {

    /* path of reps: 
    find faction with lowest reputation needed
    */

    /* path of succes: 
    NetBurners: all
    Sector12: CashRoot Starter Kit, NeuroFlux++
    Csec: all
    NiteSec: all
    The Black Hand: all (takes a long time...)
    BitRunners: all (takes a long time...)
    Daedalus: all

    Must have one more in order to get 30 augmentations
    */

    // make script run with flags --path
    // script will loop back at self between requirements, reputation, install

    // get all factions
    // get augmentations with most reputation
    // sort factions on that 
    // pick faction with least work
    // if not member check open invites 
    // run requirements
    // run reputation 
    // run install 
    // take red pill

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA
    const SCRIPT = scriptPath(ns)

    //\\ FUNCTIONS 
    function calculateTopRep(f) {

        let topRep = 0
        let augmentations = ns.singularity.getAugmentationsFromFaction(f)
        augmentations.splice(augmentations.findIndex(i => i === "NeuroFlux Governor"), 1)
        augmentations.forEach(augmentation => {

            let augmentationReputation = ns.singularity.getAugmentationRepReq(augmentation)
            if (!ownedAugmentation(augmentation) && augmentationReputation > topRep) {
                topRep = augmentationReputation
            }
        })
        return Math.ceil(topRep)
    }

    function ownedAugmentation(augmentation) {

        // return true if its owned
        return Boolean(ns.singularity.getOwnedAugmentations(true).find(e => e === augmentation))
    }

    function checkAugemtationsLeft(f) {

        let augmentationLeft = true
        let augmentations = ns.singularity.getAugmentationsFromFaction(f)

        augmentations.forEach(a => {
            if (!ownedAugmentation(a)) {
                augmentationLeft = false
            }
        })
        return augmentationLeft
    }

    function getTopCandidate() {

        let factions = getFactionNames(ns)
        let candidates = []

        factions.forEach(faction => {
            candidates.push({
                name: faction,
                rep: calculateTopRep(faction),
                isDone: checkAugemtationsLeft(faction)
            })
        })

        // remove with no augmentations
        candidates = candidates.filter((item) => item.isDone !== true)
        candidates.sort((a, b) => a.rep - b.rep)
        return candidates.length > 0 ? candidates[0] : { name: "RedPillTime" }
    }

    function accepted(f) {
        return Boolean(ns.getPlayer().factions.find(i => i === f))
    }

    //\\ MAIN LOGIC
    let topCandidate = getTopCandidate()

    if (topCandidate.name !== "RedPillTime") {

        let factionRep = ns.singularity.getFactionRep(topCandidate.name)

        if (!accepted(topCandidate.name)) {

            // requirements
            ns.closeTail()
            ns.tprint("Working on requirements for " + topCandidate.name)
            ns.spawn(SCRIPT.requirement, { threads: 1, spawnDelay: 500 }, topCandidate.name)

        } else if (factionRep < topCandidate.rep) {

            // reputation 
            ns.closeTail()
            ns.tprint("Acquiring reputation at " + topCandidate.name)
            ns.spawn(SCRIPT.reputation, { threads: 1, spawnDelay: 500 }, topCandidate.name)

        } else {

            // install
            ns.closeTail()
            ns.tprint("Installing augmentations from " + topCandidate.name)
            ns.spawn(SCRIPT.install, { threads: 1, spawnDelay: 500 }, topCandidate.name)

        }

    } else {

        ns.tprint("End of the road...")

        // kill bitnode 

        // if (redPill()) {

        //     // ns.tprint("Its time to take the red pill")
        //     // ns.run(script.killBitnode, 1)
        // }

    }
}
