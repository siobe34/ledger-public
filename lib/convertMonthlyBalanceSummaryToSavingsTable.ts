import { MonthlyBalanceSummaryType } from "../types/Database";

// * Func to convert balances grouped by account and user to income, expenses, and savings grouped by user
export const convertMonthlyBalanceSummaryToSavingsTable = (data: MonthlyBalanceSummaryType[]) => {
    // BUG -> income/expenses are not giving correct results
    // SOLUTION -> income should only be the sum of 'Income' category, 'Expenses' should ignore the 'Income' category

    // * Initialize empty Map to store income/expenses/savings by user
    const savingsByUserAccount = new Map<string, { user: string; income: string; expenses: string; savings: string }>();

    // * Get array of unique users in data
    const uniqueUsers = [...new Set(data.map((item) => item.user))];

    // * Loop over each user in data and set the income/expenses/savings for that user
    uniqueUsers.forEach((user) => {
        // * Filter data to only get accounts for the user being looped over
        const balanceByUser = data.filter((item) => item.user === user);

        // * Get the total "Debit" amount for the user by reducing all accounts to a single "Debit" value
        const debit = balanceByUser.reduce((returnItem, currentItem) => (returnItem === 0 ? currentItem.debit : currentItem.debit + returnItem), 0);

        // * Get the total "Credit" amount for the user by reducing all accounts to a single "Credit" value
        const credit = balanceByUser.reduce(
            (returnItem, currentItem) => (returnItem === 0 ? currentItem.credit : currentItem.credit + returnItem),
            0,
        );

        // * Get the total "Savings" amount for the user by reducing all accounts to a single "Savings" value
        const savings = balanceByUser.reduce(
            (returnItem, currentItem) => (returnItem === 0 ? currentItem.savings : currentItem.savings + returnItem),
            0,
        );

        // * Set the income/expenses/savings for the user
        savingsByUserAccount.set(user, {
            user: user,
            // * Format the values as numbers to currency strings
            income: Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(credit),
            expenses: Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(debit),
            savings: Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(savings),
        });
    });

    // * Return the income/expenses/savings Map as an array
    return Array.from(savingsByUserAccount.values());
};
