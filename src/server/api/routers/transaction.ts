import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  insertTransactionSchema,
  metadatas,
  transactions,
} from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { type MySql2Database } from "drizzle-orm/mysql2";
import { z } from "zod";

import * as TDatabase from "@/server/db/schema";

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

  return userId[0]?.id;
};

export const transactionRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.array(insertTransactionSchema))
    .mutation(async ({ ctx, input }) => {
      const userId = await ctx.db
        .select({ id: metadatas.id })
        .from(metadatas)
        .where(eq(metadatas.email, ctx.userEmail ?? ""));

      if (!userId[0]?.id) {
        return "error";
      }

      const emailId = userId[0].id;

      const transactionsWithEmailId = input.map((i) => ({ emailId, ...i }));

      await ctx.db.insert(transactions).values(transactionsWithEmailId);

      return "success";
    }),
  getMonthly: publicProcedure
    .input(
      z.object({
        month: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const emailId = await getUserEmailId({
        email: ctx.userEmail,
        db: ctx.db,
      });

      if (!emailId) {
        return "error";
      }

      const matchedRecords = await ctx.db
        .select()
        .from(transactions)
        .where(
          and(
            eq(transactions.emailId, emailId),
            // fix matcher for date, should be matching all records with a specific year and month
            eq(transactions.transactionDate, new Date("2023-09-02")),
          ),
        );
    }),
});
