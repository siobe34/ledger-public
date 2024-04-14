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
          have and then fill out the missing columns.
        </CardDescription>
        {/* TODO: style below to be an "info" alert (like how you see in various docs sites that have useful info in highlighted blocks of text) */}
        <span className="inline-flex w-fit items-center justify-start gap-2 rounded bg-sky-200 px-2 py-1 text-blue-950">
          <InfoIcon />
          Make sure to set the order of the columns correctly.
        </span>
      </CardHeader>
      <CardContent>
        <Step1Table />
      </CardContent>
    </Card>
  );
};
