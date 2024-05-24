import { scriptStart, scriptPath } from "lib/scripting"
import { getFactionNames } from "lib/factions"
import { canRunOnHome } from "/lib/network"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    scriptStart(ns)

    //\\ GENERAL DATA
    const FLAGS = ns.flags([["story", false]])
    const SCRIPT = scriptPath(ns)

    let TOP_CANDIDATE

    //\\ FUNCTIONS 
    function calculateTopRep(f) {

        let topRep = 0
        let augmentations = ns.singularity.getAugmentationsFromFaction(f)
        augmentations.splice(augmentations.findIndex(i => i === "NeuroFlux Governor"), 1)
        augmentations.forEach(augmentation => {

            let augmentationReputation = ns.singularity.getAugmentationRepReq(augmentation)
            if (!ownAugmentation(augmentation) && augmentationReputation > topRep) {
                topRep = augmentationReputation
            }
        })
        return Math.ceil(topRep)
    }

    function ownAugmentation(augmentation) {

        // return true if its owned
        return Boolean(ns.singularity.getOwnedAugmentations(true).find(e => e === augmentation))
    }

    function checkAugemtationsLeft(f) {

        let augmentationLeft = true
        let augmentations = ns.singularity.getAugmentationsFromFaction(f)

        augmentations.forEach(a => {
            if (!ownAugmentation(a)) {
                augmentationLeft = false
            }
        })
        return augmentationLeft
    }

    function excludeGang(factions) {

        // exclude the gang from faction list

        if (ns.gang.inGang()) {

            let gang = ns.gang.getGangInformation().faction
            let newList = factions
            newList = newList.filter(e => e !== gang);
            return newList

        } else {

            return factions
        }
    }

    function getTopCandidate(factions) {

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

    async function followUpScript(script, candidate) {

        while (true) {
            if (canRunOnHome(ns, script)) {

                FLAGS.story ?
                    ns.spawn(script, { threads: 1, spawnDelay: 500 }, candidate, "--story") :
                    ns.spawn(script, { threads: 1, spawnDelay: 500 }, candidate)

            } else {

                await ns.sleep(1000)
            }
        }
    }

    //\\ MAIN LOGIC
    FLAGS.story ?
        TOP_CANDIDATE = getTopCandidate(excludeGang(["Sector-12", "CyberSec", "Tian Di Hui", "NiteSec", "The Black Hand", "BitRunners", "Daedalus"])) :
        TOP_CANDIDATE = getTopCandidate(excludeGang(getFactionNames(ns)))

    if (ownAugmentation("The Red Pill") && canRunOnHome(ns, SCRIPT.killBN)) { ns.run(SCRIPT.killBN, 1) }

    if (TOP_CANDIDATE.name !== "RedPillTime") {

        if (!accepted(TOP_CANDIDATE.name)) {

            // requirements
            ns.closeTail()
            ns.tprint("Working on requirements for " + TOP_CANDIDATE.name)
            await followUpScript(SCRIPT.requirement, TOP_CANDIDATE.name)

        } else if (ns.singularity.getFactionRep(TOP_CANDIDATE.name) < TOP_CANDIDATE.rep) {

            // reputation 
            ns.closeTail()
            ns.tprint("Acquiring reputation at " + TOP_CANDIDATE.name)
            await followUpScript(SCRIPT.reputation, TOP_CANDIDATE.name)

        } else {

            // install
            ns.closeTail()
            ns.tprint("Installing augmentations from " + TOP_CANDIDATE.name)
            await followUpScript(SCRIPT.install, TOP_CANDIDATE.name)
        }

    } else {

        ns.tprint("Follow the white rabbit...")
        ns.tprint("Knock, knock, Neo.")

        // find faction with most favor en keep installing neuroflux over en over 
    }
}
