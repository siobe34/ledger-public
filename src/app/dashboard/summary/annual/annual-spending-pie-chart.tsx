import { PieChart } from "@/components/pie-chart";
import { type RequestTransactionData } from "@/lib/types/global";
import { api } from "@/trpc/server";

export const AnnualSpendingPieChart = async ({
  year,
}: Pick<RequestTransactionData, "year">) => {
  const categoricalDataWithIncome =
    await api.transactions.getAnnualCategoricalSpending.query({
      year,
    });
  const categoricalSpending = categoricalDataWithIncome.filter(
    (i) => i.category !== "Income",
  );

  const labels = Array.from(
    new Set(categoricalSpending.map((i) => i.category)),
  );

  const amountByCategory = labels.map((category) =>
    categoricalSpending
      .filter((i) => i.category === category)
      .map((i) => (i.amount_spent ? +i.amount_spent : 0))
      .reduce((pv, cv) => pv + cv),
  );

  return (
    <PieChart
      data={{
        labels,
        datasets: [
          {
            label: "Amount Spent",
            data: amountByCategory,
            borderWidth: 0,
            hoverBorderWidth: 1,
            hoverOffset: 10,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: false,
            text: "Annual Categorical Spending",
          },
        },
      }}
    />
  );
};
