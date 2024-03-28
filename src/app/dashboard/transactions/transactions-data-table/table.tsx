import { columns } from "@/app/dashboard/transactions/transactions-data-table/columns";
import { DataTable } from "@/components/ui/data-table";
import { type RequestTransactionData } from "@/server/api/routers/transaction";
import { api } from "@/trpc/server";

export const QueriedTransactionsTable = async ({
  year,
  month,
  account,
  user,
}: RequestTransactionData) => {
  const queriedTransactions = await api.transactions.getByMonth.query({
    year,
    month,
    account,
    user,
  });

  return (
    // TODO: needs responsive container
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={queriedTransactions} />
    </div>
  );
};
