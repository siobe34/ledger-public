export const setsAreEqual = <T>({ set1, set2 }: { set1: Set<T>; set2: Set<T> }) => {
    if (set1.size === set2.size && [...set1].every((val) => set2.has(val))) return true;
    return false;
};
