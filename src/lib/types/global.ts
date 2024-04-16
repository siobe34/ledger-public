import {
  insertCategoriesSchema,
  insertTransactionSchema,
  insertUsersSchema,
  selectCategoriesSchema,
  selectTransactionsSchema,
  selectUsersSchema,
} from "@/server/db/schema";
import { z } from "zod";

export type TransactionInsert = z.infer<typeof insertTransactionSchema>;
export type TransactionSelect = z.infer<typeof selectTransactionsSchema>;

export type CategoryInsert = z.infer<typeof insertCategoriesSchema>;
export type CategorySelect = z.infer<typeof selectCategoriesSchema>;

export type UserInsert = z.infer<typeof insertUsersSchema>;
export type UserSelect = z.infer<typeof selectUsersSchema>;
