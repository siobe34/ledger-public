import { PieChart } from "@/components/pie-chart";
import { type RequestTransactionData } from "@/server/api/routers/transaction";
import { api } from "@/trpc/server";

export const CategoricalSpendingPieChart = async ({
  account,
  user,
  month,
  year,
}: RequestTransactionData) => {
  const sumPerCategoryWithIncome =
    await api.transactions.getMonthlyCategoricalSpending.query({
      account,
      user,
      month,
      year,
    });
  const categoricalSpending = sumPerCategoryWithIncome.filter(
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
            text: "Monthly Categorical Spending By User",
          },
        },
      }}
    />
  );
};
