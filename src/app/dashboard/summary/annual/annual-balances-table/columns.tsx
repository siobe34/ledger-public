"use client";

import { formatMonetaryVals } from "@/lib/formatMonetaryVals";
import { formatTransactionDate } from "@/lib/formatTransactionDate";
import { selectTransactionsSchema } from "@/server/db/schema";
import type { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

const _balanceByUserAcc = selectTransactionsSchema
  .pick({
    account: true,
    balance: true,
    transactionDate: true,
    user: true,
  })
  .extend({ month: z.number(), year: z.number() });

export type UserBalances = z.infer<typeof _balanceByUserAcc>;

export const columns: ColumnDef<UserBalances>[] = [
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "account",
    header: "Account",
  },
  {
    accessorKey: "month",
    header: "Month",
    cell: ({ row }) =>
      formatTransactionDate({
        date: row.original.transactionDate,
        opts: { month: "long" },
      }),
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => formatMonetaryVals({ value: +row.original.balance }),
  },
];
