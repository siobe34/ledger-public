"use client";

import { columns } from "@/app/dashboard/transactions/upload/upload-data-wizard/step3/editable-transactions-table/columns";
import { EditableTransactionsTable } from "@/app/dashboard/transactions/upload/upload-data-wizard/step3/editable-transactions-table/data-table";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useUploadTransactionsWizard } from "@/lib/store/upload-transactions-wizard/store";
import { selectCategoriesSchema, selectUsersSchema } from "@/server/db/schema";
import { z } from "zod";

export const UploadedTransactionsTable = ({
  categories,
  users,
}: {
  categories: z.infer<typeof selectCategoriesSchema>[];
  users: z.infer<typeof selectUsersSchema>[];
}) => {
  const { uploadedData } = useUploadTransactionsWizard();

  if (!uploadedData) return <LoadingSpinner className="mx-auto" />;

  return (
    <EditableTransactionsTable
      categories={categories.map((i) => i.title)}
      users={users.map((i) => i.title)}
      initialData={uploadedData}
      columns={columns}
      searchBar={false}
    />
  );
};
