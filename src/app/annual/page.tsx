import { AnnualBalancesLineChart } from "@/app/annual/annual-balances-line-chart";
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
  const parsedSearchParams = inputSchema.pick({ year: true }).parse({
    year: Number(searchParams.year) || today.getFullYear(),
  });

  return (
    <div className="flex flex-col items-center justify-start">
      <InteractiveTest />
      <Suspense fallback={<div>Loading Chart...</div>}>
        <div className="flex h-[500px] w-full items-center justify-center">
          <AnnualBalancesLineChart {...parsedSearchParams} />
        </div>
      </Suspense>{" "}
    </div>
  );
}
