"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utilsCn";
import { type LucideProps } from "lucide-react";
import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";

type NavItemType = {
  name: string;
  icon: LucideProps;
} & LinkProps;

export const NavItem = ({ name, icon, ...props }: NavItemType) => {
  let pathnameArray = usePathname().split("/");
  let linkPathArray = (props.href as string).split("/");

  if (pathnameArray.length > 3) pathnameArray = pathnameArray.slice(0, 3);
  if (linkPathArray.length > 3) linkPathArray = linkPathArray.slice(0, 3);

  const isLinkActive = pathnameArray.toString() === linkPathArray.toString();

  return (
    <Link
      {...props}
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded py-4 text-foreground/70 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:aspect-square sm:h-8",
        isLinkActive &&
          "border border-primary bg-primary text-primary-foreground hover:text-primary-foreground",
      )}
    >
      <TooltipProvider delayDuration={75}>
        <Tooltip>
          <TooltipTrigger tabIndex={-1}>
            <>{icon}</>
          </TooltipTrigger>
          <TooltipContent side="right" className="hidden sm:block">
            {name}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <span className="inline-flex sm:hidden">{name}</span>
    </Link>
  );
};
