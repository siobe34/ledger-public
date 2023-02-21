export interface IList {
    values: Array<string | number | boolean>;
    setValues: React.Dispatch<React.SetStateAction<IList["values"] | undefined>>;
    layoutId: string;
}
