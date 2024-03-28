import { QueriedTransactionsTable } from "@/app/dashboard/transactions/transactions-data-table/table";
import { DataParameterSelector } from "@/components/data-parameter-selector/data-parameter-selector";
import { inputSchema } from "@/server/api/routers/transaction";
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

  const parsedSearchParams = inputSchema.parse(unsafeParams);

  return (
    <>
      <DataParameterSelector {...parsedSearchParams} />
      {/* // TODO: loading component */}
      <Suspense fallback={<div>Loading Table...</div>}>
        <QueriedTransactionsTable {...parsedSearchParams} />
      </Suspense>
    </>
  );
}
