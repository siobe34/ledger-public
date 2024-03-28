import { NavItem } from "@/components/dashboard-nav/nav-item";
import { MobileMenuButton } from "@/components/mobile-menu-button";
import {
  AreaChart,
  HomeIcon,
  LogOut,
  TableIcon,
  UserRound,
} from "lucide-react";

export const DashboardNavigation = () => {
  return (
    <nav className="flex flex-col flex-wrap gap-2 border-b bg-popover py-4 text-popover-foreground sm:border-b-0 sm:border-r sm:bg-inherit sm:p-4">
      <MobileMenuButton className="peer/menu h-12 w-12 self-center sm:hidden" />
      <div className="grid grid-rows-[0fr] transition-all peer-[.show-menu]/menu:grid-rows-[1fr] sm:grid-rows-[1fr]">
        <div className="overflow-hidden">
          <ul className="flex flex-col items-center gap-0 px-2 py-1 sm:gap-4">
            <li className="w-full">
              <NavItem
                href="/dashboard"
                name="Dashboard Home"
                icon={<HomeIcon />}
              />
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
              <NavItem href="/auth/logout" name="Log Out" icon={<LogOut />} />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
