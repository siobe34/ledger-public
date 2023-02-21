import { MonthlyBalanceSummaryType } from "../types/Database";

// * Func to remove credit, debit, and savings information from balances grouped by account and user
export const convertMonthlyBalanceSummaryToUserBalanceTable = (data: MonthlyBalanceSummaryType[]) => {
    // * Loop over the data and return the array after removing credit, debit, and savings information
    return [...data].map((item) => {
        // * Initialize empty Map to store account balances by user
        const monthlyUserBalances = new Map<string, string>();

        // * Set the account value from array element
        monthlyUserBalances.set("account", item.account);

        // * Set the user value from array element
        monthlyUserBalances.set("user", item.user);

        // * Set the balance value from array element after formatting a number to a currency string
        monthlyUserBalances.set("balance", Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(item.balance));

        // * Return the Map object as a JSON object
        return Object.fromEntries(monthlyUserBalances.entries());
    });
};
