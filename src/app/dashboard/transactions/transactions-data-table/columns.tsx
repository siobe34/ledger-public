"use client";

import { selectTransactionsSchema } from "@/server/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

const _transactionSchema = selectTransactionsSchema.extend({
  transactionDate: z.string(),
});
type Transaction = z.infer<typeof _transactionSchema>;

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "transactionDate",
    header: "Date",
    cell: ({ row }) =>
      new Intl.DateTimeFormat("en-CA", {
        dateStyle: "full",
      }).format(new Date(row.original.transactionDate)),
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "credit",
    header: "Credit",
  },
  {
    accessorKey: "debit",
    header: "Debit",
  },
  {
    accessorKey: "balance",
    header: "Balance",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "account",
    header: "Account",
  },
  {
    accessorKey: "comments",
    header: "Comments",
  },
];
