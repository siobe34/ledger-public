"use client";

import { Button } from "@/components/ui/button";
import { useUploadTransactionsWizard } from "@/lib/store/upload-transactions-wizard/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Step2Actions = () => {
  const router = useRouter();
  const [validationStatus, setValidationStatus] = useState(false);
  const { uploadedData } = useUploadTransactionsWizard();

  useEffect(() => {
    if (!uploadedData) return;

    toast.success("Ready to proceed to Step 3.");

    setValidationStatus(true);
  }, [uploadedData]);

  return (
    <div className="flex flex-wrap items-center justify-center gap-8 py-4">
      <Button
        onClick={() => router.push("/dashboard/transactions/upload?step=3")}
        disabled={!validationStatus}
        aria-disabled={!validationStatus}
      >
        Step 3<span className="sr-only">Proceed to Step 3.</span>
      </Button>
    </div>
  );
};
