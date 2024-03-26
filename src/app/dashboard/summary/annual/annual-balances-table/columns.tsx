"use client";

import { selectTransactionsSchema } from "@/server/db/schema";
import { ColumnDef } from "@tanstack/react-table";
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
    cell: ({ row }) => {
      const date = row.original.transactionDate;
      // TODO: this line specifically is re-used so much I should extract it to a helper func
      const month = new Intl.DateTimeFormat("en-CA", { month: "long" }).format(
        date,
      );

      return month;
    },
  },
  {
    accessorKey: "balance",
    header: "Balance",
    // TODO: extract monetary value sanitization to function because it's used in a lot of places. Also use zod for validation in the function
    cell: ({ row }) => {
      let unsafeAmount = parseFloat(row.getValue("balance"));
      if (isNaN(unsafeAmount)) {
        unsafeAmount = 0;
      }

      // TODO: everywhere that this logic is used should instead use Intl.NumberFormat
      return `$${unsafeAmount.toFixed(2)}`;
    },
  },
];
