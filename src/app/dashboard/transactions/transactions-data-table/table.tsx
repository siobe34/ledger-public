"use client";

import { columns } from "@/app/dashboard/transactions/transactions-data-table/columns";
import { LoadingSpinner } from "@/components/loading-spinner";
import { DataTable } from "@/components/ui/data-table";
import { MONTHS } from "@/lib/constants/months";
// TODO: change location of import to not be from server
import { type RequestTransactionData } from "@/server/api/routers/transaction";
import { api } from "@/trpc/react";
import { RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export const QueriedTransactionsTable = ({
  year,
  month,
  account,
  user,
}: RequestTransactionData) => {
  const { data, isError, isLoading, isSuccess } =
    api.transactions.getByMonth.useQuery({
      year,
      month,
      account,
      user,
    });

  useEffect(() => {
    if (isError) {
      toast.error(
        "Unable to load Transactions data at this time. Please try again.",
      );
    }

    if (isLoading) {
      toast(`Loading transactions for ${MONTHS[month - 1]!.label}, ${year}.`, {
        icon: <RefreshCw className="h-4 animate-spin" />,
      });
    }

    if (isSuccess && data.length === 0) {
      toast.info(
        `No Transactions exist for ${MONTHS[month - 1]!.label}, ${year}. Head over to the Upload page to load them in.`,
      );
    }
    if (isSuccess && data.length > 0) {
      toast.success(
        `Transactions successfully loaded for ${MONTHS[month - 1]!.label}, ${year}.`,
      );
    }
  }, [isError, isLoading, isSuccess, data, month, year]);

  if (!data) return <LoadingSpinner />;

  return (
    // TODO: needs responsive container
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
};
