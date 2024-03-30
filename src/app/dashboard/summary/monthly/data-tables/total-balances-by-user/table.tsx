import {
  type TotalBalance,
  columns,
} from "@/app/dashboard/summary/monthly/data-tables/total-balances-by-user/columns";
import { DataTable } from "@/components/ui/data-table";
import { type RequestTransactionData } from "@/server/api/routers/transaction";
import { api } from "@/trpc/server";

export const TotalBalancesByUserTable = async ({
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

  // TODO: extract to separate func (also used in account-balances table)
  const accountBalancesByUser = keyTransactions.map((i) => ({
    id: i.id,
    user: i.user,
    account: i.account,
    balance: i.balance,
  }));

  const uniqueUsers = Array.from(
    new Set(accountBalancesByUser.map((i) => i.user)),
  );

  const totalBalancesByUser: Array<TotalBalance> = [];

  for (const uniqueUser of uniqueUsers) {
    let debit = 0;
    let credit = 0;

    const debitArray = accountBalancesByUser
      .filter((i) => i.user === uniqueUser && i.account === "Debit")
      .map((i) => (i.balance ? +i.balance : 0));

    const creditArray = accountBalancesByUser
      .filter((i) => i.user === uniqueUser && i.account === "Credit")
      .map((i) => (i.balance ? +i.balance : 0));

    if (debitArray && debitArray.length > 0) {
      debit = debitArray.reduce((acc, curr) => acc + curr);
    }
    if (creditArray && creditArray.length > 0) {
      credit = creditArray.reduce((acc, curr) => acc + curr);
    }

    totalBalancesByUser.push({
      id: uniqueUser,
      balance: debit - credit,
      user: uniqueUser,
    });
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={totalBalancesByUser} />
    </div>
  );
};
