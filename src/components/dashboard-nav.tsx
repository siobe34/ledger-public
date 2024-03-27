import { MobileMenuButton } from "@/components/mobile-menu-button";
import { NavItem } from "@/components/nav-item";
import {
  AreaChart,
  HomeIcon,
  LogOut,
  TableIcon,
  UserRound,
} from "lucide-react";

export const DashboardNavigation = () => {
  return (
    <nav className="flex flex-col flex-wrap gap-2 border border-b-0 border-t-0 py-4 sm:p-4">
      <MobileMenuButton className="peer/menu h-12 w-12 self-center sm:hidden" />
      <ul className="hidden flex-col items-center gap-0 bg-slate-200 peer-[.show-menu]/menu:flex sm:flex sm:gap-4">
        <li className="w-full">
          <NavItem href="/" name="Home" icon={<HomeIcon />} />
        </li>
        <li className="w-full">
          <NavItem
            href="/dashboard/account-management"
            name="Account Management"
            icon={<UserRound />}
          />
        </li>
        <li className="w-full">
          <NavItem
            href="/dashboard/transactions"
            name="Transactions"
            icon={<TableIcon />}
          />
        </li>
        <li className="w-full">
          <NavItem
            href="/dashboard/summary/monthly"
            name="Charts & Analysis"
            icon={<AreaChart />}
          />
        </li>
        <li className="w-full">
          <NavItem href="#" name="Log Out" icon={<LogOut />} />
        </li>
      </ul>
    </nav>
  );
};
