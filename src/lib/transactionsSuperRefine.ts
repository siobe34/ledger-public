import { type TransactionInsert } from "@/lib/types/global";
import { type RefinementCtx } from "zod";

export const transactionsSuperRefine = ({
  categories,
  users,
  requiredCols,
  transactionsArray,
  ctx,
}: {
  categories: string[];
  users: string[];
  requiredCols: string[];
  transactionsArray: TransactionInsert[];
  ctx: RefinementCtx;
}) => {
  for (const transacation of transactionsArray) {
    if (Number.isNaN(+transacation.balance)) {
      ctx.addIssue({
        code: "custom",
        message: `${transacation.balance} is not a number. Values for Balance must be a number.`,
        path: [0, "balance"],
      });
    }

    if (Number.isNaN(+transacation.credit)) {
      ctx.addIssue({
        code: "custom",
        message: `${transacation.credit} is not a number. Values for Credit must be a number.`,
        path: [0, "credit"],
      });
    }

    if (Number.isNaN(+transacation.debit)) {
      ctx.addIssue({
        code: "custom",
        message: `${transacation.debit} is not a number. Values for Debit must be a number.`,
        path: [0, "debit"],
      });
    }

    if (
      requiredCols.includes("category") &&
      !categories.includes(transacation.category)
    ) {
      ctx.addIssue({
        code: "custom",
        message: `The following category is not configured: ${transacation.category}. Configure it on the Account Management page.`,
        path: [0, "category"],
      });
    }

    if (requiredCols.includes("user") && !users.includes(transacation.user)) {
      ctx.addIssue({
        code: "custom",
        message: `The following user is not configured: ${transacation.user}. Configure it on the Account Management page.`,
        path: [0, "user"],
      });
    }
  }
};
