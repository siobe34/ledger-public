import { getTransactionsSchema } from "@/lib/schemas/trpc-inputs";
import {
  insertTransactionSchema,
  selectCategoriesSchema,
  selectTransactionsSchema,
  selectUsersSchema,
} from "@/server/db/schema";
import { z } from "zod";

export type PageSearchParams = {
  searchParams: Record<string, string | string[] | undefined>;
};

export type TransactionInsert = z.infer<typeof insertTransactionSchema>;
export type TransactionSelect = z.infer<typeof selectTransactionsSchema>;

export type CategorySelect = z.infer<typeof selectCategoriesSchema>;

export type UserSelect = z.infer<typeof selectUsersSchema>;

export type RequestTransactionData = z.infer<typeof getTransactionsSchema>;
