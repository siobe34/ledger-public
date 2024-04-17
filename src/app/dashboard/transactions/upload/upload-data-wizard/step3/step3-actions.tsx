"use client";

import { Button } from "@/components/ui/button";
import { sanitizeTransactionData } from "@/lib/sanitizeTransactionData";
import { useUploadTransactionsWizard } from "@/lib/store/upload-transactions-wizard/store";
import { type TransactionInsert } from "@/lib/types/global";
import { insertTransactionSchema } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const Step3Actions = () => {
  const [validationStatus, setValidationStatus] = useState(false);
  const { tableData } = useUploadTransactionsWizard();

  const [data, setData] = useState<TransactionInsert[] | null>(null);

  const { mutate: dbUploadTransactions } = api.transactions.create.useMutation({
    onError: () => {
      toast.error(
        "Unexpected error trying to save Transaction data, please try again.",
      );
    },
    onSuccess: () => {
      toast.success(
        "Successfully saved Transactions data. You can view it on the View Transactions page.",
      );
    },
  });

  const validateStep3 = () => {
    const preprocessedJsonData = sanitizeTransactionData(
      tableData as Record<string, string>[],
    );

    const zodParser = z
      .array(insertTransactionSchema)
      .safeParse(preprocessedJsonData);

    if (zodParser.success) {
      toast.success("Data successfully validated. Don't forget to save it!");
      const parsedData = zodParser.data;

      setValidationStatus(true);
      setData(parsedData);
    } else {
      // TODO: identify which rows of the table the errors are in or some additional information
      toast.error("Errors while parsing data.");
    }
  };

  const handleDataUpload = () => {
    if (!data) return;
    dbUploadTransactions(data);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-8 py-4">
      <Button onClick={validateStep3}>
        Validate
        <span className="sr-only">Validate current step to proceed.</span>
      </Button>
      <Button
        onClick={handleDataUpload}
        disabled={!validationStatus}
        aria-disabled={!validationStatus}
      >
        Save
        <span className="sr-only">Save Transactions to database.</span>
      </Button>
    </div>
  );
};
