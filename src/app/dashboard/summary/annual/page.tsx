import { AnnualBalancesLineChart } from "@/app/dashboard/summary/annual/annual-balances-line-chart";
import { AnnualBalancesTable } from "@/app/dashboard/summary/annual/annual-balances-table/table";
import { AnnualSpendingPieChart } from "@/app/dashboard/summary/annual/annual-spending-pie-chart";
import { CategoricalSpendingTable } from "@/app/dashboard/summary/annual/categorical-spending-table/table";
import { DataParameterSelector } from "@/components/data-parameter-selector/rsc-wrapper";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <h1 className="text-2xl font-bold underline">Annual Summary</h1>
      <DataParameterSelector
        account="%"
        display={{ account: false, month: false, user: false, year: true }}
        month={today.getMonth()}
        user="%"
        year={parsedSearchParams.year}
      />
      <h2 className="w-full border-b pt-4 text-left text-xl font-medium">
        Annual Balances
      </h2>
      <div className="flex w-full flex-col flex-wrap justify-around gap-8 sm:flex-row lg:flex-nowrap">
        <Card className="max-w-full flex-1 lg:max-w-[50%]">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Balances by User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoadingSpinner className="mx-auto" />}>
              <AnnualBalancesTable {...parsedSearchParams} />
            </Suspense>
          </CardContent>
        </Card>
        <Card className="max-w-full flex-1 lg:max-w-[50%]">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Annual Net Worth by Month
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[500px] sm:h-[50vh]">
            <Suspense fallback={<LoadingSpinner className="mx-auto" />}>
              <AnnualBalancesLineChart {...parsedSearchParams} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
      <h2 className="w-full border-b pt-8 text-left text-xl font-medium">
        Categorical Spending
      </h2>
      <div className="flex w-full flex-col flex-wrap justify-around gap-8 sm:flex-row lg:flex-nowrap">
        <Card className="max-w-full flex-1 lg:max-w-[50%]">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Average and Total Spending by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoadingSpinner className="mx-auto" />}>
              <CategoricalSpendingTable {...parsedSearchParams} />
            </Suspense>
          </CardContent>
        </Card>
        <Card className="max-w-full flex-1 lg:max-w-[50%]">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Annual Amount Spent per Category
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[500px] sm:h-[50vh]">
            <Suspense fallback={<LoadingSpinner className="mx-auto" />}>
              <AnnualSpendingPieChart {...parsedSearchParams} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
