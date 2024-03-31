import { CategoricalSpendingBarChart } from "@/app/dashboard/summary/monthly/categorical-spending-bar-chart";
import { CategoricalSpendingPieChart } from "@/app/dashboard/summary/monthly/categorical-spending-pie-chart";
import { BalancesByAcctUserTable } from "@/app/dashboard/summary/monthly/data-tables/balances-acc-by-user/table";
import { SavingsByUserTable } from "@/app/dashboard/summary/monthly/data-tables/savings-by-user/table";
import { TotalBalancesByUserTable } from "@/app/dashboard/summary/monthly/data-tables/total-balances-by-user/table";
import { DataParameterSelector } from "@/components/data-parameter-selector/data-parameter-selector";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { inputSchema } from "@/server/api/routers/transaction";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function MonthlySummaryPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const configuredUsers = await api.relatedUsers.get.query();
  const configuredYears = await api.transactions.getPossibleYears.query();

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
      <DataParameterSelector
        configuredUsers={configuredUsers}
        configuredYears={configuredYears}
        {...parsedSearchParams}
      />
      <h2 className="w-full border-b pt-4 text-left text-xl font-medium">
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
      <h2 className="w-full border-b pt-8 text-left text-xl font-medium">
        Monthly Spending by Category
      </h2>
      <div className="flex w-full flex-col flex-wrap justify-around gap-8 sm:flex-row lg:flex-nowrap">
        <Card className="max-w-full flex-1 lg:max-w-[50%]">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Total Spending by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[500px] sm:h-[50vh]">
            <Suspense fallback={<LoadingSpinner />}>
              <CategoricalSpendingPieChart {...parsedSearchParams} />
            </Suspense>
          </CardContent>
        </Card>
        <Card className="max-w-full flex-1 lg:max-w-[50%]">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              User Spending by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[500px] sm:h-[50vh]">
            <Suspense fallback={<LoadingSpinner />}>
              <CategoricalSpendingBarChart {...parsedSearchParams} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
