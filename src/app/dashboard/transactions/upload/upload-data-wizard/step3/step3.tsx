import { columns } from "@/app/dashboard/transactions/upload/upload-data-wizard/step3/editable-transactions-table/columns";
import { EditableTransactionsTable } from "@/app/dashboard/transactions/upload/upload-data-wizard/step3/editable-transactions-table/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/server";

export const Step3 = async () => {
  const categories = await api.relatedCategories.get.query();
  const users = await api.relatedUsers.get.query();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Step 3</CardTitle>
        <CardDescription>Just a test</CardDescription>
      </CardHeader>
      <CardContent>
        <EditableTransactionsTable
          categories={categories.map((i) => i.title)}
          users={users.map((i) => i.title)}
          columns={columns}
          searchBar={false}
        />
      </CardContent>
    </Card>
  );
};
