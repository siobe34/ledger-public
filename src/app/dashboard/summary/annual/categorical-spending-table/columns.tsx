"use client";

import { formatMonetaryVals } from "@/lib/formatMonetaryVals";
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
    cell: ({ row }) => formatMonetaryVals({ value: row.original.average }),
  },
  {
    accessorKey: "amount_spent",
    header: "Total Spending",
    cell: ({ row }) => formatMonetaryVals({ value: row.original.amount_spent }),
  },
];
