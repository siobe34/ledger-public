import { ToggleTheme } from "@/components/toggle-theme";

export const Header = () => {
  return (
    <header className="flex items-center justify-between gap-4 px-4">
      <div>Ledger</div>
      <ToggleTheme />
    </header>
  );
};
