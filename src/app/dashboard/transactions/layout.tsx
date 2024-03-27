import { NavigationTabs } from "@/components/nested-layout-nav/layout-nav-tabs";
import { TabItem } from "@/components/nested-layout-nav/layout-tab-item";
import { TableIcon, UploadIcon } from "lucide-react";

export default function TransactionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="grid h-full w-full grid-cols-1 grid-rows-[minmax(0,auto)_1fr] px-2 pt-2">
      <NavigationTabs>
        <TabItem href="/dashboard/transactions" className="gap-2">
          <TableIcon />
          View Transactions
        </TabItem>
        <TabItem href="/dashboard/transactions/upload" className="gap-2">
          <UploadIcon />
          Upload Transactions
        </TabItem>
      </NavigationTabs>
      <article className="flex w-full flex-col items-center justify-start sm:items-start">
        {children}
      </article>
    </section>
  );
}
