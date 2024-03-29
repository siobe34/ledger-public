import { Logo } from "@/components/logo";
import { ToggleTheme } from "@/components/toggle-theme";

export const Header = () => {
  return (
    <header className="flex items-center justify-between gap-4 border-b px-4 py-2">
      <Logo />
      <ToggleTheme />
    </header>
  );
};
