import { columns } from "@/app/dashboard/summary/monthly/data-tables/balances-acc-by-user/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { type RequestTransactionData } from "@/server/api/routers/transaction";
import { api } from "@/trpc/server";

export const BalancesByAcctUserTable = async ({
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

  const accountBalancesByUser = keyTransactions.map((i) => ({
    id: i.id,
    user: i.user,
    account: i.account,
    balance: i.balance,
  }));

  return (
    <Card className="max-w-full flex-1">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Account Balances by User
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={accountBalancesByUser}
          searchBar={false}
          pagination={false}
        />
      </CardContent>
    </Card>
  );
};
