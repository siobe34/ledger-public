"use client";
// TODO: remove useclient and make into RSC

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/react";

export const Step3 = () => {
  // TODO: this entire page can be RSC and this data fetching can take place on server
  const { data: categories } = api.relatedCategories.get.useQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 3</CardTitle>
        <CardDescription>Just a test</CardDescription>
      </CardHeader>
      <CardContent>Some other things go here</CardContent>
    </Card>
  );
};
