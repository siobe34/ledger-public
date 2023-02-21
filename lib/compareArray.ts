// * Func to compare if 2 arrays have the same items
// * Arrays need to be provided in a sorted state
export const compareArrays = (arr1: Object, arr2: Object) => (JSON.stringify(arr1) === JSON.stringify(arr2) ? true : false);
