import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type LucideProps } from "lucide-react";
import Link, { type LinkProps } from "next/link";

type NavItemType = {
  name: string;
  icon: LucideProps;
} & LinkProps;

export const NavItem = ({ name, icon, ...props }: NavItemType) => {
  return (
    <Link
      {...props}
      className="inline-flex w-full items-center justify-center gap-2 rounded py-4"
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
