"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUploadTransactionsWizard } from "@/lib/store/upload-transactions-wizard/store";
import { createRef } from "react";
import { toast } from "sonner";

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

    convertAndSaveData(fileText);
  };

  const handleBrowseForFile = () => {
    const currentRef = fileRef.current;
    if (!currentRef) return;

    currentRef.click();
  };

  const convertAndSaveData = (csv: string) => {
    const sortedColOrder = Object.entries(colOrder).sort(
      ([_a, a], [_b, b]) => a - b,
    );

    const headers = sortedColOrder
      .filter(([col]) => requiredCols.includes(col))
      .map(([col]) => col);

    let json = CSVtoJSON({ csv, headers, ignoreFirstRow });

    if (!requiredCols.includes("Account")) {
      json = json.map((x) => ({ ...x, Account: account }));
    }

    if (!requiredCols.includes("User")) {
      json = json.map((x) => ({ ...x, User: user }));
    }

    const missingCols = dataCols.filter((col) => !requiredCols.includes(col));

    missingCols.forEach((key) => {
      json = json.map((x) => ({ ...x, [key]: "" }));
    });

    setUploadedData(json);
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
