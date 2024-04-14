"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Record<string, string>>[] = [
  {
    accessorKey: "Date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    // cell: ({ row }) =>
    //   new Intl.DateTimeFormat("en-CA", {
    //     dateStyle: "full",
    //   }).format(new Date(row.getValue("transactionDate"))),
  },
  {
    accessorKey: "Description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
  },
  {
    accessorKey: "Debit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Debit" />
    ),
  },
  {
    accessorKey: "Credit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Credit" />
    ),
  },
  {
    accessorKey: "Balance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Balance" />
    ),
  },
  {
    accessorKey: "Category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
  },
  {
    accessorKey: "User",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
  },
  {
    accessorKey: "Account",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account" />
    ),
  },
  {
    accessorKey: "Comments",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Comments" />
    ),
  },
];
