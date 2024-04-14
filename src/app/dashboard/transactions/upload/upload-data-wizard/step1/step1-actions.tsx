"use client";

import { Button } from "@/components/ui/button";
import { useUploadTransactionsWizard } from "@/lib/store/upload-transactions-wizard/store";
import { toast } from "sonner";

export const Step1Actions = () => {
  const { colOrder, enableNext } = useUploadTransactionsWizard();
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
        "Invalid column order. The value must be within the range of 1-9.",
      );
    }

    if (condition1 && condition2) {
      toast.success("Next step ready.");
      enableNext();
    }
  };
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 py-4">
      {/* TODO: implement saving default settings */}
      <Button variant="outlinePrimary">Set Current Settings as Default</Button>
      <Button onClick={validateStep1}>Validate</Button>
    </div>
  );
};