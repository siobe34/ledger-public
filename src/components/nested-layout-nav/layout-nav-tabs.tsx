export const NavigationTabs = ({ children }: { children: React.ReactNode }) => {
  return (
    <nav
      role="tablist"
      aria-orientation="horizontal"
      tabIndex={-1}
      className="flex w-full flex-col justify-center gap-4 border-b border-b-primary/50 pb-4 text-muted-foreground sm:flex-row sm:items-center sm:justify-start sm:pb-0"
    >
      {children}
    </nav>
  );
};
