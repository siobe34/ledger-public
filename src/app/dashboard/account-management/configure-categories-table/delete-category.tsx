"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const DeleteCategory = ({ id }: { id: number }) => {
  const router = useRouter();

  const { mutate, isLoading } = api.relatedCategories.delete.useMutation({
    onError: () =>
      toast.error(
        "Unable to delete the Category at this time. Please try again.",
      ),
    onSuccess: () => {
      router.refresh();
      toast.success("Successfully deleted Category.");
    },
  });

  const handleDelete = () => {
    mutate({ id });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="dark:border dark:border-transparent dark:hover:border dark:hover:border-input"
          disabled={isLoading}
        >
          <Trash2Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Deleting a Category cannot be undone. This will not affect your
            Transactions data but will prevent you from adding new data with
            this Category.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete}>
            Delete Category
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
