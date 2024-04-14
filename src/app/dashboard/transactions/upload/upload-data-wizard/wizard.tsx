import { Step1 } from "@/app/dashboard/transactions/upload/upload-data-wizard/step1/step1";
import { Step1Actions } from "@/app/dashboard/transactions/upload/upload-data-wizard/step1/step1-actions";
import { Step2 } from "@/app/dashboard/transactions/upload/upload-data-wizard/step2/step2";
import { Step2Actions } from "@/app/dashboard/transactions/upload/upload-data-wizard/step2/step2-actions";
import { Step3 } from "@/app/dashboard/transactions/upload/upload-data-wizard/step3/step3";

const VALID_STEPS = [1, 2, 3];

export const UploadDataWizard = ({ step }: { step: number }) => {
  if (!VALID_STEPS.includes(step))
    throw new Error(
      "Invalid URL, please go to Dashboard home page and try again.",
    );

  return (
    <>
      {step === 1 && (
        <>
          <Step1Actions />
          <Step1 />
        </>
      )}
      {step === 2 && (
        <>
          <Step2Actions />
          <Step2 />
        </>
      )}

      {step === 3 && <Step3 />}
    </>
  );
};
