"use client";

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
    // TODO: extract monetary value sanitization to function because it's used in a lot of places. Also use zod for validation in the function
    cell: ({ row }) => {
      let unsafeAmount = parseFloat(row.getValue("income"));
      if (isNaN(unsafeAmount)) {
        unsafeAmount = 0;
      }

      return `$${unsafeAmount.toFixed(2)}`;
    },
  },
  {
    accessorKey: "expenses",
    header: "Expenses",
    cell: ({ row }) => {
      let unsafeAmount = parseFloat(row.getValue("expenses"));
      if (isNaN(unsafeAmount)) {
        unsafeAmount = 0;
      }

      return `$${unsafeAmount.toFixed(2)}`;
    },
  },
  {
    accessorKey: "savings",
    header: "Savings",
    cell: ({ row }) => {
      let unsafeIncome = parseFloat(row.getValue("income"));
      let unsafeExpenses = parseFloat(row.getValue("expenses"));
      if (isNaN(unsafeIncome)) {
        unsafeIncome = 0;
      }
      if (isNaN(unsafeExpenses)) {
        unsafeExpenses = 0;
      }

      const savings = unsafeIncome - unsafeExpenses;
      return `$${savings.toFixed(2)}`;
    },
  },
];
