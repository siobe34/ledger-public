"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ParameterDropdownProps<T> = {
  label: string | number;
  dropdownOptions: T[];
  selectedItem: T;
  setSelectedItem: React.Dispatch<React.SetStateAction<T>>;
};

export const ParameterDropdown = <
  T extends { label: string; value: string | number | boolean },
>({
  label,
  dropdownOptions,
  selectedItem,
  setSelectedItem,
}: ParameterDropdownProps<T>) => {
  const handleItemSelection = (newItem: typeof selectedItem) => {
    setSelectedItem(newItem);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex flex-col items-center justify-center gap-1"
        asChild
      >
        <div>
          <DropdownMenuLabel>{label}</DropdownMenuLabel>
          <Button variant="outline">{selectedItem.label}</Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent loop align="center">
        {dropdownOptions.map((dropdownItem) => (
          <DropdownMenuItem
            key={dropdownItem.value.toString()}
            className="cursor-pointer justify-center"
            onSelect={() => handleItemSelection(dropdownItem)}
          >
            {dropdownItem.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
