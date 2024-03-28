import { cn } from "@/lib/utilsCn";
import { FC, HTMLAttributes } from "react";

export const LoadingSpinner: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn(
        "mt-4 flex h-24 w-24 items-center justify-center self-center",
        className,
      )}
    >
      <div className="h-full w-full animate-spin rounded-full border-8 border-t-primary" />
    </div>
  );
};
