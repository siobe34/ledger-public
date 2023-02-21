export interface ITable<THeaders, TValues> {
    headers: { [key: number]: THeaders };
    values: TValues[];
}

export interface ITableEditable<THeaders, TValues> {
    layoutId: string;
    editable?: boolean;
    headers: { [key: number]: THeaders };
    editableHeaders?: THeaders[];
    values: TValues[];
    setValues: React.Dispatch<React.SetStateAction<TValues[] | undefined>>;
}
