import { accountEnumErrorMap } from "@/lib/schemas/error-maps";
import { relations, sql } from "drizzle-orm";
import {
  decimal,
  integer,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `ledger_${name}`);

export const metadatas = createTable("metadata", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const metadataRelations = relations(metadatas, ({ many }) => ({
  transactions: many(transactions),
  transactionCategories: many(transactionCategories),
  transactionUsers: many(transactionUsers),
}));

export const transactions = createTable("transaction", {
  id: serial("id").primaryKey(),
  emailId: integer("email_id").notNull(),
  sequence: integer("sequence").notNull(),
  transactionDate: timestamp("transaction_date").notNull(),
  description: text("description").notNull(),
  debit: decimal("debit", { precision: 10, scale: 2 }).notNull(),
  credit: decimal("credit", { precision: 10, scale: 2 }).notNull(),
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category", { length: 256 }).notNull(),
  user: varchar("user", { length: 256 }).notNull(),
  account: varchar("account", { length: 32 }).notNull(),
  comments: text("comments"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const transactionRelations = relations(transactions, ({ one }) => ({
  owner: one(metadatas, {
    fields: [transactions.emailId],
    references: [metadatas.id],
  }),
}));

export const transactionCategories = createTable("transaction_category", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).unique().notNull(),
  emailId: integer("email_id").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

export const transactionUsers = createTable("transaction_user", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).unique().notNull(),
  emailId: integer("email_id").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const transactionUserRelations = relations(
  transactionUsers,
  ({ one }) => ({
    owner: one(metadatas, {
      fields: [transactionUsers.emailId],
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
  .extend({
    account: z.enum(["Credit", "Debit"], { errorMap: accountEnumErrorMap }),
    comments: z.string().nullable(),
  });

export const selectTransactionsSchema = createSelectSchema(transactions).extend(
  {
    account: z.enum(["Credit", "Debit"], { errorMap: accountEnumErrorMap }),
  },
);

export const insertCategoriesSchema = createInsertSchema(
  transactionCategories,
).omit({
  id: true,
  emailId: true,
  updatedAt: true,
  createdAt: true,
});

export const selectCategoriesSchema = createSelectSchema(transactionCategories);

export const insertUsersSchema = createInsertSchema(transactionUsers).omit({
  id: true,
  emailId: true,
  updatedAt: true,
  createdAt: true,
});

export const selectUsersSchema = createSelectSchema(transactionUsers);
