import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { insertTransactionSchema, transactions } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq, like, max, ne, sql, sum } from "drizzle-orm";
import { z } from "zod";

export const inputSchema = z.object({
  account: z.string().optional().default("%"),
  user: z.string().optional().default("%"),
  year: z.number(),
  month: z.number(),
});

export type RequestTransactionData = z.infer<typeof inputSchema>;

export const transactionRouter = createTRPCRouter({
  create: privateProcedure
    .input(z.array(insertTransactionSchema))
    .mutation(async ({ ctx, input }) => {
      const transactionsWithEmailId = input.map((i) => ({
        emailId: ctx.emailId,
        ...i,
      }));

      await ctx.db.insert(transactions).values(transactionsWithEmailId);

      return "success";
    }),
  getByMonth: privateProcedure
    .input(inputSchema)
    .query(async ({ ctx, input }) => {
      const matchedRecords = await ctx.db
        .select()
        .from(transactions)
        .where(
          and(
            eq(transactions.emailId, ctx.emailId),
            like(transactions.account, input.account),
            like(transactions.user, input.user),
            eq(sql`YEAR(${transactions.transactionDate})`, input.year),
            eq(sql`MONTH(${transactions.transactionDate})`, input.month),
          ),
        );

      return matchedRecords;
    }),
  getBalanceByMonth: privateProcedure
    .input(inputSchema)
    .query(async ({ ctx, input }) => {
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
                eq(transactions.emailId, ctx.emailId),
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
            eq(transactions.user, sql`b.user`),
            eq(transactions.emailId, ctx.emailId),
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
  getMonthlySummary: privateProcedure
    .input(inputSchema)
    .query(async ({ ctx, input }) => {
      const matchedRecords = await ctx.db
        .select({
          account: transactions.account,
          user: transactions.user,
          category: transactions.category,
          amount_spent: sum(
            sql`${transactions.debit} - ${transactions.credit}`,
          ),
        })
        .from(transactions)
        .where(
          and(
            eq(transactions.emailId, ctx.emailId),
            like(transactions.account, input.account),
            like(transactions.user, input.user),
            eq(sql`YEAR(${transactions.transactionDate})`, input.year),
            eq(sql`MONTH(${transactions.transactionDate})`, input.month),
            ne(transactions.category, "Credit Card"),
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
