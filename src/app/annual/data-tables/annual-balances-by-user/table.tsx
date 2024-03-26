import { columns } from "@/app/annual/data-tables/annual-balances-by-user/columns";
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
