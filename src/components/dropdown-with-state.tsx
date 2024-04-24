"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  type DropdownMenuContentProps,
} from "@/components/ui/dropdown-menu";

export type DropdownStatefulProps = {
  buttonProps?: ButtonProps;
  dropdownOpts: string[];
  selectedItem: DropdownStatefulProps["dropdownOpts"][number];
  setItemCallback?: (item: DropdownStatefulProps["selectedItem"]) => void;
  setSelectedItem:
    | React.Dispatch<
        React.SetStateAction<DropdownStatefulProps["selectedItem"]>
      >
    | ((item: DropdownStatefulProps["selectedItem"]) => void);
} & DropdownMenuContentProps;

export const DropdownStateful = ({
  align = "center",
  buttonProps,
  dropdownOpts,
  selectedItem,
  setItemCallback,
  setSelectedItem,
  ...props
}: DropdownStatefulProps) => {
  const handleSelect = (newItem: DropdownStatefulProps["selectedItem"]) => {
    setSelectedItem(newItem);

    if (setItemCallback) {
      setItemCallback(newItem);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button {...buttonProps}>{selectedItem}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        {...props}
        align={align}
        loop
        className="max-h-24 overflow-y-scroll sm:max-h-max sm:overflow-auto"
      >
        {dropdownOpts.map((dropdownItem) => (
          <DropdownMenuItem
            key={dropdownItem}
            className="cursor-pointer justify-center"
            onSelect={() => handleSelect(dropdownItem)}
          >
            {dropdownItem}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
