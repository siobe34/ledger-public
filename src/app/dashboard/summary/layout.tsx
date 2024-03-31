import { NavigationTabs } from "@/components/nested-layout-nav/layout-nav-tabs";
import { TabItem } from "@/components/nested-layout-nav/layout-tab-item";
import { LineChartIcon, PieChartIcon } from "lucide-react";

export default function SummaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="grid h-full w-full grid-cols-1 grid-rows-[minmax(0,auto)_1fr] px-2 pt-2">
      <NavigationTabs>
        <TabItem href="/dashboard/summary/monthly" className="gap-2">
          <PieChartIcon />
          Monthly Summary
        </TabItem>
        <TabItem href="/dashboard/summary/annual" className="gap-2">
          <LineChartIcon />
          Annual Summary
        </TabItem>
      </NavigationTabs>
      <article className="flex w-full flex-col items-center justify-start gap-4 pt-6 sm:items-start">
        {children}
      </article>
    </section>
  );
}
