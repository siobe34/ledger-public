import { columns } from "@/app/dashboard/summary/annual/categorical-spending-table/columns";
import { DataTable } from "@/components/ui/data-table";
import { type RequestTransactionData } from "@/lib/types/global";
import { api } from "@/trpc/server";

export const CategoricalSpendingTable = async ({
  year,
}: Pick<RequestTransactionData, "year">) => {
  const annualBalancesByUser =
    await api.transactions.getAnnualCategoricalSpending.query({
      year,
    });

  return <DataTable columns={columns} data={annualBalancesByUser} />;
};
