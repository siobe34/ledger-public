import { columns } from "@/app/dashboard/summary/annual/annual-balances-table/columns";
import { DataTable } from "@/components/ui/data-table";
import { type RequestTransactionData } from "@/server/api/routers/transaction";
import { api } from "@/trpc/server";

export const AnnualBalancesTable = async ({
  year,
}: Pick<RequestTransactionData, "year">) => {
  const annualBalancesByUser = await api.transactions.getBalancesByYear.query({
    year,
  });

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={annualBalancesByUser} />
    </div>
  );
};
