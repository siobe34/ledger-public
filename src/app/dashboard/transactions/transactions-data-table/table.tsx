"use client";

import { columns } from "@/app/dashboard/transactions/transactions-data-table/columns";
import { LoadingSpinner } from "@/components/loading-spinner";
import { DataTable } from "@/components/ui/data-table";
import { dataLoadToastNotifications } from "@/lib/dataLoadToastNotifications";
import { type RequestTransactionData } from "@/lib/types/global";
import { api } from "@/trpc/react";
import { useEffect } from "react";

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
    dataLoadToastNotifications({
      isError,
      isLoading,
      isSuccess,
      month,
      year,
      dataLength: data?.length ?? 0,
    });
  }, [isError, isLoading, isSuccess, data, month, year]);

  if (!data) return <LoadingSpinner className="mx-auto" />;

  return <DataTable columns={columns} data={data} />;
};
