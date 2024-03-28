"use client";

import { cn } from "@/lib/utilsCn";
import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";

type TabItemType = {
  children: React.ReactNode;
  className?: string;
} & LinkProps;

export const TabItem = ({ children, className, ...props }: TabItemType) => {
  const pathname = usePathname();

  const isLinkActive = pathname === props.href;

  return (
    <Link
      {...props}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md border border-primary px-3 py-1 text-sm font-medium ring-offset-background transition-all sm:rounded-b-none sm:border-b-0",
        "hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        isLinkActive &&
          "bg-primary text-primary-foreground hover:text-primary-foreground",
        className,
      )}
      role="tab"
    >
      {children}
    </Link>
  );
};
