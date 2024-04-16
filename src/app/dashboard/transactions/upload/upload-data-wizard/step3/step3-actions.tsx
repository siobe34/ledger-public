"use client";

import { Button } from "@/components/ui/button";
import { useUploadTransactionsWizard } from "@/lib/store/upload-transactions-wizard/store";
import { insertTransactionSchema } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const Step3Actions = () => {
  const router = useRouter();
  const [validationStatus, setValidationStatus] = useState(false);
  const { tableData } = useUploadTransactionsWizard();

  const [data, setData] = useState<
    z.infer<typeof insertTransactionSchema>[] | null
  >(null);

  const { mutate: dbUploadTransactions } = api.transactions.create.useMutation({
    onError: () => {
      toast.error(
        "Unexpected error trying to save Transaction data, please try again.",
      );
    },
    onSuccess: () => {
      router.push("/dashboard/transactions");
    },
  });

  const validateStep3 = () => {
    const preprocessedJsonData = sanitizeData(
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

const sanitizeData = (rawData: Record<string, string | number | Date>[]) => {
  return rawData.map((rawTransaction, idx) => {
    const transaction: Record<string, string | number | Date> = {};

    if (rawTransaction.Date) {
      transaction.Date = new Date(rawTransaction.Date);
    }

    if (rawTransaction.Debit) {
      transaction.Debit =
        rawTransaction.Debit === ""
          ? "0.00"
          : parseFloat(rawTransaction.Debit.toString()).toFixed(2).toString();
    }

    if (rawTransaction.Credit) {
      transaction.Credit =
        rawTransaction.Credit === ""
          ? "0.00"
          : parseFloat(rawTransaction.Credit.toString()).toFixed(2).toString();
    }

    if (rawTransaction.Balance) {
      transaction.Balance =
        rawTransaction.Balance === ""
          ? "0.00"
          : parseFloat(rawTransaction.Balance.toString()).toFixed(2).toString();
    }

    return {
      sequence: idx + 1,
      transactionDate: transaction.Date,
      description: rawTransaction.Description,
      debit: transaction.debit ?? "0.00",
      credit: transaction.credit ?? "0.00",
      balance: transaction.balance ?? "0.00",
      user: rawTransaction.User,
      account: rawTransaction.Account,
      category: rawTransaction.Category,
      comments: rawTransaction.Comments,
    };
  });
};
