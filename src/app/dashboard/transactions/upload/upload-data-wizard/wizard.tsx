"use client";

import { Step1 } from "@/app/dashboard/transactions/upload/upload-data-wizard/step1/step1";
import { Step1Actions } from "@/app/dashboard/transactions/upload/upload-data-wizard/step1/step1-actions";
import { Step2 } from "@/app/dashboard/transactions/upload/upload-data-wizard/step2/step2";
import { Step3 } from "@/app/dashboard/transactions/upload/upload-data-wizard/step3/step3";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useUploadTransactionsWizard } from "@/lib/store/upload-transactions-wizard/store";
import { useEffect, useState } from "react";

export const UploadDataWizard = () => {
  const { activeStep, buttonStates, goNextStep, goPrevStep } =
    useUploadTransactionsWizard();

  const [api, setApi] = useState<CarouselApi>();

  const canGoNext = buttonStates[activeStep].canGoNext;
  const canGoPrev = buttonStates[activeStep].canGoPrev;

  const handleNext = () => {
    if (!api) return;
    api.reInit({ active: true });
    api.scrollNext();

    goNextStep();
  };

  const handlePrevious = () => {
    if (!api) return;
    api.reInit({ active: true });
    api.scrollPrev();

    goPrevStep();
  };

  useEffect(() => {
    if (!api) return;

    api.on("settle", () => {
      api.reInit({ active: false });
    });
  }, [api]);

  return (
    <>
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
      <Carousel
        opts={{ active: false, duration: 15 }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent>
          <CarouselItem>
            <Step1Actions />
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
