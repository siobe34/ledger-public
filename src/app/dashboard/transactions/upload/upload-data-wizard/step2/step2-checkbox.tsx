"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useUploadTransactionsWizard } from "@/lib/store/upload-transactions-wizard/store";

export const Step2Checkbox = () => {
  const { ignoreFirstRow, setIgnoreFirstRow } = useUploadTransactionsWizard();

  const handleChange = () => {
    setIgnoreFirstRow(!ignoreFirstRow);
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <Checkbox
        id="ignore-first-row"
        defaultChecked={ignoreFirstRow}
        onCheckedChange={handleChange}
      />
      <Label htmlFor="ignore-first-row">My Data has Headers</Label>
    </div>
  );
};
