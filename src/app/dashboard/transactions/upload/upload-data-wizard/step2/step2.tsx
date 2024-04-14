"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useUploadTransactionsWizard } from "@/lib/store/upload-transactions-wizard/store";
import { api } from "@/trpc/react";
import { createRef, useState } from "react";
import { toast } from "sonner";

export const Step2 = () => {
  const fileRef = createRef<HTMLInputElement>();

  const { data: users } = api.relatedUsers.get.useQuery();
  const [selectedUser, setSelectedUser] = useState("User");
  const [selectedAccount, setSelectedAccount] = useState("Account");

  const { requiredCols } = useUploadTransactionsWizard();
  const needsUser = !requiredCols.includes("User");
  const needsAccount = !requiredCols.includes("Account");

  const handleAccountSelection = (newAccount: string) => {
    setSelectedAccount(newAccount);
  };

  const handleUserSelection = (newUser: string) => {
    setSelectedUser(newUser);
  };

  const handleBrowseForFile = () => {
    const currentRef = fileRef.current;
    if (!currentRef) return;

    currentRef.click();
  };

  const handleFileSelection = async () => {
    const currentRef = fileRef.current;
    if (!currentRef) return;

    const files = currentRef.files;

    if (!files) {
      toast.error("No file selected. Please try again.");
      return;
    }

    if (!files[0]) {
      toast.error("Unexpected error selecting a file. Please try again.");
      return;
    }

    if (files[0].type !== "text/csv") {
      toast.error("Files can only be uploaded in CSV format.");
      return;
    }

    const filePromise = await fetch(URL.createObjectURL(files[0]));
    const fileText = await filePromise.text();
    console.log(fileText);

    // convert the CSV data to JSON
    // save the JSON data in state (types shouldn't matter too much at this stage)
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload your Data</CardTitle>
        <CardDescription>
          Browse and select a CSV file on your system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {(needsAccount || needsUser) && (
          <>
            <p>
              Data must be uploaded for a specific User and a specific Account.
              If the file {"you're"} uploading does not include this
              information, it needs to be specified using the dropdowns below.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pb-8 pt-4">
              {needsAccount && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={
                        selectedAccount === "Account"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {selectedAccount}
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
                    <Button
                      variant={
                        selectedUser === "User" ? "destructive" : "outline"
                      }
                    >
                      {selectedUser}
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
        )}
        <Input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={handleFileSelection}
        />
        <Button
          size="lg"
          onClick={handleBrowseForFile}
          className="self-center justify-self-center"
        >
          Browse
        </Button>
      </CardContent>
    </Card>
  );
};
