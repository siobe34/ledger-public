import { type StateCreator } from "zustand";

// TODO: move to constant file
const DEFAULT_DATA_COLS = [
  "transactionDate",
  "description",
  "debit",
  "credit",
  "balance",
  "category",
  "user",
  "account",
  "comments",
];

const DEFAULT_COL_ORDER = {
  transactionDate: 1,
  description: 2,
  debit: 3,
  credit: 4,
  balance: 5,
  category: 6,
  user: 7,
  account: 8,
  comments: 9,
} as const;

export type Step1Slice = {
  dataCols: typeof DEFAULT_DATA_COLS;
  requiredCols: Array<(typeof DEFAULT_DATA_COLS)[number]>;
  colOrder: Record<Step1Slice["dataCols"][number], number>;
  setAReqCol: (col: (typeof DEFAULT_DATA_COLS)[number]) => void;
  removeAReqCol: (col: (typeof DEFAULT_DATA_COLS)[number]) => void;
  setColOrder: ({
    col,
    newOrder,
  }: {
    col: (typeof DEFAULT_DATA_COLS)[number];
    newOrder: number;
  }) => void;
};

export const createStep1Slice: StateCreator<Step1Slice> = (set) => ({
  dataCols: DEFAULT_DATA_COLS,
  requiredCols: DEFAULT_DATA_COLS,
  colOrder: DEFAULT_COL_ORDER,
  setAReqCol: (col) =>
    set((state) => {
      if (state.requiredCols.includes(col)) return state;

      return { requiredCols: [...state.requiredCols, col] };
    }),
  removeAReqCol: (col) =>
    set((state) => {
      if (!state.requiredCols.includes(col)) return state;

      return { requiredCols: state.requiredCols.filter((i) => i !== col) };
    }),
  setColOrder: ({ col, newOrder }) =>
    set((state) => ({ colOrder: { ...state.colOrder, [col]: newOrder } })),
});
