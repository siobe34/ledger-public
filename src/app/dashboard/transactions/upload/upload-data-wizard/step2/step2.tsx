import { Step2Checkbox } from "@/app/dashboard/transactions/upload/upload-data-wizard/step2/step2-checkbox";
import { Step2RequiredDropdowns } from "@/app/dashboard/transactions/upload/upload-data-wizard/step2/step2-dropdowns";
import { Step2FileUploader } from "@/app/dashboard/transactions/upload/upload-data-wizard/step2/step2-fileuploader";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/server";

export const Step2 = async () => {
  const users = await api.relatedUsers.get.query();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload your Data</CardTitle>
        <CardDescription>
          Browse and select a CSV file on your system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Step2RequiredDropdowns users={users.map((i) => i.title)} />
        <Step2Checkbox />
      </CardContent>
      <CardFooter>
        <Step2FileUploader />
      </CardFooter>
    </Card>
  );
};
