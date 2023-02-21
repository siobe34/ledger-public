import { MonthlyBalanceSummaryType } from "../types/Database";

// * Func to convert balances grouped by account and user to total balances grouped by user
export const convertMonthlyAccountBalanceToTotalBalance = (data: MonthlyBalanceSummaryType[]) => {
    // * Initialize empty Map to store total balances by user
    const totalUserBalances = new Map<string, { user: string; balance: string }>();

    // * Get array of unique users in data
    const uniqueUsers = [...new Set(data.map((item) => item.user))];

    // * Loop over each user in data and set the total balance for that user
    uniqueUsers.forEach((user) => {
        // * Filter data to only get accounts for the user being looped over
        const userBalancesByAccount = data.filter((item) => item.user === user);

        // * Get the total "Debit" amount for the user by reducing all accounts of type "Debit" to a single value
        const debit = userBalancesByAccount
            .filter((item) => item.account === "Debit")
            .reduce((returnItem, currentItem) => (returnItem === 0 ? currentItem.balance : currentItem.balance + returnItem), 0);

        // * Get the total "Credit" amount for the user by reducing all accounts of type "Credit" to a single value
        const credit = userBalancesByAccount
            .filter((item) => item.account === "Credit")
            .reduce((returnItem, currentItem) => (returnItem === 0 ? currentItem.balance : currentItem.balance + returnItem), 0);

        // * Set the total balance for the user as the "Credit" value subtracted from the "Debit" value
        totalUserBalances.set(user, {
            user: user,
            // * Format the balance as a number to a currency string
            balance: Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(debit - credit),
        });
    });

    // * Return the total user balances Map as an array
    return Array.from(totalUserBalances.values());
};
