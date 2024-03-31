"use client";

import { columns } from "@/app/dashboard/summary/annual/annual-balances-table/columns";
import { LoadingSpinner } from "@/components/loading-spinner";
import { DataTable } from "@/components/ui/data-table";
import { dataLoadToastNotifications } from "@/lib/dataLoadToastNotifications";
import { type RequestTransactionData } from "@/server/api/routers/transaction";
import { api } from "@/trpc/react";
import { useEffect } from "react";

export const AnnualBalancesTable = ({
  year,
}: Pick<RequestTransactionData, "year">) => {
  const { data, isError, isLoading, isSuccess } =
    api.transactions.getBalancesByYear.useQuery({
      year,
    });

  useEffect(() => {
    dataLoadToastNotifications({
      isError,
      isLoading,
      isSuccess,
      year,
      dataLength: data?.length ?? 0,
    });
  }, [isError, isLoading, isSuccess, data, year]);

  if (!data) return <LoadingSpinner className="mx-auto" />;

  const annualBalancesByUser = data;

  return <DataTable columns={columns} data={annualBalancesByUser} />;
};
