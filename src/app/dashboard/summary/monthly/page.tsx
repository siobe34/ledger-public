import { CategoricalSpendingBarChart } from "@/app/dashboard/summary/monthly/categorical-spending-bar-chart";
import { CategoricalSpendingPieChart } from "@/app/dashboard/summary/monthly/categorical-spending-pie-chart";
import { BalancesByAcctUserTable } from "@/app/dashboard/summary/monthly/data-tables/balances-acc-by-user/table";
import { SavingsByUserTable } from "@/app/dashboard/summary/monthly/data-tables/savings-by-user/table";
import { TotalBalancesByUserTable } from "@/app/dashboard/summary/monthly/data-tables/total-balances-by-user/table";
import { LoadingSpinner } from "@/components/loading-spinner";
import { inputSchema } from "@/server/api/routers/transaction";
import { Suspense } from "react";

export default async function MonthlySummaryPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const today = new Date();
  // TODO: better error handling, i.e. add error messages to zod schema and a custom error page?
  const parsedSearchParams = inputSchema.parse({
    year: Number(searchParams.year) ?? today.getFullYear(),
    month: Number(searchParams.month) ?? today.getMonth(),
    account: searchParams.account ?? "%",
    user: searchParams.user ?? "%",
  });

  return (
    <>
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
