"use client";

import {
  DropdownStateful,
  DropdownStatefulProps,
} from "@/components/dropdown-with-state";

export const AccountsDropdown = (
  props: Omit<DropdownStatefulProps, "dropdownOpts">,
) => {
  return <DropdownStateful dropdownOpts={["Credit", "Debit"]} {...props} />;
};
