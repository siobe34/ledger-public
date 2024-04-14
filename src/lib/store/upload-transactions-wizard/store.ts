import {
  createStep1Slice,
  type Step1Slice,
} from "@/lib/store/upload-transactions-wizard/step1slice";
import {
  createStep2Slice,
  type Step2Slice,
} from "@/lib/store/upload-transactions-wizard/step2slice";
import { create } from "zustand";

export const useUploadTransactionsWizard = create<Step1Slice & Step2Slice>()(
  (...a) => ({
    ...createStep1Slice(...a),
    ...createStep2Slice(...a),
  }),
);
