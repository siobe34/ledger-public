"use client";

import { selectUsersSchema } from "@/server/db/schema";
import { type ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { DeleteUser } from "@/app/dashboard/account-management/configure-users-table/delete-user";

export const columns: ColumnDef<z.infer<typeof selectUsersSchema>>[] = [
  {
    accessorKey: "title",
    header: "User",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <DeleteUser id={row.original.id} />,
  },
];
