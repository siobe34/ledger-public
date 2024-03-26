import { AnchorHTMLAttributes } from "react";

type NavItemType = {
  name: string;
  icon: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

const NavItem = ({ name, icon, children, ...props }: NavItemType) => {
  return (
    <a
      {...props}
      className="relative inline-flex cursor-pointer items-center justify-center rounded p-2 after:absolute after:top-full after:mt-2 after:hidden after:w-[130%] sm:relative sm:after:block"
    >
      {icon}
      <span className="z-10 ml-2 sm:absolute sm:left-full sm:hidden sm:whitespace-nowrap sm:rounded sm:px-1 sm:text-sm">
        {name}
      </span>
    </a>
  );
};
export const DashboardNavigation = () => {
  return (
    <nav className="flex flex-col flex-wrap p-8">
      <button className="flex self-center sm:hidden">Mobile Menu Button</button>
      <ul className="hidden flex-col gap-4 sm:flex">
        <li>
          <NavItem href="/annual" name="Annual" icon="X" />
        </li>
      </ul>
    </nav>
  );
};
