"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { registerChartJSColours } from "@/lib/registerChartJSColours";
import { LaptopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

export const ToggleTheme = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();

  if (theme === "light" || resolvedTheme === "light") {
    registerChartJSColours("light");
  }

  if (theme === "dark" || resolvedTheme === "dark") {
    registerChartJSColours("dark");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="cursor-pointer gap-4"
          onClick={() => setTheme("light")}
        >
          <SunIcon /> Light
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer gap-4"
          onClick={() => setTheme("dark")}
        >
          <MoonIcon /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer gap-4"
          onClick={() => setTheme("system")}
        >
          <LaptopIcon /> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
