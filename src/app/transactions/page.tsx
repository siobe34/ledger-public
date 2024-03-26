import { InteractiveTest } from "@/app/test/test-client-interactivity";
import { QueriedTransactionsTable } from "@/app/transactions/data-table/transactions/table";
import { inputSchema } from "@/server/api/routers/transaction";
import { Suspense } from "react";

export default async function Test({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const today = new Date();
  // TODO: better error handling, i.e. add error messages to zod schema and a custom error page?
  const parsedSearchParams = inputSchema.parse({
    year: Number(searchParams.year) || today.getFullYear(),
    month: Number(searchParams.month) || today.getMonth(),
    account: searchParams.account,
    user: searchParams.user,
  });

  return (
    <div className="flex flex-col items-center justify-start">
      <InteractiveTest />
      <Suspense fallback={<div>Loading Chart...</div>}>
        <QueriedTransactionsTable {...parsedSearchParams} />
      </Suspense>{" "}
    </div>
  );
}
