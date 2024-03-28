"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
// TODO: move this import to a separate /types directory
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) =>
      new Intl.DateTimeFormat("en-CA", {
        dateStyle: "full",
      }).format(new Date(row.original.transactionDate)),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
  },

  {
    accessorKey: "debit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Debit" />
    ),
  },
  {
    accessorKey: "credit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Credit" />
    ),
  },
  {
    accessorKey: "balance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Balance" />
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
  },
  {
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
  },
  {
    accessorKey: "account",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account" />
    ),
  },
  {
    accessorKey: "comments",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Comments" />
    ),
  },
];
