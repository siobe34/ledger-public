import Link, { type LinkProps } from "next/link";

type NavItemType = {
  name: string;
  icon: string;
} & LinkProps;

const NavItem = ({ name, icon, ...props }: NavItemType) => {
  return (
    <Link
      {...props}
      className="relative inline-flex cursor-pointer items-center justify-center rounded p-2 after:absolute after:top-full after:mt-2 after:hidden after:w-[130%] sm:relative sm:after:block"
    >
      {icon}
      <span className="z-10 ml-2 sm:absolute sm:left-full sm:hidden sm:whitespace-nowrap sm:rounded sm:px-1 sm:text-sm">
        {name}
      </span>
    </Link>
  );
};
export const DashboardNavigation = () => {
  return (
    <nav className="flex flex-col flex-wrap p-8">
      <button className="flex self-center sm:hidden">Mobile Menu Button</button>
      <ul className="hidden flex-col gap-4 sm:flex">
        <li>
          <NavItem
            href="/dashboard/account-management"
            name="Account Management"
            icon="X"
          />
        </li>
        <li>
          <NavItem
            href="/dashboard/transactions"
            name="Transactions"
            icon="Y"
          />
        </li>
        <li>
          <NavItem
            href="/dashboard/summary/monthly"
            name="Charts & Analysis"
            icon="Z"
          />
        </li>
      </ul>
    </nav>
  );
};
