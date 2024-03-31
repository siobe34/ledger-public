import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfigureUsersTable } from "./configure-users-table/table";

export default function AccountManagementPage() {
  return (
    <section className="flex w-full flex-col items-center justify-start gap-4 px-2 pt-2 sm:items-start">
      <h1 className="text-2xl font-bold underline">Account Management</h1>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-medium">Configure Users</CardTitle>
        </CardHeader>
        <CardContent className="w-fit max-w-full sm:min-w-[50%]">
          <ConfigureUsersTable />
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-medium">
            Configure Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="w-fit max-w-full sm:min-w-[50%]">
          <div>Insert editable table here</div>
        </CardContent>
      </Card>
    </section>
  );
}
