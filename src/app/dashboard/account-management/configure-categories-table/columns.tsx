"use client";

import { selectCategoriesSchema } from "@/server/db/schema";
import { type ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { DeleteCategory } from "@/app/dashboard/account-management/configure-categories-table/delete-category";

export const columns: ColumnDef<z.infer<typeof selectCategoriesSchema>>[] = [
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
