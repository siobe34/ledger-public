"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { formatMonetaryVals } from "@/lib/formatMonetaryVals";
import { formatTransactionDate } from "@/lib/formatTransactionDate";
import { type TransactionSelect } from "@/lib/types/global";
import type { ColumnDef } from "@tanstack/react-table";

type Transaction = Omit<TransactionSelect, "transactionDate"> & {
  transactionDate: string;
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "transactionDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) =>
      formatTransactionDate({ date: new Date(row.original.transactionDate) }),
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
    cell: ({ row }) => formatMonetaryVals({ value: +row.original.debit }),
  },
  {
    accessorKey: "credit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Credit" />
    ),
    cell: ({ row }) => formatMonetaryVals({ value: +row.original.credit }),
  },
  {
    accessorKey: "balance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Balance" />
    ),
    cell: ({ row }) => formatMonetaryVals({ value: +row.original.balance }),
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
