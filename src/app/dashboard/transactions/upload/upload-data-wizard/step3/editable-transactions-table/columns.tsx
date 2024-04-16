"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DropdownStateful } from "@/components/dropdown-with-state";
import { Input } from "@/components/ui/input";
import type { ColumnDef, Getter, Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export const columns: ColumnDef<Record<string, string>>[] = [
  {
    accessorKey: "Date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ cell }) =>
      new Intl.DateTimeFormat("en-CA", {
        dateStyle: "full",
      }).format(new Date(cell.getValue() as string)),
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
    accessorKey: "User",
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
    accessorKey: "Account",
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
    accessorKey: "Comments",
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

type EditableCellProps<TData> = {
  getValue: Getter<unknown>;
  id: string;
  index: number;
  table: Table<TData>;
};

type EditableCellDropdownProps<TData> = EditableCellProps<TData> & {
  dropdownOpts: string[];
};

const EditableCellDropdown = <TData,>({
  dropdownOpts,
  getValue,
  id,
  index,
  table,
}: EditableCellDropdownProps<TData>) => {
  const initialValue = getValue() as string;
  const defaultSelectedItem = initialValue.length > 0 ? initialValue : "Select";

  const [selectedItem, setSelectedItem] = useState(defaultSelectedItem);

  useEffect(() => {
    const defaultSelectedItem =
      initialValue.length > 0 ? initialValue : "Select";
    setSelectedItem(defaultSelectedItem);
  }, [initialValue]);

  const handleSelect = (newItem: string) => {
    table.options.meta?.updateData(index, id, newItem);
  };

  return (
    <DropdownStateful
      dropdownOpts={dropdownOpts}
      selectedItem={selectedItem}
      setItemCallback={handleSelect}
      setSelectedItem={setSelectedItem}
      buttonProps={{
        variant: selectedItem === "Select" ? "default" : "outline",
      }}
    />
  );
};

const EditableCellInput = <TData,>({
  getValue,
  id,
  index,
  table,
}: EditableCellProps<TData>) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    table.options.meta?.updateData(index, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      value={value as string}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
    />
  );
};