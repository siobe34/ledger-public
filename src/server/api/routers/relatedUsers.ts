import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { insertUsersSchema, transactionUsers } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const relatedUsersRouter = createTRPCRouter({
  get: privateProcedure.query(async ({ ctx }) => {
    const matchedRecords = await ctx.db
      .select()
      .from(transactionUsers)
      .where(eq(transactionUsers.emailId, ctx.emailId));

    return matchedRecords;
  }),
  create: privateProcedure
    .input(z.array(insertUsersSchema))
    .mutation(async ({ ctx, input }) => {
      const relatedTransactionUsersWithEmailId = input.map((i) => ({
        emailId: ctx.emailId,
        ...i,
      }));

      await ctx.db
        .insert(transactionUsers)
        .values(relatedTransactionUsersWithEmailId);

      return "success";
    }),
});
