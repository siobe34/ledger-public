"use client";

import { ParameterDropdown } from "@/components/data-parameter-selector/parameter-dropdown";
import { UpdateParametersButton } from "@/components/data-parameter-selector/update-parameters-button";
import { ACCOUNTS } from "@/lib/constants/accounts";
import { DEFAULT_USER } from "@/lib/constants/defaultParameters";
import { MONTHS } from "@/lib/constants/months";
import { getTransactionsSchema } from "@/lib/schemas/trpc-inputs";
import { type UserSelect } from "@/lib/types/global";
import { useState } from "react";
import { z } from "zod";

export type Parameters = {
  [Key in keyof z.infer<typeof getTransactionsSchema>]: {
    label: string;
    value: z.infer<typeof getTransactionsSchema>[Key];
  };
};

type DataParameterSelectorProps = {
  display: Record<keyof Parameters, boolean>;
  configuredUsers: UserSelect[];
  configuredYears: number[];
} & z.infer<typeof getTransactionsSchema>;

export const ClientLogic = (props: DataParameterSelectorProps) => {
  const [account, setAccount] = useState({
    label: props.account === "%" ? "All" : props.account,
    value: props.account,
  });
  const [month, setMonth] = useState({
    label: MONTHS[props.month - 1]!.label,
    value: props.month,
  });
  const [user, setUser] = useState({
    label: props.user === "%" ? "All" : props.user,
    value: props.user,
  });
  const [year, setYear] = useState({
    label: props.year.toString(),
    value: props.year,
  });

  return (
    <div className="flex flex-col flex-wrap items-center justify-center gap-6 p-4 text-sm sm:flex-row sm:items-end sm:px-0">
      <UpdateParametersButton
        account={account}
        month={month}
        user={user}
        year={year}
      />
      <div className="flex flex-wrap items-center justify-center gap-4">
        {props.display.year && (
          <ParameterDropdown
            label="Year"
            dropdownOptions={props.configuredYears.map((year) => ({
              label: year.toString(),
              value: year,
            }))}
            selectedItem={year}
            setSelectedItem={setYear}
          />
        )}
        {props.display.month && (
          <ParameterDropdown
            label="Month"
            dropdownOptions={MONTHS}
            selectedItem={month}
            setSelectedItem={setMonth}
          />
        )}
        {props.display.user && (
          <ParameterDropdown
            label="User"
            dropdownOptions={[
              DEFAULT_USER,
              ...props.configuredUsers.map((user) => ({
                label: user.title,
                value: user.title,
              })),
            ]}
            selectedItem={user}
            setSelectedItem={setUser}
          />
        )}
        {props.display.account && (
          <ParameterDropdown
            label="Account"
            dropdownOptions={ACCOUNTS}
            selectedItem={account}
            setSelectedItem={setAccount}
          />
        )}
      </div>
    </div>
  );
};
