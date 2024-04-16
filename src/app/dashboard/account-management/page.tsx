import { ConfiguresCategoriesTable } from "@/app/dashboard/account-management/configure-categories-table/table";
import { ConfigureUsersTable } from "@/app/dashboard/account-management/configure-users-table/table";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function AccountManagementPage() {
  return (
    <section className="flex w-full flex-col items-center justify-start gap-4 px-2 pt-2 sm:items-start">
      <h1 className="text-2xl font-bold underline">Account Management</h1>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-medium">Configure Users</CardTitle>
        </CardHeader>
        <CardContent className="w-fit max-w-full sm:min-w-[50%]">
          <Suspense fallback={<LoadingSpinner className="mx-auto" />}>
            <ConfigureUsersTable />
          </Suspense>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-medium">
            Configure Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="w-fit max-w-full sm:min-w-[50%]">
          <Suspense fallback={<LoadingSpinner className="mx-auto" />}>
            <ConfiguresCategoriesTable />
          </Suspense>
        </CardContent>
      </Card>
    </section>
  );
}
