import { api } from "@/trpc/server";
import { z } from "zod";
import { ClientLogic } from "./data-parameter-selector";

const queryParamsSchema = z.object({
  account: z.enum(["%", "Credit", "Debit"]).optional().default("%"),
  month: z.number(),
  user: z.string().optional().default("%"),
  year: z.number(),
});

export type Parameters = {
  account: { label: string; value: string };
  month: { label: string; value: number };
  user: { label: string; value: string };
  year: { label: string; value: number };
};

type RSCWrapperProps = {
  display?: Partial<Record<keyof Parameters, boolean>>;
} & z.infer<typeof queryParamsSchema>;

export const DataParameterSelector = async ({
  account,
  display,
  month,
  user,
  year,
}: RSCWrapperProps) => {
  const configuredUsers = await api.relatedUsers.get.query();
  const configuredYears = await api.transactions.getPossibleYears.query();

  const displayDropdowns = {
    account: display?.account === false ? false : true,
    month: display?.month === false ? false : true,
    user: display?.user === false ? false : true,
    year: display?.year === false ? false : true,
  };

  return (
    <ClientLogic
      account={account}
      configuredUsers={configuredUsers}
      configuredYears={configuredYears}
      display={displayDropdowns}
      month={month}
      user={user}
      year={year}
    />
  );
};
