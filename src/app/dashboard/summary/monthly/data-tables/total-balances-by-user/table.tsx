import {
  columns,
  type TotalBalance,
} from "@/app/dashboard/summary/monthly/data-tables/total-balances-by-user/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="max-w-full flex-1">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Total Balance by User
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={totalBalancesByUser}
          searchBar={false}
          pagination={false}
        />
      </CardContent>
    </Card>
  );
};
