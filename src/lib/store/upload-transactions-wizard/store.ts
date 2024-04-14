import {
  createStep1Slice,
  type Step1Slice,
} from "@/lib/store/upload-transactions-wizard/step1slice";
import {
  createStep2Slice,
  type Step2Slice,
} from "@/lib/store/upload-transactions-wizard/step2slice";
import {
  createWizardStepManagerSlice,
  type WizardStepsManager,
} from "@/lib/store/upload-transactions-wizard/wizard-step-manager";
import { create } from "zustand";

export const useUploadTransactionsWizard = create<
  WizardStepsManager & Step1Slice & Step2Slice
>()((...a) => ({
  ...createWizardStepManagerSlice(...a),
  ...createStep1Slice(...a),
  ...createStep2Slice(...a),
}));
