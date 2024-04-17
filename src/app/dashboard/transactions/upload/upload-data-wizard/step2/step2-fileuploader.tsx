"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { csvToJson } from "@/lib/csvToJson";
import { sanitizeTransactionData } from "@/lib/sanitizeTransactionData";
import { insertTransactionsArraySchema } from "@/lib/schemas/trpc-inputs";
import { useUploadTransactionsWizard } from "@/lib/store/upload-transactions-wizard/store";
import {
  addAccUserToJson,
  addMissingKeysToJson,
  getTransactionsCsvHeaders,
} from "@/lib/transactions-parsing-helpers";
import { createRef } from "react";
import { toast } from "sonner";

type Props = {
  categories: string[];
  users: string[];
};

export const Step2FileUploader = ({ categories, users }: Props) => {
  const fileRef = createRef<HTMLInputElement>();
  const {
    account,
    colOrder,
    dataCols,
    ignoreFirstRow,
    requiredCols,
    setUploadedData,
    user,
  } = useUploadTransactionsWizard();

  let disableBrowseButton = false;
  if (!requiredCols.includes("account") && account === "Account") {
    disableBrowseButton = true;
  }
  if (!requiredCols.includes("user") && user === "User") {
    disableBrowseButton = true;
  }

  const handleFileSelection = async () => {
    const currentRef = fileRef.current;
    if (!currentRef) return;

    const files = currentRef.files;

    if (!files) {
      toast.error("No file selected. Please try again.");
      return;
    }

    if (!files[0]) {
      toast.error("Unexpected error selecting a file. Please try again.");
      return;
    }

    if (files[0].type !== "text/csv") {
      toast.error("Files can only be uploaded in CSV format.");
      return;
    }

    const filePromise = await fetch(URL.createObjectURL(files[0]));
    const fileText = await filePromise.text();

    const headers = getTransactionsCsvHeaders({ colOrder, requiredCols });
    const json = csvToJson({ csv: fileText, headers, ignoreFirstRow });

    const jsonWithAllKeys = addMissingKeysToJson({
      json,
      dataCols,
      requiredCols,
    });

    const finalJson = addAccUserToJson({
      json: jsonWithAllKeys,
      account,
      requiredCols,
      user,
    });

    const preProcessedData = sanitizeTransactionData(finalJson);

    const zodParser = insertTransactionsArraySchema.safeParse(preProcessedData);

    if (!zodParser.success) {
      toast.error(
        "The file you selected doesn't seem to have data in the shape you defined in Step 1. Please go back and try again.",
      );

      return;
    }

    const parsedData = zodParser.data;

    setUploadedData(parsedData);
  };

  const handleBrowseForFile = () => {
    const currentRef = fileRef.current;
    if (!currentRef) return;

    currentRef.click();
  };

  return (
    <>
      <Input
        ref={fileRef}
        type="file"
        className="hidden"
        onChange={handleFileSelection}
      />
      <Button
        size="lg"
        className="self-center justify-self-center"
        onClick={handleBrowseForFile}
        disabled={disableBrowseButton}
        aria-disabled={disableBrowseButton}
      >
        Browse
        <span className="sr-only">Browse for a file to upload.</span>
      </Button>
    </>
  );
};
