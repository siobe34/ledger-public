import { QueriedTransactionsTable } from "@/app/dashboard/transactions/transactions-data-table/table";
import { DataParameterSelector } from "@/components/data-parameter-selector/data-parameter-selector";
import { LoadingSpinner } from "@/components/loading-spinner";
import { inputSchema } from "@/server/api/routers/transaction";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function ViewTransactionsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const configuredUsers = await api.relatedUsers.get.query();

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
      <h1 className="text-2xl font-bold underline">Monthly Transactions</h1>
      <DataParameterSelector
        configuredUsers={configuredUsers}
        {...parsedSearchParams}
      />
      <div className="w-full">
        <Suspense fallback={<LoadingSpinner className="mx-auto" />}>
          <QueriedTransactionsTable {...parsedSearchParams} />
        </Suspense>
      </div>
    </>
  );
}
