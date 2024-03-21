import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import * as TDatabase from "@/server/db/schema";
import {
  insertTransactionSchema,
  metadatas,
  transactions,
} from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq, like, max, not, sql, sum } from "drizzle-orm";
import { type MySql2Database } from "drizzle-orm/mysql2";
import { z } from "zod";

// TODO: move to separate file
const getUserEmailId = async ({
  email,
  db,
}: {
  email: string | undefined;
  db: MySql2Database<typeof TDatabase>;
}) => {
  const userId = await db
    .select({ id: metadatas.id })
    .from(metadatas)
    .where(eq(metadatas.email, email ?? ""));

  const emailId = userId[0]?.id;
  if (!emailId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You don't appear to be signed in. Please sign in.",
    });
  }

  return emailId;
};

const inputSchema = z.object({
  account: z.string().optional().default("%"),
  user: z.string().optional().default("%"),
  year: z.number(),
  month: z.number(),
});

export const transactionRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.array(insertTransactionSchema))
    .mutation(async ({ ctx, input }) => {
      const emailId = await getUserEmailId({
        email: ctx.userEmail,
        db: ctx.db,
      });

      const transactionsWithEmailId = input.map((i) => ({
        emailId,
        ...i,
      }));

      await ctx.db.insert(transactions).values(transactionsWithEmailId);

      return "success";
    }),
  getByMonth: publicProcedure
    .input(inputSchema)
    .query(async ({ ctx, input }) => {
      const emailId = await getUserEmailId({
        email: ctx.userEmail,
        db: ctx.db,
      });

      const matchedRecords = await ctx.db
        .select()
        .from(transactions)
        .where(
          and(
            eq(transactions.emailId, emailId),
            like(transactions.account, input.account),
            like(transactions.user, input.user),
            eq(sql`YEAR(${transactions.transactionDate})`, input.year),
            eq(sql`MONTH(${transactions.transactionDate})`, input.month),
          ),
        );

      return matchedRecords;
    }),
  getBalanceByMonth: publicProcedure
    .input(inputSchema)
    .query(async ({ ctx, input }) => {
      const emailId = await getUserEmailId({
        email: ctx.userEmail,
        db: ctx.db,
      });

      const matchedRecords = await db
        .select()
        .from(transactions)
        .innerJoin(
          db
            .select({
              account: transactions.account,
              user: transactions.user,
              sequence: max(transactions.sequence).as("max_sequence"),
            })
            .from(transactions)
            .where(
              and(
                eq(transactions.emailId, emailId),
                like(transactions.account, input.account),
                like(transactions.user, input.user),
                eq(sql`YEAR(${transactions.transactionDate})`, input.year),
                eq(sql`MONTH(${transactions.transactionDate})`, input.month),
              ),
            )
            .groupBy(transactions.account, transactions.user)
            .as("b"),
          and(
            eq(transactions.sequence, sql`b.max_sequence`),
            eq(transactions.account, sql`b.account`),
            eq(transactions.emailId, emailId),
            like(transactions.account, input.account),
            like(transactions.user, input.user),
            eq(sql`YEAR(${transactions.transactionDate})`, input.year),
            eq(sql`MONTH(${transactions.transactionDate})`, input.month),
          ),
        );

      if (matchedRecords.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            'No account balance found for the given "user", "year", "month", "account".',
        });
      }

      return matchedRecords.map((record) => record.transaction);
    }),
  getMonthlySummary: publicProcedure
    .input(inputSchema)
    .query(async ({ ctx, input }) => {
      const emailId = await getUserEmailId({
        email: ctx.userEmail,
        db: ctx.db,
      });

      const matchedRecords = await ctx.db
        .select({
          account: transactions.account,
          user: transactions.user,
          category: transactions.category,
          amount_spent: sum(
            sql<number>`${transactions.debit} - ${transactions.credit}`,
          ),
        })
        .from(transactions)
        .where(
          and(
            eq(transactions.emailId, emailId),
            like(transactions.account, input.account),
            like(transactions.user, input.user),
            eq(sql`YEAR(${transactions.transactionDate})`, input.year),
            eq(sql`MONTH(${transactions.transactionDate})`, input.month),
            not(eq(transactions.category, "Credit Card")),
          ),
        )
        .groupBy(
          transactions.account,
          transactions.category,
          transactions.user,
        );

      return matchedRecords;
    }),
});
