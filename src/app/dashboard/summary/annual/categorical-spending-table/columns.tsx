"use client";

import { selectTransactionsSchema } from "@/server/db/schema";
import type { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

const _balanceByUserAcc = selectTransactionsSchema
  .pick({
    category: true,
  })
  .extend({ amount_spent: z.number(), average: z.number() });

type AnnualCategoricalData = z.infer<typeof _balanceByUserAcc>;

export const columns: ColumnDef<AnnualCategoricalData>[] = [
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "average",
    header: "Average Spending",
    // TODO: extract monetary value sanitization to function because it's used in a lot of places. Also use zod for validation in the function
    cell: ({ row }) => {
      let unsafeAmount = parseFloat(row.getValue("average"));
      if (isNaN(unsafeAmount)) {
        unsafeAmount = 0;
      }

      // TODO: everywhere that this logic is used should instead use Intl.NumberFormat
      return `$${unsafeAmount.toFixed(2)}`;
    },
  },
  {
    accessorKey: "amount_spent",
    header: "Total Spending",
    // TODO: extract monetary value sanitization to function because it's used in a lot of places. Also use zod for validation in the function
    cell: ({ row }) => {
      let unsafeAmount = parseFloat(row.getValue("amount_spent"));
      if (isNaN(unsafeAmount)) {
        unsafeAmount = 0;
      }

      // TODO: everywhere that this logic is used should instead use Intl.NumberFormat
      return `$${unsafeAmount.toFixed(2)}`;
    },
  },
];
