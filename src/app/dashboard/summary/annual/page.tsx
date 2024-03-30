import { AnnualBalancesLineChart } from "@/app/dashboard/summary/annual/annual-balances-line-chart";
import { AnnualBalancesTable } from "@/app/dashboard/summary/annual/annual-balances-table/table";
import { LoadingSpinner } from "@/components/loading-spinner";
import { inputSchema } from "@/server/api/routers/transaction";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AnnualSummaryPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const today = new Date();
  const unsafeParams = {
    year: searchParams.year ? +searchParams.year : today.getFullYear(),
  };

  if (!searchParams.year) {
    redirect(`/dashboard/summary/annual?year=${unsafeParams.year}`);
  }

  const parsedSearchParams = inputSchema
    .pick({ year: true })
    .parse(unsafeParams);

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
