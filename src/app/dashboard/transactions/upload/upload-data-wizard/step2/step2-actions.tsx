import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export const Step2Actions = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 py-4">
      <Link
        href="/dashboard/transactions/upload?step=3"
        className={buttonVariants({ variant: "default" })}
      >
        Step 3
      </Link>
    </div>
  );
};
