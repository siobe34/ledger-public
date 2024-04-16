"use client";

import { formatMonetaryVals } from "@/lib/formatMonetaryVals";
import { selectTransactionsSchema } from "@/server/db/schema";
import type { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

const _totalBalanceSchema = selectTransactionsSchema
  .pick({
    user: true,
  })
  .extend({ income: z.number(), expenses: z.number(), savings: z.number() });

export type UserSavings = z.infer<typeof _totalBalanceSchema>;

export const columns: ColumnDef<UserSavings>[] = [
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "income",
    header: "Income",
    cell: ({ row }) => formatMonetaryVals({ value: row.original.income }),
  },
  {
    accessorKey: "expenses",
    header: "Expenses",
    cell: ({ row }) => formatMonetaryVals({ value: row.original.expenses }),
  },
  {
    accessorKey: "savings",
    header: "Savings",
    cell: ({ row }) =>
      formatMonetaryVals({ value: row.original.income - row.original.savings }),
  },
];
