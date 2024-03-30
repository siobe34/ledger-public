"use client";

import { selectTransactionsSchema } from "@/server/db/schema";
import type { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

const _acctBalanceSchema = selectTransactionsSchema.pick({
  account: true,
  user: true,
  id: true,
  balance: true,
});

export type AccountBalance = z.infer<typeof _acctBalanceSchema>;

export const columns: ColumnDef<AccountBalance>[] = [
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "account",
    header: "Account",
  },
  {
    accessorKey: "balance",
    header: "Balance",
  },
];
