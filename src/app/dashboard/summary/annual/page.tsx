import { AnnualBalancesLineChart } from "@/app/dashboard/summary/annual/annual-balances-line-chart";
import { AnnualBalancesTable } from "@/app/dashboard/summary/annual/annual-balances-table/table";
import { LoadingSpinner } from "@/components/loading-spinner";
import { inputSchema } from "@/server/api/routers/transaction";
import { Suspense } from "react";

export default async function AnnualSummaryPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const today = new Date();
  // TODO: better error handling, i.e. add error messages to zod schema and a custom error page?
  const parsedSearchParams = inputSchema.pick({ year: true }).parse({
    year: Number(searchParams.year) || today.getFullYear(),
  });

  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <AnnualBalancesTable {...parsedSearchParams} />
        <div className="flex h-[500px] w-full items-center justify-center">
          <AnnualBalancesLineChart {...parsedSearchParams} />
        </div>
      </Suspense>
    </>
  );
}
