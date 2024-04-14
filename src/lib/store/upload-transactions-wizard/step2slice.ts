import { type StateCreator } from "zustand";

export type Step2Slice = {
  user: string;
  setUser: (user: string) => void;
  account: string;
  setAccount: (account: string) => void;
  uploadedData: Record<string, string>[] | null;
  setUploadedData: (newData: Record<string, string>[]) => void;
};

export const createStep2Slice: StateCreator<Step2Slice> = (set) => ({
  user: "User",
  setUser: (user) => set({ user }),
  account: "Account",
  setAccount: (account) => set({ account }),
  uploadedData: null,
  setUploadedData: (newData) => set({ uploadedData: newData }),
});
