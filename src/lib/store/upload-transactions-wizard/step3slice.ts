import { type StateCreator } from "zustand";

export type Step3Slice = {
  tableData: unknown[];
  setTableData: (newData: unknown[]) => void;
};

export const createStep3Slice: StateCreator<Step3Slice> = (set) => ({
  tableData: [],
  setTableData: (newData) => set({ tableData: newData }),
});
