import Link from "next/link";

export default function SummaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        role="tablist"
        aria-orientation="horizontal"
        tabIndex={-1}
        className="grid h-9 w-full grid-cols-2 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground"
      >
        <Link
          href="/dashboard/summary/monthly"
          tabIndex={0}
          aria-selected="true"
          role="tab"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
        >
          Monthly Summary
        </Link>
        <Link
          href="/dashboard/summary/annual"
          tabIndex={0}
          aria-selected="true"
          role="tab"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
        >
          Annual Summary
        </Link>
      </div>
      {children}
    </div>
  );
}
