import { columns } from "@/app/dashboard/summary/monthly/data-tables/balances-acc-by-user/columns";
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
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={accountBalancesByUser}
        searchBar={false}
        pagination={false}
      />
    </div>
  );
};
