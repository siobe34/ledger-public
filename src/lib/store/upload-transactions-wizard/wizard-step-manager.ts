import { type StateCreator } from "zustand";

export type WizardStepsManager = {
  activeStep: 1 | 2 | 3;
  buttonStates: Record<
    WizardStepsManager["activeStep"],
    { canGoNext: boolean; canGoPrev: boolean }
  >;
  enableNext: () => void;
  goNextStep: () => void;
  goPrevStep: () => void;
};

export const createWizardStepManagerSlice: StateCreator<WizardStepsManager> = (
  set,
) => ({
  activeStep: 1,
  buttonStates: {
    1: { canGoNext: false, canGoPrev: false },
    2: { canGoNext: false, canGoPrev: false },
    3: { canGoNext: false, canGoPrev: false },
  },
  enableNext: () =>
    set((state) => {
      if (state.activeStep === 3) return state;

      return {
        buttonStates: {
          ...state.buttonStates,
          [state.activeStep]: {
            canGoNext: true,
            canGoPrev: state.buttonStates[state.activeStep].canGoPrev,
          },
        },
      };
    }),
  goNextStep: () =>
    set((state) => {
      const currentActiveStep = state.activeStep;
      const currentButtonStates = { ...state.buttonStates };

      if (currentActiveStep === 3) return state;

      const newActiveStep = (currentActiveStep + 1) as typeof state.activeStep;

      const currentButtonStateForStep = {
        ...currentButtonStates[newActiveStep],
      };

      const newButtonStates = {
        ...currentButtonStates,
        ...currentButtonStates,
        [newActiveStep]: { ...currentButtonStateForStep, canGoPrev: true },
      };

      return { activeStep: newActiveStep, buttonStates: newButtonStates };
    }),
  goPrevStep: () =>
    set((state) => ({
      activeStep: (state.activeStep - 1) as WizardStepsManager["activeStep"],
    })),
});
