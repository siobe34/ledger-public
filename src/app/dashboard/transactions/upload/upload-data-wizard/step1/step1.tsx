import { Step1Table } from "@/app/dashboard/transactions/upload/upload-data-wizard/step1/step1-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InfoIcon } from "lucide-react";

export const Step1 = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Define your data</CardTitle>
        <CardDescription>
          Uploading Transactions data is only supported in CSV format, the
          required columns for the data are shown below. If your data does not
          have all of the required fields then you can still upload what you
          have and fill out the missing columns later in the process.
        </CardDescription>
        <span className="text-info-foreground bg-info border-info-border inline-flex w-fit items-center justify-start gap-2 rounded-md border p-2">
          <InfoIcon />
          Make sure to set the order of the columns correctly, otherwise the
          file will not be read correctly.
        </span>
      </CardHeader>
      <CardContent>
        <Step1Table />
      </CardContent>
    </Card>
  );
};
