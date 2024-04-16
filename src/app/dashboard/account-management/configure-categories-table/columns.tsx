"use client";

import { DeleteCategory } from "@/app/dashboard/account-management/configure-categories-table/delete-category";
import { type CategorySelect } from "@/lib/types/global";
import { type ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<CategorySelect>[] = [
  {
    accessorKey: "title",
    header: "Category",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <DeleteCategory id={row.original.id} />,
  },
];
