"use client";

import { DeleteUser } from "@/app/dashboard/account-management/configure-users-table/delete-user";
import { type UserSelect } from "@/lib/types/global";
import { type ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<UserSelect>[] = [
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
