import { DashboardNavigation } from "@/components/dashboard-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid h-full w-full grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)] sm:grid-cols-[auto_minmax(0,1fr)] sm:grid-rows-1">
      <DashboardNavigation />
      <div className="flex w-full flex-col items-center justify-start gap-4 p-8 sm:items-start">
        {children}
      </div>
    </div>
  );
}
