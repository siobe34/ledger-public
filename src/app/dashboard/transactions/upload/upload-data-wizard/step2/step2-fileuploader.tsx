"use client";

import { sanitizeData } from "@/app/dashboard/transactions/upload/upload-data-wizard/step3/step3-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUploadTransactionsWizard } from "@/lib/store/upload-transactions-wizard/store";
import { insertTransactionSchema } from "@/server/db/schema";
import { createRef } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const Step2FileUploader = () => {
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

    const convertedToJson = convertData(fileText);
    const parsedJson = parseData(convertedToJson);

    if (!parsedJson) return;

    setUploadedData(parsedJson);
  };

  const convertData = (csv: string) => {
    const sortedColOrder = Object.entries(colOrder).sort(
      ([_a, a], [_b, b]) => a - b,
    );

    const headers = sortedColOrder
      .filter(([col]) => requiredCols.includes(col))
      .map(([col]) => col);

    let json = CSVtoJSON({ csv, headers, ignoreFirstRow });

    const missingCols = dataCols.filter((col) => !requiredCols.includes(col));

    missingCols.forEach((key) => {
      json = json.map((x) => ({ ...x, [key]: "" }));
    });

    if (!requiredCols.includes("account")) {
      json = json.map((x) => ({ ...x, account: account }));
    }

    if (!requiredCols.includes("user")) {
      json = json.map((x) => ({ ...x, user: user }));
    }

    return json;
  };

  const parseData = (unparsedData: Record<string, string>[]) => {
    const preProcessedData = sanitizeData(unparsedData);

    const zodParser = z
      .array(insertTransactionSchema)
      .safeParse(preProcessedData);

    if (zodParser.success) {
      const parsedData = zodParser.data;

      return parsedData;
    } else {
      toast.error(
        "The file you selected doesn't seem to have data in the shape you defined in Step 1. Please go back and try again.",
      );
      return null;
    }
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

export const CSVtoJSON = ({
  csv,
  headers,
  ignoreFirstRow = false,
}: {
  csv: string;
  headers: string[];
  ignoreFirstRow?: boolean;
}) => {
  const rows = csv.split("\n").filter((row) => row !== "");

  if (ignoreFirstRow) rows.shift();

  const json = rows.map((row) => {
    // * Split the current row into an array of values and remove any potential whitespaces
    const values = row.split(",").map((val) => val.replace(/\s+/g, " ").trim());

    const rowObject: Record<string, string> = {};

    headers.forEach((key, index) => {
      rowObject[key] = values[index] ?? "";
    });

    return rowObject;
  });

  return json;
};
