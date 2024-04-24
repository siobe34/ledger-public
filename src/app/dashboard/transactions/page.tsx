import { QueriedTransactionsTable } from "@/app/dashboard/transactions/transactions-data-table/table";
import { DataParameterSelector } from "@/components/data-parameter-selector/rsc-wrapper";
import { LoadingSpinner } from "@/components/loading-spinner";
import { getTransactionsSchema } from "@/lib/schemas/trpc-inputs";
import { type PageSearchParams } from "@/lib/types/global";
import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Ledger | View Transactions" };

export default async function ViewTransactionsPage({
  searchParams,
}: PageSearchParams) {
  const today = new Date();
  const unsafeParams = {
    account: searchParams.account,
    month: searchParams.month ? +searchParams.month : today.getMonth() + 1,
    user: searchParams.user,
    year: searchParams.year ? +searchParams.year : today.getFullYear(),
  };

  const zodParamParser = getTransactionsSchema.safeParse(unsafeParams);

  if (!zodParamParser.success) {
    const account = unsafeParams.account?.toString() ?? "%";
    const user = unsafeParams.user?.toString() ?? "%";

    redirect(
      `/dashboard/transactions?account=${account}&month=${unsafeParams.month}&user=${user}&year=${unsafeParams.year}`,
    );
  }

  const parsedSearchParams = zodParamParser.data;

  return (
    <>
      <h1 className="text-2xl font-bold underline">Monthly Transactions</h1>
      <DataParameterSelector {...parsedSearchParams} />
      <div className="w-full">
        <Suspense fallback={<LoadingSpinner className="mx-auto" />}>
          <QueriedTransactionsTable {...parsedSearchParams} />
        </Suspense>
      </div>
    </>
  );
}
