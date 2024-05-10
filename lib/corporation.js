/** @param {NS} ns */
export function getNewDivisions(ns) {

    // @returns (array) of division type, name

    return [
        { type: "Agriculture", name: "AGRCL" },
        { type: "Spring Water", name: "SPRNG" },
        { type: "Restaurant", name: "RESTO" },
        { type: "Tobacco", name: "TOBCO" },
        { type: "Software", name: "SOFTW" },
        { type: "Refinery", name: "REFIN" },
        { type: "Chemical", name: "CHEMI" },
        { type: "Fishing", name: "FISHY" },
        { type: "Water Utilities", name: "WATUT" },
        { type: "Pharmaceutical", name: "PHRMA" },
        { type: "Mining", name: "MINE" },
        { type: "Computer Hardware", name: "CPHW" },
        { type: "Real Estate", name: "RLST8" },
        { type: "Healthcare", name: "HLTHC" },
        { type: "Robotics", name: "ROBO" },
        { type: "Agriculture", name: "FARMG" },
        { type: "Software", name: "CODE" },
        { type: "Real Estate", name: "ESTAT" },
        { type: "Healthcare", name: "MEDIC" },
        { type: "Robotics", name: "BOTIC" },
    ]
}

export function getResearchMaterialDivisions(ns) {

    // @returns (array) of research names for all divisions

    return [
        "Hi-Tech R&D Laboratory",
        "AutoBrew",
        "AutoPartyManager",
        "Drones",
        "Drones - Assembly",
        "Drones - Transport",
        "Self-Correcting Assemblers",
        "Automatic Drug Administration",
        "CPH4 Injections",
        "Go-Juice",
        "Overclock",
        "Sti.mu",
        "Market-TA.I",
        "Market-TA.II",
    ]
}

export function getResearchProductDivisions(ns) {

    // @returns (array) of research names for product based divisions

    return [
        "uPgrade: Fulcrum",
        "uPgrade: Dashboard",
        "uPgrade: Capacity.I",
        "uPgrade: Capacity.II",
    ]
}