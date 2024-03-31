"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

export const AddCategory = (props: ButtonProps) => {
  const router = useRouter();
  const [modalState, setModalState] = useState(false);
  const [value, setValue] = useState("");

  const { mutate, isLoading } = api.relatedCategories.create.useMutation({
    onError: () => {
      toast.error(
        "Unable to create the Category at this time. Please try again.",
      );
    },
    onMutate: () =>
      toast("Creating new Category", {
        icon: <RefreshCw className="h-4 animate-spin" />,
      }),
    onSuccess: () => {
      router.refresh();
      toast.success(`Successfully created new Category: ${value}.`);
      setValue("");
    },
  });

  const handleFormSubmission = (event: FormEvent) => {
    event.preventDefault();

    mutate([{ title: value }]);
    setModalState(false);
  };

  return (
    <Dialog modal open={modalState} onOpenChange={setModalState}>
      <DialogTrigger asChild>
        <Button {...props}>Add Category</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>
            Configure a new category here to add transactions for over on the
            Transactions page.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleFormSubmission}
          className="flex flex-col gap-6 pt-6"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Category</Label>
            <Input
              name="category"
              type="text"
              defaultValue={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </div>
          <Button
            variant="outlinePrimary"
            className="self-end transition-all"
            disabled={isLoading}
          >
            {isLoading && "..."}
            {!isLoading && "Save New Category"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
