import { UploadDataWizard } from "@/app/dashboard/transactions/upload/upload-data-wizard/wizard";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { z } from "zod";

export const dynamic = "force-dynamic";

// TODO: fix url param parsing and zod schema
const test = z.object({ step: z.number() });

export default async function UploadTransactionsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const configuredUsers = await api.relatedUsers.get.query();
  const configuredCategories = await api.relatedCategories.get.query();
  const unsafeParams = { step: searchParams.step && +searchParams.step };

  if (configuredUsers.length === 0 || configuredCategories.length === 0) {
    redirect("/dashboard/transactions/upload/config-required");
  }

  const zodStatus = test.safeParse(unsafeParams);

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
