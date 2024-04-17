"use client";

import { EditableCellDropdown } from "@/app/dashboard/transactions/upload/upload-data-wizard/step3/editable-transactions-table/editable-cell-dropdown";
import { EditableCellInput } from "@/app/dashboard/transactions/upload/upload-data-wizard/step3/editable-transactions-table/editable-cell-input";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { formatMonetaryVals } from "@/lib/formatMonetaryVals";
import { formatTransactionDate } from "@/lib/formatTransactionDate";
import { type TransactionInsert } from "@/lib/types/global";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TransactionInsert>[] = [
  {
    accessorKey: "transactionDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ cell }) =>
      formatTransactionDate({ date: new Date(`${cell.getValue() as string}`) }),
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
    cell: ({ getValue, row, column, table }) => (
      <EditableCellDropdown
        dropdownOpts={table.options.meta?.categories ?? []}
        getValue={getValue}
        id={column.id}
        index={row.index}
        table={table}
      />
    ),
  },
  {
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ getValue, row, column, table }) => (
      <EditableCellDropdown
        dropdownOpts={table.options.meta?.users ?? []}
        getValue={getValue}
        id={column.id}
        index={row.index}
        table={table}
      />
    ),
  },
  {
    accessorKey: "account",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account" />
    ),
    cell: ({ getValue, row, column, table }) => (
      <EditableCellDropdown
        dropdownOpts={["Credit", "Debit"]}
        getValue={getValue}
        id={column.id}
        index={row.index}
        table={table}
      />
    ),
  },
  {
    accessorKey: "comments",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Comments" />
    ),
    cell: ({ getValue, row, column, table }) => (
      <EditableCellInput
        table={table}
        getValue={getValue}
        id={column.id}
        index={row.index}
      />
    ),
  },
];
