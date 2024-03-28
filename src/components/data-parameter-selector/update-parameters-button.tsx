"use client";

import { type Parameters } from "@/components/data-parameter-selector/data-parameter-selector";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export const UpdateParametersButton = ({
  account,
  month,
  user,
  year,
}: Parameters) => {
  const router = useRouter();
  const pathname = usePathname();

  const refreshQueryParams = () => {
    const query = `?account=${account.value}&month=${month.value}&user=${user.value}&year=${year.value}`;

    router.push(`${pathname}${query}`);
  };
  return (
    <Button variant="outline" onClick={refreshQueryParams} className="gap-2">
      <RefreshCw />
      Refresh Table
    </Button>
  );
};
