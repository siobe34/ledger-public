import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import {
  insertCategoriesSchema,
  selectCategoriesSchema,
  transactionCategories,
} from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const relatedCategoriesRouter = createTRPCRouter({
  get: privateProcedure.query(async ({ ctx }) => {
    const matchedRecords = await ctx.db
      .select()
      .from(transactionCategories)
      .where(eq(transactionCategories.emailId, ctx.emailId))
      .orderBy(transactionCategories.title);

    return matchedRecords;
  }),
  create: privateProcedure
    .input(z.array(insertCategoriesSchema))
    .mutation(async ({ ctx, input }) => {
      const relatedTransactionCategoriesWithEmailId = input.map((i) => ({
        emailId: ctx.emailId,
        ...i,
      }));

      await ctx.db
        .insert(transactionCategories)
        .values(relatedTransactionCategoriesWithEmailId);
    }),
  delete: privateProcedure
    .input(selectCategoriesSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(transactionCategories)
        .where(
          and(
            eq(transactionCategories.emailId, ctx.emailId),
            eq(transactionCategories.id, input.id),
          ),
        );
    }),
});
