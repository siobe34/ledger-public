import { insertUsersArraySchema } from "@/lib/schemas/trpc-inputs";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { selectUsersSchema, transactionUsers } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export const relatedUsersRouter = createTRPCRouter({
  get: privateProcedure.query(async ({ ctx }) => {
    const matchedRecords = await ctx.db
      .select()
      .from(transactionUsers)
      .where(eq(transactionUsers.emailId, ctx.emailId))
      .orderBy(transactionUsers.title);

    return matchedRecords;
  }),
  create: privateProcedure
    .input(insertUsersArraySchema)
    .mutation(async ({ ctx, input }) => {
      const relatedTransactionUsersWithEmailId = input.map((i) => ({
        emailId: ctx.emailId,
        ...i,
      }));

      await ctx.db
        .insert(transactionUsers)
        .values(relatedTransactionUsersWithEmailId);
    }),
  delete: privateProcedure
    .input(selectUsersSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(transactionUsers)
        .where(
          and(
            eq(transactionUsers.emailId, ctx.emailId),
            eq(transactionUsers.id, input.id),
          ),
        );
    }),
});
