"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUploadTransactionsWizard } from "@/lib/store/upload-transactions-wizard/store";
import { type CheckedState } from "@radix-ui/react-checkbox";
import { type ChangeEvent } from "react";

export const Step1Table = () => {
  const {
    dataCols,
    requiredCols,
    colOrder,
    setAReqCol,
    removeAReqCol,
    setColOrder,
  } = useUploadTransactionsWizard();

  const handleColumnOrder = ({
    event,
    col,
  }: {
    event: ChangeEvent<HTMLInputElement>;
    col: string;
  }) => {
    const value = event.target.value;
    const newOrder = value ? +value : 0;
    setColOrder({ col, newOrder });
  };

  const handleReqdCol = ({
    checked,
    col,
  }: {
    checked: CheckedState;
    col: string;
  }) => {
    if (checked) setAReqCol(col);
    if (!checked) removeAReqCol(col);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Column Name</TableHead>
          <TableHead>Column Order</TableHead>
          <TableHead>Column Included</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dataCols.map((col, idx) => (
          <TableRow key={col}>
            <TableCell className="capitalize">
              {col === "transactionDate" ? "Date" : col}
            </TableCell>
            <TableCell>
              <Input
                type="text"
                defaultValue={colOrder[col] ?? 0}
                onChange={(event) => handleColumnOrder({ event, col })}
                className="w-12 text-center invalid:bg-destructive invalid:text-destructive-foreground invalid:focus-visible:ring-destructive"
                pattern="0?[1-9]"
              />
            </TableCell>
            <TableCell>
              <Checkbox
                defaultChecked={
                  [0, 1, 2, 3, 4].includes(idx)
                    ? true
                    : requiredCols.includes(col)
                      ? true
                      : false
                }
                onCheckedChange={(checked) => handleReqdCol({ checked, col })}
                disabled={[0, 1, 2, 3, 4].includes(idx)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
