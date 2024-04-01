"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

const COLUMNS = [
  { label: "Date", order: 1 },
  { label: "Description", order: 2 },
  { label: "Debit", order: 3 },
  { label: "Credit", order: 4 },
  { label: "Balance", order: 5 },
  { label: "Category", order: 6 },
  { label: "User", order: 7 },
  { label: "Account", order: 8 },
  { label: "Comments", order: 9 },
];

export default function UploadTransactionsPage() {
  const [api, setApi] = useState<CarouselApi>();
  const [canGoNext, setCanGoNext] = useState(true);
  const [canGoPrev, setCanGoPrev] = useState(false);

  const handleNext = () => {
    api?.scrollNext();

    if (!api?.canScrollNext()) setCanGoNext(false);
    if (api?.canScrollPrev()) setCanGoPrev(true);
  };

  const handlePrevious = () => {
    api?.scrollPrev();

    if (api?.canScrollNext()) setCanGoNext(true);
    if (!api?.canScrollPrev()) setCanGoPrev(false);
  };

  return (
    <>
      <h1 className="text-2xl font-bold underline">Upload Transactions Data</h1>
      <div className="flex w-full flex-wrap items-center justify-center gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={!canGoPrev}
        >
          Previous Step
          <span className="sr-only" aria-disabled={!canGoPrev}>
            Go to previous step in the Uploading Data wizard.
          </span>
        </Button>
        <span className="hidden h-1 flex-grow border bg-border sm:flex" />
        <Button variant="outline" onClick={handleNext} disabled={!canGoNext}>
          Next Step
          <span className="sr-only" aria-disabled={!canGoNext}>
            Go to next step in the Uploading Data wizard.
          </span>
        </Button>
      </div>
      <Carousel setApi={setApi} className="self-center">
        <CarouselContent>
          <CarouselItem>
            <Card className="mx-auto w-4/5 max-w-[80%]">
              <CardHeader>
                <CardTitle>Define your data</CardTitle>
                <CardDescription>
                  Transactions data can be uploaded in CSV format. The required
                  columns for the data are shown below. If your data does not
                  have the required fields then you can still upload what you
                  have and then fill out the missing columns. Making sure to set
                  the order of the columns correctly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Column Name</TableHead>
                      <TableHead>Column Order</TableHead>
                      <TableHead>Column Included</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {COLUMNS.map((col) => (
                      <TableRow key={col.order}>
                        <TableCell>{col.label}</TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            defaultValue={col.order}
                            className="w-12 max-w-full text-center"
                          />
                        </TableCell>
                        <TableCell>
                          <input type="checkbox" defaultChecked />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem>
            <Card className="mx-auto w-4/5 max-w-[80%]">
              <CardHeader>
                <CardTitle>Step 2</CardTitle>
                <CardDescription>Just a test</CardDescription>
              </CardHeader>
              <CardContent>Some other things go here</CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem>
            <Card className="mx-auto w-4/5 max-w-[80%]">
              <CardHeader>
                <CardTitle>Step 3</CardTitle>
                <CardDescription>
                  Testing some more and writing a bit more too, just another
                  half sentence.
                </CardDescription>
              </CardHeader>
              <CardContent>Much shorter</CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </>
  );
}
