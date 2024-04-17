import { UploadDataWizard } from "@/app/dashboard/transactions/upload/upload-data-wizard/wizard";
import { uploadWizardStepSchema } from "@/lib/schemas/upload-page-wizard";
import { type PageSearchParams } from "@/lib/types/global";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function UploadTransactionsPage({
  searchParams,
}: PageSearchParams) {
  const unsafeParams = { step: searchParams.step && +searchParams.step };

  const configuredUsers = await api.relatedUsers.get.query();
  const configuredCategories = await api.relatedCategories.get.query();

  if (configuredUsers.length === 0 || configuredCategories.length === 0) {
    redirect("/dashboard/transactions/upload/config-required");
  }

  const zodStatus = uploadWizardStepSchema.safeParse(unsafeParams);

  if (!zodStatus.success) {
    redirect("/dashboard/transactions/upload?step=1");
  }

  const parsedSearchParams = zodStatus.data;

  return (
    <>
      <h1 className="text-2xl font-bold underline">Upload Transactions Data</h1>
      <UploadDataWizard {...parsedSearchParams} />
    </>
  );
}
