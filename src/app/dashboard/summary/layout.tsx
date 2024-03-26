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
        <button
          type="button"
          role="tab"
          aria-selected="true"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
          tabIndex={0}
        >
          Monthly
        </button>
        <button
          type="button"
          role="tab"
          aria-selected="true"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
          tabIndex={0}
        >
          Annual
        </button>
      </div>
      {children}
    </div>
  );
}
