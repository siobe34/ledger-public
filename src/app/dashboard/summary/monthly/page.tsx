import { CategoricalSpendingBarChart } from "@/app/dashboard/summary/monthly/categorical-spending-bar-chart";
import { CategoricalSpendingPieChart } from "@/app/dashboard/summary/monthly/categorical-spending-pie-chart";
import { BalancesByAcctUserTable } from "@/app/dashboard/summary/monthly/data-tables/balances-acc-by-user/table";
import { SavingsByUserTable } from "@/app/dashboard/summary/monthly/data-tables/savings-by-user/table";
import { TotalBalancesByUserTable } from "@/app/dashboard/summary/monthly/data-tables/total-balances-by-user/table";
import { DataParameterSelector } from "@/components/data-parameter-selector/data-parameter-selector";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { inputSchema } from "@/server/api/routers/transaction";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function MonthlySummaryPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
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
      `/dashboard/summary/monthly?account=${unsafeParams.account ?? "%"}&month=${unsafeParams.month}&user=${unsafeParams.user ?? "%"}&year=${unsafeParams.year}`,
    );
  }

  const parsedSearchParams = inputSchema.parse(unsafeParams);

  return (
    <>
      <h1 className="text-2xl font-bold underline">Monthly Summary</h1>
      <DataParameterSelector {...parsedSearchParams} />
      <h2 className="w-full border-b text-left text-xl font-medium">
        Monthly Balances
      </h2>
      <div className="flex w-full flex-col flex-wrap justify-around gap-8 sm:flex-row">
        <Card className="max-w-full flex-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Incomes, Expenses, and Savings by User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SavingsByUserTable {...parsedSearchParams} />
          </CardContent>
        </Card>
        <BalancesByAcctUserTable {...parsedSearchParams} />
        <TotalBalancesByUserTable {...parsedSearchParams} />
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <div className="flex h-[500px] w-full items-center justify-center">
          <CategoricalSpendingPieChart {...parsedSearchParams} />
        </div>
        <div className="flex h-[500px] w-3/4 items-center justify-center">
          <CategoricalSpendingBarChart {...parsedSearchParams} />
        </div>
      </Suspense>
    </>
  );
}
