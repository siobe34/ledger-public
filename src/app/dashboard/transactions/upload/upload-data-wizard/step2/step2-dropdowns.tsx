"use client";

import { AccountsDropdown } from "@/components/accounts-dropdown";
import { DropdownStateful } from "@/components/dropdown-with-state";
import { useUploadTransactionsWizard } from "@/lib/store/upload-transactions-wizard/store";

type Props = {
  users: string[];
};

export const Step2RequiredDropdowns = ({ users }: Props) => {
  const { requiredCols, user, account, setUser, setAccount } =
    useUploadTransactionsWizard();

  const needsAccount = !requiredCols.includes("Account");
  const needsUser = !requiredCols.includes("User");

  if (!needsAccount && !needsUser) return null;

  return (
    <>
      <p>
        Data must be uploaded for a specific User and a specific Account. If the
        file {"you're"} uploading does not include this information, it needs to
        be specified using the dropdowns below.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 pb-8 pt-4">
        {needsAccount && (
          <AccountsDropdown
            buttonProps={{
              variant: account === "Account" ? "destructive" : "outline",
            }}
            selectedItem={account}
            setSelectedItem={setAccount}
          />
        )}
        {needsUser && users && (
          <DropdownStateful
            buttonProps={{
              variant: user === "User" ? "destructive" : "outline",
            }}
            dropdownOpts={users}
            selectedItem={user}
            setSelectedItem={setUser}
          />
        )}
      </div>
    </>
  );
};
