"use client";

import { insertTransactionSchema } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { createRef } from "react";
import { z } from "zod";

export default function UploadTransactionsPage() {
  const inputRef = createRef<HTMLInputElement>();

  const test = api.transactions.create.useMutation();
  const loadCSVData = async () => {
    const file = inputRef.current?.files;

    // If no file exists or not a CSV file
    if (!file || !file[0] || file[0].type !== "text/csv") {
      return [];
    }

    const CSVPromise = await fetch(URL.createObjectURL(file[0]));
    const CSVFile = await CSVPromise.text();

    const rawData = CSVtoJSON(CSVFile, [
      // "sequence",
      // "transactionDate",
      // "description",
      // "debit",
      // "credit",
      // "balance",
      // "user",
      // "account",
      // "category",
      // "comments",
      "sequence",
      "account",
      "balance",
      "credit",
      "transactionDate",
      "debit",
      "description",
      "user",
      "category",
      "comments",
    ]);

    const sanitizedData = rawData.map((rawTransaction) => {
      const transaction: { [key: string]: string | number | Date } = {
        ...rawTransaction,
      };
      if (rawTransaction["sequence"]) {
        transaction["sequence"] = +rawTransaction.sequence || "";
      }
      if (rawTransaction["transactionDate"]) {
        transaction["transactionDate"] = new Date(
          rawTransaction.transactionDate,
        );
      }
      if (rawTransaction["debit"] || rawTransaction["debit"] === "") {
        transaction["debit"] =
          rawTransaction.debit === ""
            ? "0.00"
            : parseFloat(rawTransaction.debit).toFixed(2).toString();
      }
      if (rawTransaction["credit"] || rawTransaction["credit"] === "") {
        transaction["credit"] =
          rawTransaction.credit === ""
            ? "0.00"
            : parseFloat(rawTransaction.credit).toFixed(2).toString();
      }
      if (rawTransaction["balance"] || rawTransaction["balance"] === "") {
        transaction["balance"] =
          rawTransaction.balance === ""
            ? "0.00"
            : parseFloat(rawTransaction.balance).toFixed(2).toString();
      }

      return { ...transaction };
    });

    return sanitizedData;
  };

  const uploadTransactions = async () => {
    const csvData = await loadCSVData();
    const zodParse = z.array(insertTransactionSchema).safeParse(csvData);

    if (zodParse.success) {
      const parsedData = zodParse.data;
      console.log("zod success", parsedData);
      test.mutate(parsedData);
    } else {
      console.log("zod error", zodParse.error.errors);
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <a
        href="/"
        className="rounded border border-blue-500 bg-blue-500 px-4 py-2 text-white hover:bg-blue-800 hover:text-slate-300"
      >
        Home
      </a>
      <input
        ref={inputRef}
        type="file"
        onChange={(event) => {
          uploadTransactions();
          // Set input value to empty string so user can select the same file again while still triggering onChange event
          event.target.value = "";
        }}
        className="hidden"
      />

      <button
        className="bg-blue-500 px-4 py-2 text-white hover:opacity-85"
        onClick={() => inputRef.current?.click()}
      >
        Upload Data
      </button>
    </main>
  );
}

export const CSVtoJSON = (CSV: string, headers: string[]) => {
  const rows = CSV.split("\n").filter((row) => row !== "");

  const json = rows.map((row) => {
    // * Split the current row into an array of values and remove any potential whitespaces
    const values = row.split(",").map((val) => val.replace(/\s+/g, " ").trim());

    const rowObject: { [key: string]: string } = {};

    headers.forEach((key, index) => {
      rowObject[key] = values[index] || "";
    });

    return rowObject;
  });

  return json;
};
