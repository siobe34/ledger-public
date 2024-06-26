"use client";

import { formatMonetaryVals } from "@/lib/formatMonetaryVals";
import { selectTransactionsSchema } from "@/server/db/schema";
import type { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

const _totalBalanceSchema = selectTransactionsSchema
  .pick({
    user: true,
    id: true,
    balance: true,
  })
  .extend({ id: z.string(), balance: z.union([z.string(), z.number()]) });

export type TotalBalance = z.infer<typeof _totalBalanceSchema>;

export const columns: ColumnDef<TotalBalance>[] = [
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => formatMonetaryVals({ value: +row.original.balance }),
  },
];
