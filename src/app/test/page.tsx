import { CategoricalSpendingBarChart } from "@/app/test/categorical-spending-bar-chart";
import { CategoricalSpendingPieChart } from "@/app/test/categorical-spending-pie-chart";
import { AccountBalanceTables } from "@/app/test/data-table/account-balance-tables";
import { InteractiveTest } from "@/app/test/test-client-interactivity";
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
        <AccountBalanceTables />
      </Suspense>{" "}
      <Suspense fallback={<div>Loading Chart...</div>}>
        <div className="flex h-[500px] w-full items-center justify-center">
          <CategoricalSpendingPieChart {...parsedSearchParams} />
        </div>
      </Suspense>
      <Suspense fallback={<div>Loading Chart...</div>}>
        <div className="flex h-[500px] w-3/4 items-center justify-center">
          <CategoricalSpendingBarChart {...parsedSearchParams} />
        </div>
      </Suspense>
    </div>
  );
}
