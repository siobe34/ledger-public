"use client";

import { TableCell } from "@/components/ui/table";
import { createRef, useEffect } from "react";

const ARROW_KEYS = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];

export const NavigableCell = ({
  children,
  rowIdx,
  colIdx,
}: {
  children: React.ReactNode;
  rowIdx: number;
  colIdx: number;
}) => {
  const ref = createRef<HTMLTableCellElement>();

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const navigationCb = (e: KeyboardEvent) => {
      const key = e.key;

      if (!ARROW_KEYS.includes(key)) {
        return;
      }

      let newRowIdx = rowIdx;
      let newColIdx = colIdx;

      if (key === "ArrowUp") {
        newRowIdx = rowIdx === 0 ? rowIdx : rowIdx - 1;
      }
      if (key === "ArrowRight") {
        newColIdx = colIdx === 8 ? colIdx : colIdx + 1;
      }
      if (key === "ArrowDown") {
        newRowIdx = rowIdx + 1;
      }
      if (key === "ArrowLeft") {
        newColIdx = colIdx === 0 ? colIdx : colIdx - 1;
      }

      const id = `td-${newRowIdx}-${newColIdx}`;

      let element: HTMLElement | null = document.querySelector(`#${id}>button`);

      if (!element) {
        element = document.querySelector(`#${id} > input`);
      }

      element?.focus();
    };

    currentRef.addEventListener("keydown", navigationCb);

    return () => {
      currentRef.removeEventListener("keydown", navigationCb);
    };
  }, [ref, rowIdx, colIdx]);

  return (
    <TableCell ref={ref} id={`td-${rowIdx}-${colIdx}`}>
      {children}
    </TableCell>
  );
};
