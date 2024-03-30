import { CategoricalSpendingBarChart } from "@/app/dashboard/summary/monthly/categorical-spending-bar-chart";
import { CategoricalSpendingPieChart } from "@/app/dashboard/summary/monthly/categorical-spending-pie-chart";
import { BalancesByAcctUserTable } from "@/app/dashboard/summary/monthly/data-tables/balances-acc-by-user/table";
import { SavingsByUserTable } from "@/app/dashboard/summary/monthly/data-tables/savings-by-user/table";
import { TotalBalancesByUserTable } from "@/app/dashboard/summary/monthly/data-tables/total-balances-by-user/table";
import { DataParameterSelector } from "@/components/data-parameter-selector/data-parameter-selector";
import { LoadingSpinner } from "@/components/loading-spinner";
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
      <DataParameterSelector {...parsedSearchParams} />
      <Suspense fallback={<LoadingSpinner />}>
        <SavingsByUserTable {...parsedSearchParams} />
        <TotalBalancesByUserTable {...parsedSearchParams} />
        <BalancesByAcctUserTable {...parsedSearchParams} />
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
