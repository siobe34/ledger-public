import { QueriedTransactionsTable } from "@/app/dashboard/transactions/transactions-data-table/table";
import { DataParameterSelector } from "@/components/data-parameter-selector/data-parameter-selector";
import { LoadingSpinner } from "@/components/loading-spinner";
import { inputSchema } from "@/server/api/routers/transaction";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function ViewTransactionsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const today = new Date();
  const unsafeParams = {
    account: searchParams.account,
    month: searchParams.month ? +searchParams.month : today.getMonth() + 1,
    user: searchParams.user,
    year: searchParams.year ? +searchParams.year : today.getFullYear(),
  };

  if (
    !searchParams.account ||
    !searchParams.month ||
    !searchParams.user ||
    !searchParams.year
  ) {
    redirect(
      `/dashboard/transactions?account=${unsafeParams.account ?? "%"}&month=${unsafeParams.month}&user=${unsafeParams.user ?? "%"}&year=${unsafeParams.year}`,
    );
  }

  const parsedSearchParams = inputSchema.parse(unsafeParams);

  return (
    <>
      <DataParameterSelector {...parsedSearchParams} />
      <Suspense fallback={<LoadingSpinner />}>
        <QueriedTransactionsTable {...parsedSearchParams} />
      </Suspense>
    </>
  );
}
