import { UploadedTransactionsTable } from "@/app/dashboard/transactions/upload/upload-data-wizard/step3/table";
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Step 3</CardTitle>
        <CardDescription>Just a test</CardDescription>
      </CardHeader>
      <CardContent>
        <UploadedTransactionsTable />
      </CardContent>
    </Card>
  );
};
