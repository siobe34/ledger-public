export const arrayHasEmpty = (array: Array<string | boolean | number>) => {
    if (array.includes("")) return true;
    return false;
};
