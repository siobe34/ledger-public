import { AnnualBalanceSummaryType } from "../types/Database";

// * Func to get the total balance of all users by month
export const convertAnnualBalancesByUsertoTotalBalanceByMonth = (data: AnnualBalanceSummaryType[]) => {
    // * Map to store keys/values for annual monthly balance
    const totalAnnualBalances = new Map();

    // * Loop over each month to get balance for that month
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach((month) => {
        // * Filter annualBalanceSummary and only include balances for the current month
        const itemsByMonth = data.filter((item) => item.month === month);

        // * Reduce all debit balances into a single value for the month
        const debit = itemsByMonth
            .filter((item) => item.account === "Debit")
            .reduce((returnItem, currentItem) => currentItem.balance + returnItem, 0);

        // * Reduce all credit balances into a single value for the month
        const credit = itemsByMonth
            .filter((item) => item.account === "Credit")
            .reduce((returnItem, currentItem) => currentItem.balance + returnItem, 0);

        // * If balances exist for the current month then set the total balance (debit - credit) to the total balance for the month
        if (itemsByMonth.length > 0) totalAnnualBalances.set(month, debit - credit);
    });

    // * Return totalAnnualBalances Map as an Array
    return Array.from(totalAnnualBalances.values());
};
