import { type TransactionInsert } from "@/lib/types/global";
import { type StateCreator } from "zustand";

export type Step2Slice = {
  user: string;
  setUser: (user: string) => void;
  account: string;
  setAccount: (account: string) => void;
  uploadedData: TransactionInsert[] | null;
  setUploadedData: (newData: Step2Slice["uploadedData"]) => void;
  ignoreFirstRow: boolean;
  setIgnoreFirstRow: (newValue: boolean) => void;
};

export const createStep2Slice: StateCreator<Step2Slice> = (set) => ({
  user: "User",
  setUser: (user) => set({ user }),
  account: "Account",
  setAccount: (account) => set({ account }),
  uploadedData: null,
  setUploadedData: (newData) => set({ uploadedData: newData }),
  ignoreFirstRow: false,
  setIgnoreFirstRow: (newValue) => set({ ignoreFirstRow: newValue }),
});
