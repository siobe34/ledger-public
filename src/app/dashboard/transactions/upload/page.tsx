import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function UploadTransactionsPage() {
  const configuredUsers = await api.relatedUsers.get.query();
  const configuredCategories = await api.relatedCategories.get.query();

  if (configuredUsers.length === 0 || configuredCategories.length === 0) {
    redirect("/dashboard/transactions/upload/config-required");
  }

  return (
    <>
      <h1 className="text-2xl font-bold underline">Upload Transactions Data</h1>
      {/* TODO: create this component */}
      {/* <UploadDataWizard /> */}
    </>
  );
}
