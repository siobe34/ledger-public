import {
  createStep1Slice,
  type Step1Slice,
} from "@/lib/store/upload-transactions-wizard/step1slice";
import {
  createWizardStepManagerSlice,
  type WizardStepsManager,
} from "@/lib/store/upload-transactions-wizard/wizard-step-manager";
import { create } from "zustand";

export const useUploadTransactionsWizard = create<
  WizardStepsManager & Step1Slice
>()((...a) => ({
  ...createWizardStepManagerSlice(...a),
  ...createStep1Slice(...a),
}));
