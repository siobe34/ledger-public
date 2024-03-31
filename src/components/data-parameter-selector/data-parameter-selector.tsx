"use client";

import { ParameterDropdown } from "@/components/data-parameter-selector/parameter-dropdown";
import { UpdateParametersButton } from "@/components/data-parameter-selector/update-parameters-button";
import { ACCOUNTS } from "@/lib/constants/accounts";
import { DEFAULT_USER } from "@/lib/constants/defaultParameters";
import { MONTHS } from "@/lib/constants/months";
import { selectUsersSchema } from "@/server/db/schema";
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

// TODO: move all types and zod schemas to one place
export type Parameters = {
  account: { label: string; value: string };
  month: { label: string; value: number };
  user: { label: string; value: string };
  year: { label: string; value: number };
};

type DataParameterSelectorProps = {
  display?: Partial<Record<keyof Parameters, boolean>>;
  configuredUsers: Array<z.infer<typeof selectUsersSchema>>;
  configuredYears: number[];
} & z.infer<typeof queryParamsSchema>;

export const DataParameterSelector = (props: DataParameterSelectorProps) => {
  const displayDropdowns = {
    account: props.display?.account === false ? false : true,
    month: props.display?.month === false ? false : true,
    user: props.display?.user === false ? false : true,
    year: props.display?.year === false ? false : true,
  };

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
    <div className="flex flex-col flex-wrap items-center justify-center gap-6 p-4 text-sm sm:flex-row sm:items-end sm:px-0">
      <UpdateParametersButton
        account={account}
        month={month}
        user={user}
        year={year}
      />
      <div className="flex flex-wrap items-center justify-center gap-4">
        {displayDropdowns.year && (
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
        {displayDropdowns.month && (
          <ParameterDropdown
            label="Month"
            dropdownOptions={MONTHS}
            selectedItem={month}
            setSelectedItem={setMonth}
          />
        )}
        {displayDropdowns.user && (
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
        {displayDropdowns.account && (
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
