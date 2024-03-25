/** @param {NS} ns */
export function getFactionShopList(ns, faction) {

	//returns (array) an orderd list based on price from hi / low, with pre installs before the required augmentation

	let f_augmentations = ns.singularity.getAugmentationsFromFaction(faction)
	let p_augmentations = ns.singularity.getOwnedAugmentations(true)

	for (let i = 0; i < p_augmentations.length; i++) {

		if (f_augmentations.includes(p_augmentations[i])) {
			f_augmentations.splice(f_augmentations.indexOf(p_augmentations[i]), 1)
		}
	}

	f_augmentations.sort(function (a, b) { return a.price - b.price })

	let buyList = []
	for (let item of f_augmentations) {

		if (ns.singularity.getAugmentationPrereq(item).length > 0) {

			let preRequired = ns.singularity.getAugmentationPrereq(item)
			for (let preRequire of preRequired) {

				buyList.push(preRequire)
			}
		}
		buyList.push(item)
	}
	return buyList
}