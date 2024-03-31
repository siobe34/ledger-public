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

export const AddUser = (props: ButtonProps) => {
  const router = useRouter();
  const [modalState, setModalState] = useState(false);
  const [value, setValue] = useState("");

  const { mutate, isLoading } = api.relatedUsers.create.useMutation({
    onError: () => {
      toast.error("Unable to create User at this time. Please try again.");
    },
    onMutate: () =>
      toast("Creating new User", {
        icon: <RefreshCw className="h-4 animate-spin" />,
      }),
    onSuccess: () => {
      router.refresh();
      toast.success(`Successfully created new User: ${value}.`);
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
        <Button {...props}>Add User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Configure a new user here to add transactions for over on the
            Transactions page.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleFormSubmission}
          className="flex flex-col gap-6 pt-6"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="user">User</Label>
            <Input
              name="user"
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
            {!isLoading && "Save New User"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
