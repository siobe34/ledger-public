"use client";

import { Input } from "@/components/ui/input";
import type { Getter, Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export type EditableCellProps<TData> = {
  getValue: Getter<unknown>;
  id: string;
  index: number;
  table: Table<TData>;
};

export const EditableCellInput = <TData,>({
  getValue,
  id,
  index,
  table,
}: EditableCellProps<TData>) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    table.options.meta?.updateData(index, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      value={value as string}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
    />
  );
};
