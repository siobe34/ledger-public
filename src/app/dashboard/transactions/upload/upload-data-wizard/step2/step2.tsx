"use client";
// TODO: remove useclient and make into rsc
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";

export const Step2 = () => {
  // TODO: this entire page can be RSC and this data fetching can take place on server
  const { data: users } = api.relatedUsers.get.useQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload your Data</CardTitle>
        <CardDescription>
          Browse and select a CSV file on your system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* TODO: remove nullish check when rsc */}
        <Step2RequiredDropdowns users={users ?? []} />
        <div className="flex items-center justify-center gap-4">
          <Checkbox id="ignore-first-row" />
          <Label htmlFor="ignore-first-row">My Data has Headers</Label>
        </div>
      </CardContent>
      <CardFooter>
        <Step2FileUploader />
      </CardFooter>
    </Card>
  );
};
