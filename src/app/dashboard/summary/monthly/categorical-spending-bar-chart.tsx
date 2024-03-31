import { BarChart } from "@/components/bar-chart";
import { type RequestTransactionData } from "@/server/api/routers/transaction";
import { api } from "@/trpc/server";

export const CategoricalSpendingBarChart = async ({
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

  const uniqueUsers = Array.from(
    new Set(categoricalSpending.map((i) => i.user)),
  );

  const uniqueCategories = Array.from(
    new Set(categoricalSpending.map((i) => i.category)),
  );

  const datasetsObj: Array<{ label: string; data: number[] }> = [];

  for (const uniqueUser of uniqueUsers) {
    const usersCategoricalSpending = categoricalSpending.filter(
      (i) => i.user === uniqueUser,
    );
    const userDataArray: number[] = [];

    for (const category of uniqueCategories) {
      const amountSpentByCategory = usersCategoricalSpending
        .filter((i) => i.category === category)
        .map((i) => (i.amount_spent ? +i.amount_spent : 0))
        .reduce((acc, curr) => acc + curr, 0);

      userDataArray.push(amountSpentByCategory);
    }

    datasetsObj.push({ label: uniqueUser, data: userDataArray });
  }

  return (
    <BarChart
      data={{
        labels: uniqueCategories,
        datasets: datasetsObj.map((dataset) => ({
          label: dataset.label,
          data: dataset.data,
          borderRadius: 3,
          barThickness: 30,
        })),
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
