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
import { useState } from "react";

export const UploadDataWizard = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [wizardStepManager, setWizardStepManager] = useState<{
    activeStep: 1 | 2 | 3;
    canGoNext: boolean;
    canGoPrev: boolean;
  }>({
    activeStep: 1,
    canGoNext: false,
    canGoPrev: false,
  });

  const handleNext = () => {
    api?.scrollNext();

    if (!api?.canScrollNext()) {
      setWizardStepManager((prevState) => ({ ...prevState, canGoNext: false }));
    }
    if (api?.canScrollPrev()) {
      setWizardStepManager((prevState) => ({ ...prevState, canGoPrev: true }));
    }
  };

  const handlePrevious = () => {
    api?.scrollPrev();

    if (api?.canScrollNext()) {
      setWizardStepManager((prevState) => ({ ...prevState, canGoNext: true }));
    }
    if (!api?.canScrollPrev()) {
      setWizardStepManager((prevState) => ({ ...prevState, canGoPrev: false }));
    }
  };

  return (
    <>
      <div className="flex w-full flex-wrap items-center justify-center gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={!wizardStepManager.canGoPrev}
        >
          Previous Step
          <span
            className="sr-only"
            aria-disabled={!wizardStepManager.canGoPrev}
          >
            Go to previous step in the Uploading Data wizard.
          </span>
        </Button>
        <span className="hidden h-1 flex-grow border bg-border sm:flex" />
        <Button
          variant="outline"
          onClick={handleNext}
          disabled={!wizardStepManager.canGoNext}
        >
          Next Step
          <span
            className="sr-only"
            aria-disabled={!wizardStepManager.canGoNext}
          >
            Go to next step in the Uploading Data wizard.
          </span>
        </Button>
      </div>
      <Carousel setApi={setApi} className="self-center">
        <CarouselContent>
          <CarouselItem>
            <Step1 />
          </CarouselItem>
          <CarouselItem>
            <Step2 />
          </CarouselItem>
          <CarouselItem>
            <Step3 />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </>
  );
};

const Step1 = () => {
  return (
    <Card className="max-w-[80%]">
      <CardHeader>
        <CardTitle>Step 1</CardTitle>
        <CardDescription>Just a test</CardDescription>
      </CardHeader>
      <CardContent>Some other things go here</CardContent>
    </Card>
  );
};

const Step2 = () => {
  return (
    <Card className="max-w-[80%]">
      <CardHeader>
        <CardTitle>Step 2</CardTitle>
        <CardDescription>Just a test</CardDescription>
      </CardHeader>
      <CardContent>Some other things go here</CardContent>
    </Card>
  );
};

const Step3 = () => {
  return (
    <Card className="max-w-[80%]">
      <CardHeader>
        <CardTitle>Step 3</CardTitle>
        <CardDescription>Just a test</CardDescription>
      </CardHeader>
      <CardContent>Some other things go here</CardContent>
    </Card>
  );
};
