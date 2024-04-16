"use client";

import { Button } from "@/components/ui/button";
import { useUploadTransactionsWizard } from "@/lib/store/upload-transactions-wizard/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const Step1Actions = () => {
  const router = useRouter();
  const { colOrder } = useUploadTransactionsWizard();
  const [validationStatus, setValidationStatus] = useState(false);

  const validateStep1 = () => {
    const colOrders = Object.values(colOrder);

    // No duplicate column orders
    const condition1 =
      [...new Set(colOrders)].toString() === colOrders.toString();

    // Col orders must be within range of [1-9]
    const condition2 = colOrders.every((i) =>
      [1, 2, 3, 4, 5, 6, 7, 8, 9].includes(i),
    );

    if (!condition1) {
      toast.error("There is a duplicate value in the Column Orders.");
    }

    if (!condition2) {
      toast.error(
        "Invalid Column Order. The value must be within the range of 1-9.",
      );
    }

    if (condition1 && condition2) {
      toast.success("Ready to proceed to Step 2.");

      setValidationStatus(true);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-8 py-4">
      {/* TODO: implement saving default settings */}
      <Button variant="outlinePrimary">
        Set Current Settings as Default
        <span className="sr-only">
          Save the current settings for loading data as the defaults for next
          time.
        </span>
      </Button>
      <Button onClick={validateStep1}>
        Validate
        <span className="sr-only">Validate current step to proceed.</span>
      </Button>
      <Button
        onClick={() => router.push("/dashboard/transactions/upload?step=2")}
        disabled={!validationStatus}
        aria-disabled={!validationStatus}
      >
        Step 2<span className="sr-only">Proceed to Step 2.</span>
      </Button>
    </div>
  );
};
