"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUploadTransactionsWizard } from "@/lib/store/upload-transactions-wizard/store";
import { selectUsersSchema } from "@/server/db/schema";
import { z } from "zod";

type Props = {
  users: z.infer<typeof selectUsersSchema>[];
};

export const Step2RequiredDropdowns = ({ users }: Props) => {
  const { requiredCols, user, account, setUser, setAccount } =
    useUploadTransactionsWizard();

  const needsAccount = !requiredCols.includes("Account");
  const needsUser = !requiredCols.includes("User");

  if (!needsAccount && !needsUser) return null;

  const handleAccountSelection = (newAccount: string) => {
    setAccount(newAccount);
  };

  const handleUserSelection = (newUser: string) => {
    setUser(newUser);
  };

  return (
    <>
      <p>
        Data must be uploaded for a specific User and a specific Account. If the
        file {"you're"} uploading does not include this information, it needs to
        be specified using the dropdowns below.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 pb-8 pt-4">
        {needsAccount && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={account === "Account" ? "destructive" : "outline"}
              >
                {account}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent loop align="center">
              {["Credit", "Debit"].map((dropdownItem) => (
                <DropdownMenuItem
                  key={dropdownItem}
                  className="cursor-pointer justify-center"
                  onSelect={() => handleAccountSelection(dropdownItem)}
                >
                  {dropdownItem}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {needsUser && users && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={user === "User" ? "destructive" : "outline"}>
                {user}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent loop align="center">
              {users.map((dropdownItem) => (
                <DropdownMenuItem
                  key={dropdownItem.id.toString()}
                  className="cursor-pointer justify-center"
                  onSelect={() => handleUserSelection(dropdownItem.title)}
                >
                  {dropdownItem.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </>
  );
};
