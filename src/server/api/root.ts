import { relatedCategoriesRouter } from "@/server/api/routers/relatedCategories";
import { relatedUsersRouter } from "@/server/api/routers/relatedUsers";
import { transactionRouter } from "@/server/api/routers/transaction";
import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  transactions: transactionRouter,
  relatedCategories: relatedCategoriesRouter,
  relatedUsers: relatedUsersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
