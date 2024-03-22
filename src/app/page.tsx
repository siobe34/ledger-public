import { api } from "@/trpc/server";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <a
        href="/upload"
        className="rounded border border-blue-500 bg-blue-500 px-4 py-2 text-white hover:bg-blue-800 hover:text-slate-300"
      >
        Upload
      </a>
      <Test />
    </main>
  );
}

const Test = async () => {
  const categoricalSpending = await api.transactions.getMonthlySummary.query({
    account: "Debit",
    user: "Ibad",
    year: 2024,
    month: 1,
  });
  const monthlyBalance = await api.transactions.getBalanceByMonth
    .query({
      account: "Debit",
      user: "someone who doesn't exist",
      year: 2024,
      month: 1,
    })
    .catch((e) => console.error(e));

  return (
    <>
      <p>{JSON.stringify(categoricalSpending)}</p>
      <p>{JSON.stringify(monthlyBalance)}</p>
    </>
  );
};
