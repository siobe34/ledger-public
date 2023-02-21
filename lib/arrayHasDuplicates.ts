// * Func to determine if an array of primitives has any duplicates
export const arrayPrimsHasDuplicates = (array: Array<string | boolean | number>) => {
    return new Set(array).size !== array.length;
};

// * Func to determine if an array of objects has duplicates given the keys to check in the object
// * This function assumes the keys provided exist in all of the objects in the array and will not work otherwise
export const arrayObjsHasDuplicates = (keys: string[], objects: Record<string, any>[]) => {
    // * Initialize new Set to store objects values
    const objectKeysSet = new Set<string>();

    // * Map over each object in the array
    const hasDupe = objects.map((obj) => {
        // * Map over the provided keys and get the corresponding values in lowercase string format
        const keysCombination = keys
            .map((key) => obj[key])
            .toString()
            .toLowerCase();

        // * If the string already exists in the set then return true because duplicate exists
        if (objectKeysSet.has(keysCombination)) {
            return true;
        }

        // * If the string does not exist in the set then add it to the set
        objectKeysSet.add(keysCombination);

        // * If at the end of mapping through all keys none of the values in the Set are duplicated then return false for no duplicates
        return false;
    });

    // * If even a single object in the array contains a duplicate then return true for duplicates existing
    if (hasDupe.includes(true)) return true;

    // * If none of the objects in the array contain duplicates then return false for no duplicates existing
    return false;
};
