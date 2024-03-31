"use client";

import {
  columns,
  type UserSavings,
} from "@/app/dashboard/summary/monthly/data-tables/savings-by-user/columns";
import { LoadingSpinner } from "@/components/loading-spinner";
import { DataTable } from "@/components/ui/data-table";
import { dataLoadToastNotifications } from "@/lib/dataLoadToastNotifications";
import { type RequestTransactionData } from "@/server/api/routers/transaction";
import { api } from "@/trpc/react";
import { useEffect } from "react";

export const SavingsByUserTable = ({
  account,
  month,
  user,
  year,
}: RequestTransactionData) => {
  const { data, isError, isLoading, isSuccess } =
    api.transactions.getMonthlySummary.useQuery({
      account,
      month,
      user,
      year,
    });

  useEffect(() => {
    dataLoadToastNotifications({
      isError,
      isLoading,
      isSuccess,
      month,
      year,
      dataLength: data?.length ?? 0,
    });
  }, [isError, isLoading, isSuccess, data, month, year]);

  if (!data) return <LoadingSpinner className="mx-auto" />;

  const sumPerCategoryWithIncome = data;

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
    <Card className="max-w-full flex-1">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Incomes, Expenses, and Savings by User
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={savingsByUser}
          searchBar={false}
          pagination={false}
        />
      </CardContent>
    </Card>
  );
};
