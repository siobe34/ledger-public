import {
  getTransactionsSchema,
  insertTransactionsArraySchema,
} from "@/lib/schemas/trpc-inputs";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { transactions } from "@/server/db/schema";
import { and, countDistinct, eq, like, max, ne, sql, sum } from "drizzle-orm";

export const transactionRouter = createTRPCRouter({
  create: privateProcedure
    .input(insertTransactionsArraySchema)
    .mutation(async ({ ctx, input }) => {
      const transactionsWithEmailId = input.map((i) => ({
        emailId: ctx.emailId,
        ...i,
      }));

      await ctx.db.insert(transactions).values(transactionsWithEmailId);

      return "success";
    }),
  getByMonth: privateProcedure
    .input(getTransactionsSchema)
    .query(async ({ ctx, input }) => {
      // REMOVEME: simulating slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const matchedRecords = await ctx.db
        .select()
        .from(transactions)
        .where(
          and(
            eq(transactions.emailId, ctx.emailId),
            like(transactions.account, input.account),
            like(transactions.user, input.user),
            eq(
              sql`DATE_PART('year', ${transactions.transactionDate})`,
              input.year,
            ),
            eq(
              sql`DATE_PART('month',${transactions.transactionDate})`,
              input.month,
            ),
          ),
        )
        .orderBy(transactions.transactionDate);

      return matchedRecords.map((record) => ({
        ...record,
        transactionDate: record.transactionDate.toDateString(),
      }));
    }),
  getBalanceByMonth: privateProcedure
    .input(getTransactionsSchema)
    .query(async ({ ctx, input }) => {
      // REMOVEME: simulating slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const matchedRecords = await ctx.db
        .select()
        .from(transactions)
        .innerJoin(
          ctx.db
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
                eq(
                  sql`DATE_PART('year', ${transactions.transactionDate})`,
                  input.year,
                ),
                eq(
                  sql`DATE_PART('month', ${transactions.transactionDate})`,
                  input.month,
                ),
              ),
            )
            .groupBy(transactions.account, transactions.user)
            .as("b"),
          and(
            eq(transactions.sequence, sql`b.max_sequence`),
            eq(transactions.account, sql`b.account`),
            eq(transactions.user, sql`b.user`),
            eq(transactions.emailId, ctx.emailId),
            eq(
              sql`DATE_PART('year', ${transactions.transactionDate})`,
              input.year,
            ),
            eq(
              sql`DATE_PART('month', ${transactions.transactionDate})`,
              input.month,
            ),
          ),
        );

      return matchedRecords.map((record) => record.transaction);
    }),
  getBalancesByYear: privateProcedure
    .input(getTransactionsSchema.pick({ year: true }))
    .query(async ({ ctx, input }) => {
      // REMOVEME: simulating slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const matchedRecords = await ctx.db
        .select({
          id: transactions.id,
          transactionDate: transactions.transactionDate,
          balance: transactions.balance,
          account: transactions.account,
          user: transactions.user,
          month: sql<number>`b.month`,
          year: sql<number>`b.year`,
        })
        .from(transactions)
        .innerJoin(
          ctx.db
            .select({
              account: transactions.account,
              user: transactions.user,
              sequence: max(transactions.sequence).as("max_sequence"),
              year: sql<number>`DATE_PART('year', ${transactions.transactionDate})`.as(
                "year",
              ),
              month:
                sql<number>`DATE_PART('month', ${transactions.transactionDate})`.as(
                  "month",
                ),
            })
            .from(transactions)
            .where(
              and(
                eq(transactions.emailId, ctx.emailId),
                eq(
                  sql`DATE_PART('year', ${transactions.transactionDate})`,
                  input.year,
                ),
              ),
            )
            .groupBy(
              transactions.account,
              transactions.user,
              sql`year`,
              sql`month`,
            )
            .as("b"),
          and(
            eq(transactions.sequence, sql`b.max_sequence`),
            eq(transactions.account, sql`b.account`),
            eq(transactions.user, sql`b.user`),
            eq(transactions.emailId, ctx.emailId),
            eq(
              sql`DATE_PART('year', ${transactions.transactionDate})`,
              input.year,
            ),
          ),
        )
        .orderBy(transactions.transactionDate);

      return matchedRecords;
    }),
  getMonthlyCategoricalSpending: privateProcedure
    .input(getTransactionsSchema)
    .query(async ({ ctx, input }) => {
      // REMOVEME: simulating slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

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
            eq(
              sql`DATE_PART('year', ${transactions.transactionDate})`,
              input.year,
            ),
            eq(
              sql`DATE_PART('month', ${transactions.transactionDate})`,
              input.month,
            ),
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
  getAnnualCategoricalSpending: privateProcedure
    .input(getTransactionsSchema.pick({ year: true }))
    .query(async ({ ctx, input }) => {
      // REMOVEME: simulating slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const matchedRecords = await ctx.db
        .select({
          category: transactions.category,
          amount_spent: sum(
            sql`${transactions.debit} - ${transactions.credit}`,
          ).as("amount_spent"),
          count: countDistinct(
            sql`DATE_PART('month', ${transactions.transactionDate})`,
          ).as("count"),
        })
        .from(transactions)
        .where(
          and(
            eq(transactions.emailId, ctx.emailId),
            eq(
              sql`DATE_PART('year', ${transactions.transactionDate})`,
              input.year,
            ),
            ne(transactions.category, "Credit Card"),
            ne(transactions.category, "Income"),
          ),
        )
        .groupBy(transactions.category);

      const matchedRecordsWithAverages = matchedRecords.map((i) => ({
        ...i,
        amount_spent: i.amount_spent ? +i.amount_spent : 0,
        average: i.amount_spent ? +i.amount_spent / i.count : 0,
      }));

      return matchedRecordsWithAverages;
    }),
  getPossibleYears: privateProcedure.query(async ({ ctx }) => {
    const records = await ctx.db
      .selectDistinct({
        year: sql<number>`DATE_PART('year', ${transactions.transactionDate})`.as(
          "year",
        ),
      })
      .from(transactions)
      .where(eq(transactions.emailId, ctx.emailId))
      .orderBy(sql`year`);

    return records.map((i) => i.year);
  }),
});
