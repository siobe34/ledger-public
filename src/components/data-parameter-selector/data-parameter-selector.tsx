"use client";

import { ParameterDropdown } from "@/components/data-parameter-selector/parameter-dropdown";
import { UpdateParametersButton } from "@/components/data-parameter-selector/update-parameters-button";
import { useState } from "react";
import { z } from "zod";

// TODO: move to separate file
// TODO: find a common place to put this as it is the same code as "inputSchema"
const queryParamsSchema = z.object({
  account: z.enum(["%", "Credit", "Debit"]).optional().default("%"),
  month: z.number(),
  user: z.string().optional().default("%"),
  year: z.number(),
});

// TODO: move to separate file
const MONTHS = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];
const ACCOUNTS = [
  { label: "All", value: "%" },
  { label: "Credit", value: "Credit" },
  { label: "Debit", value: "Debit" },
];

export type Parameters = {
  account: { label: string; value: string };
  month: { label: string; value: number };
  user: { label: string; value: string };
  year: { label: string; value: number };
};

export const DataParameterSelector = (
  props: z.infer<typeof queryParamsSchema>,
) => {
  const [account, setAccount] = useState<Parameters["account"]>({
    label: props.account === "%" ? "All" : props.account,
    value: props.account,
  });
  const [month, setMonth] = useState<Parameters["month"]>({
    label: MONTHS[props.month - 1]!.label,
    value: props.month,
  });
  const [user, setUser] = useState<Parameters["user"]>({
    label: props.user === "%" ? "All" : props.user,
    value: props.user,
  });
  const [year, setYear] = useState<Parameters["year"]>({
    label: props.year.toString(),
    value: props.year,
  });

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4 text-sm sm:flex-row sm:items-end sm:px-0">
      <UpdateParametersButton
        account={account}
        month={month}
        user={user}
        year={year}
      />
      <div className="flex flex-wrap items-center justify-center gap-4">
        <ParameterDropdown
          label="Year"
          dropdownOptions={[
            { label: "2020", value: 2020 },
            { label: "2023", value: 2023 },
            { label: "2024", value: 2024 },
            { label: "2025", value: 2025 },
          ]}
          selectedItem={year}
          setSelectedItem={setYear}
        />
        <ParameterDropdown
          label="Month"
          dropdownOptions={MONTHS}
          selectedItem={month}
          setSelectedItem={setMonth}
        />
        <ParameterDropdown
          label="User"
          dropdownOptions={[
            { label: "All", value: "%" },
            { label: "Ibad", value: "Ibad" },
            { label: "Khadija", value: "Khadija" },
          ]}
          selectedItem={user}
          setSelectedItem={setUser}
        />
        <ParameterDropdown
          label="Account"
          dropdownOptions={ACCOUNTS}
          selectedItem={account}
          setSelectedItem={setAccount}
        />
      </div>
    </div>
  );
};
