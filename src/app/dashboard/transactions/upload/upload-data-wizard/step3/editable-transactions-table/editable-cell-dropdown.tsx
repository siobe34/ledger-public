"use client";

import { type EditableCellProps } from "@/app/dashboard/transactions/upload/upload-data-wizard/step3/editable-transactions-table/editable-cell-input";
import { DropdownStateful } from "@/components/dropdown-with-state";
import { useEffect, useState } from "react";

type EditableCellDropdownProps<TData> = EditableCellProps<TData> & {
  dropdownOpts: string[];
};

export const EditableCellDropdown = <TData,>({
  dropdownOpts,
  getValue,
  id,
  index,
  table,
}: EditableCellDropdownProps<TData>) => {
  const initialValue = getValue() as string;
  const defaultSelectedItem = initialValue.length > 0 ? initialValue : "Select";

  const [selectedItem, setSelectedItem] = useState(defaultSelectedItem);

  useEffect(() => {
    const defaultSelectedItem =
      initialValue.length > 0 ? initialValue : "Select";
    setSelectedItem(defaultSelectedItem);
  }, [initialValue]);

  const handleSelect = (newItem: string) => {
    table.options.meta?.updateData(index, id, newItem);
  };

  return (
    <DropdownStateful
      dropdownOpts={dropdownOpts}
      selectedItem={selectedItem}
      setItemCallback={handleSelect}
      setSelectedItem={setSelectedItem}
      buttonProps={{
        variant: selectedItem === "Select" ? "default" : "outline",
      }}
    />
  );
};
