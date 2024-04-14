import { type StateCreator } from "zustand";

export type Step2Slice = {
  uploadedData: Record<string, string>[] | null;
  setUploadedData: (newData: Record<string, string>[]) => void;
};

export const createStep2Slice: StateCreator<Step2Slice> = (set) => ({
  uploadedData: null,
  setUploadedData: (newData) => set({ uploadedData: newData }),
});
