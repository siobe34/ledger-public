import { BarChart } from "@/components/bar-chart";
import { type RequestTransactionData } from "@/server/api/routers/transaction";
import { api } from "@/trpc/server";

export const CategoricalSpendingBarChart = async ({
  year,
  month,
  account,
  user,
}: RequestTransactionData) => {
  const categoricalSpending = await api.transactions.getMonthlySummary.query({
    account,
    user,
    month,
    year,
  });

  const labels = Array.from(
    new Set(categoricalSpending.map((item) => item.category)),
  );

  const datasetLabels = Array.from(
    new Set(categoricalSpending.map((item) => item.user)),
  );

  const datasets = datasetLabels.map((label) => ({
    data: categoricalSpending
      .filter((record) => record.user === label)
      .map((item) => {
        if (!item.amount_spent) return 0;
        return +item.amount_spent;
      }),
    label: label,
    barThickness: 30,
    borderRadius: 3,
  }));

  return (
    <BarChart
      data={{ labels, datasets }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Monthly Categorical Spending By User",
          },
        },
      }}
    />
  );
};
