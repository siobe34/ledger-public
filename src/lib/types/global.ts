import { getTransactionsSchema } from "@/lib/schemas/trpc-inputs";
import {
  insertCategoriesSchema,
  insertTransactionSchema,
  insertUsersSchema,
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

// REMOVEME: if not used later
export type CategoryInsert = z.infer<typeof insertCategoriesSchema>;
export type CategorySelect = z.infer<typeof selectCategoriesSchema>;

// REMOVEME: if not used later
export type UserInsert = z.infer<typeof insertUsersSchema>;
export type UserSelect = z.infer<typeof selectUsersSchema>;

export type RequestTransactionData = z.infer<typeof getTransactionsSchema>;
