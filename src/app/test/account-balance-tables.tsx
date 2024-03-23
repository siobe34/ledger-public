import { type RequestTransactionData } from "@/server/api/routers/transaction";
import { api } from "@/trpc/server";

export const AccountBalanceTables = async ({
  year,
  month,
  account,
  user,
}: RequestTransactionData) => {
  const keyTransactions = await api.transactions.getBalanceByMonth.query({
    account,
    user,
    month,
    year,
  });

  const users = Array.from(new Set(keyTransactions.map((i) => i.user)));
  const test = users.map((user) => ({
    [user]: keyTransactions.filter((i) => i.user === user),
  }));
  console.log(JSON.stringify(test));

  return null;
};
