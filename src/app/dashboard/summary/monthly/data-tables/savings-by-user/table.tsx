import {
  type UserSavings,
  columns,
} from "@/app/dashboard/summary/monthly/data-tables/savings-by-user/columns";
import { DataTable } from "@/components/ui/data-table";
import { type RequestTransactionData } from "@/server/api/routers/transaction";
import { api } from "@/trpc/server";

export const SavingsByUserTable = async ({
  year,
  month,
  account,
  user,
}: RequestTransactionData) => {
  const sumPerCategoryWithIncome =
    await api.transactions.getMonthlySummary.query({
      year,
      month,
      account,
      user,
    });

  const uniqueUsers = Array.from(
    new Set(sumPerCategoryWithIncome.map((i) => i.user)),
  );

  const savingsByUser: UserSavings[] = [];

  for (const uniqueUser of uniqueUsers) {
    const income = sumPerCategoryWithIncome
      .filter((i) => i.user === uniqueUser && i.category === "Income")
      .map((i) => (i.amount_spent ? +i.amount_spent * -1 : 0))
      .reduce((acc, curr) => acc + curr, 0);

    const expenses = sumPerCategoryWithIncome
      .filter((i) => i.user === uniqueUser && i.category !== "Income")
      .map((i) => (i.amount_spent ? +i.amount_spent : 0))
      .reduce((acc, curr) => acc + curr, 0);

    const savings = income - expenses;

    savingsByUser.push({ user: uniqueUser, income, expenses, savings });
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={savingsByUser}
        searchBar={false}
        pagination={false}
      />
    </div>
  );
};
