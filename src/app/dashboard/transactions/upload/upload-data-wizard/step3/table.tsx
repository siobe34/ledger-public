"use client";

import { columns } from "@/app/dashboard/transactions/upload/upload-data-wizard/step3/columns";
import { LoadingSpinner } from "@/components/loading-spinner";
import { DataTable } from "@/components/ui/data-table";
import { useUploadTransactionsWizard } from "@/lib/store/upload-transactions-wizard/store";

export const UploadedTransactionsTable = ({}) => {
  const { uploadedData } = useUploadTransactionsWizard();
  console.log(uploadedData);

  if (!uploadedData) return <LoadingSpinner className="mx-auto" />;

  return <DataTable columns={columns} data={uploadedData} />;
};
