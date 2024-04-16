"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUploadTransactionsWizard } from "@/lib/store/upload-transactions-wizard/store";
import { createRef } from "react";
import { toast } from "sonner";

export const Step2FileUploader = () => {
  const fileRef = createRef<HTMLInputElement>();
  const { ignoreFirstRow, requiredCols, setUploadedData } =
    useUploadTransactionsWizard();

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
    const json = CSVtoJSON({ csv, headers: requiredCols, ignoreFirstRow });

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
        onClick={handleBrowseForFile}
        className="self-center justify-self-center"
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
