import Link from "next/link";

export default function DashboardHome() {
  return (
    <section className="flex w-full max-w-prose flex-col items-center justify-start gap-4 px-2 pt-2 sm:items-start">
      <h1 className="text-2xl font-bold underline">What is Ledger?</h1>
      <p>
        <span className="text-lg font-bold text-primary">Ledger</span> is a tool
        to manage your budget on a transaction-by-transaction level with helpful
        charts to see historical net worth, monthly categorical spending, and
        search personal transactions with a user-friendly interface.
      </p>
      <span className="rounded-md border bg-info p-4 text-center text-info-foreground">
        This is a public demo with a sample dataset of bank transactions. I
        guarantee the spending habits will make no sense, I think several months
        show spending in excess of $65k and I promise you I cannot afford that.
      </span>
      <p>
        Sample data exists only for the year 2024, transactions for each month
        are viewable in a table{" "}
        <Link
          href="/dashboard/transactions"
          className="text-primary hover:underline"
        >
          here
        </Link>
        . Charts and analysis of spending habits can be seen{" "}
        <Link
          href="/dashboard/summary/monthly"
          className="text-primary hover:underline"
        >
          here
        </Link>
        .
      </p>
    </section>
  );
}
