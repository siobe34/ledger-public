import { insertTransactionSchema } from "@/server/db/schema";
import { z } from "zod";

export const getTransactionsSchema = z.object({
  account: z.enum(["%", "Credit", "Debit"]).optional().default("%"),
  user: z.string().optional().default("%"),
  year: z.number(),
  month: z.number(),
});

export const insertTransactionsArraySchema = z.array(insertTransactionSchema);
