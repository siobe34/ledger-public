"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export const InteractiveTest = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [user, setUser] = useState(searchParams.get("user") || "");
  const [account, setAccount] = useState(searchParams.get("account") || "");

  const handleClick = () => {
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    const query = `?user=${user || "%"}&account=${account || "%"}&year=${year || "%"}&month=${month || "%"}`;

    router.push(`${pathname}${query}`);
  };
  return (
    <div className="flex gap-12 p-8">
      <input
        name="user"
        type="text"
        placeholder="User"
        defaultValue={smallHelper(user)}
        onChange={(e) => setUser(e.target.value)}
        className="boder-slate-300 rounded border px-4 py-2"
      />
      <input
        name="account"
        type="text"
        placeholder="Account"
        value={smallHelper(account)}
        onChange={(e) => setAccount(e.target.value)}
        className="boder-slate-300 rounded border px-4 py-2"
      />
      <button
        className="rounded bg-blue-500 px-4 py-2 text-white transition-all hover:opacity-85 active:scale-95"
        onClick={() => handleClick()}
      >
        Submit
      </button>
    </div>
  );
};

const smallHelper = (str: string) => (str === "%" ? undefined : str);
