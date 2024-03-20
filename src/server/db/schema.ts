import { relations, sql } from "drizzle-orm";
import {
  bigint,
  datetime,
  decimal,
  int,
  mysqlTableCreator,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `ledger_${name}`);

export const metadatas = createTable("metadata", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const metadataRelations = relations(metadatas, ({ many }) => ({
  transactions: many(transactions),
  transactionCategories: many(transactionCategories),
  transactionAccounts: many(transactionAccounts),
}));

export const transactions = createTable("transaction", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  emailId: bigint("email_id", { mode: "number" }).notNull(),
  sequence: int("sequence").notNull(),
  transactionDate: datetime("transaction_date").notNull(),
  description: text("description").notNull(),
  debit: decimal("debit", { precision: 10, scale: 2 }).notNull(),
  credit: decimal("credit", { precision: 10, scale: 2 }).notNull(),
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category", { length: 256 }).notNull(),
  user: varchar("user", { length: 256 }).notNull(),
  account: varchar("account", { length: 256 }).notNull(),
  comments: text("comments"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const transactionRelations = relations(transactions, ({ one }) => ({
  owner: one(metadatas, {
    fields: [transactions.emailId],
    references: [metadatas.id],
  }),
}));

export const transactionCategories = createTable("transaction_category", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  title: varchar("title", { length: 256 }).notNull(),
  emailId: bigint("email_id", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const transactionCategoryRelations = relations(
  transactionCategories,
  ({ one }) => ({
    owner: one(metadatas, {
      fields: [transactionCategories.emailId],
      references: [metadatas.id],
    }),
  }),
);

export const transactionAccounts = createTable("transaction_account", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  title: varchar("title", { length: 256 }).notNull(),
  emailId: bigint("email_id", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const transactionAccountRelations = relations(
  transactionAccounts,
  ({ one }) => ({
    owner: one(metadatas, {
      fields: [transactionAccounts.emailId],
      references: [metadatas.id],
    }),
  }),
);

export const insertTransactionSchema = createInsertSchema(transactions)
  .omit({
    id: true,
    emailId: true,
    updatedAt: true,
    createdAt: true,
  })
  // Coerce to correct type because 'comments' should not be undefined
  .extend({ comments: z.string().nullable() });

export const selectTransactionsSchema = createSelectSchema(transactions);
