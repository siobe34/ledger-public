import { LineChart } from "@/components/line-chart";
import { formatTransactionDate } from "@/lib/formatTransactionDate";
import { type RequestTransactionData } from "@/lib/types/global";
import { api } from "@/trpc/server";

export const AnnualBalancesLineChart = async ({
  year,
}: Pick<RequestTransactionData, "year">) => {
  const annualBalancesByUser = await api.transactions.getBalancesByYear.query({
    year,
  });

  const uniqueUsers = Array.from(
    new Set(annualBalancesByUser.map((i) => i.user)),
  );

  const monthNumbers = Array.from(
    new Set(annualBalancesByUser.map((i) => i.month)),
  );
  const monthNames = Array.from(
    new Set(
      annualBalancesByUser.map((i) =>
        formatTransactionDate({
          date: i.transactionDate,
          opts: { month: "short" },
        }),
      ),
    ),
  );

  return (
    <LineChart
      data={{
        labels: monthNames,
        datasets: [
          {
            label: "Total Annual Balance",
            data: monthNumbers.map((month) => {
              const creditBalance = annualBalancesByUser
                .filter((i) => i.month === month && i.account === "Credit")
                .map((i) => (i.balance ? +i.balance : 0))
                .reduce((acc, curr) => acc + curr, 0);

              const debitBalance = annualBalancesByUser
                .filter((i) => i.month === month && i.account === "Debit")
                .map((i) => (i.balance ? +i.balance : 0))
                .reduce((acc, curr) => acc + curr, 0);

              return debitBalance - creditBalance;
            }),
          },
          ...uniqueUsers.map((user) => ({
            label: user,
            data: monthNumbers.map((month) => {
              const creditBalance = annualBalancesByUser
                .filter(
                  (i) =>
                    i.user === user &&
                    i.month === month &&
                    i.account === "Credit",
                )
                .map((i) => (i.balance ? +i.balance : 0))
                .reduce((acc, curr) => acc + curr, 0);

              const debitBalance = annualBalancesByUser
                .filter(
                  (i) =>
                    i.user === user &&
                    i.month === month &&
                    i.account === "Debit",
                )
                .map((i) => (i.balance ? +i.balance : 0))
                .reduce((acc, curr) => acc + curr, 0);

              return debitBalance - creditBalance;
            }),
            hidden: true,
          })),
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 4 },
      }}
    />
  );
};
