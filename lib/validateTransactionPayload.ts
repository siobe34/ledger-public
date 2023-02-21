import { v4 as uuid } from "uuid";

import { ManageCollectionType, TransactionsCollectionType } from "../types/Database";
import { NotificationType } from "../types/INotifications";

export const validateTransactionPayload = (manage: ManageCollectionType["payload"], transactions: TransactionsCollectionType[]) => {
    const notifications: NotificationType[] = [];

    for (const category of [...new Set(transactions.map((item) => item.category))]) {
        // * 1. Each Category must be in categories array
        if (!manage.categories.includes(category)) {
            notifications.push({
                key: uuid(),
                type: "error",
                description: `"${category}" must exist in the 'Categories' list on the account management page.`,
            });
        }
    }

    for (const user of [...new Set(transactions.map((item) => item.user))]) {
        // * 2. Each User must be in users array
        if (!manage.users.includes(user)) {
            notifications.push({
                key: uuid(),
                type: "error",
                description: `"${user}" must exist in the 'Users' list on the account management page.`,
            });
        }
    }

    for (const account of [...new Set(transactions.map((item) => item.account))]) {
        // * 3. Each Account must be 'Debit' or 'Credit'
        if (!["Debit", "Credit"].includes(account)) {
            notifications.push({
                key: uuid(),
                type: "error",
                description: `"${account}" is an invalid account name. Account must be "Debit" or "Credit".`,
            });
        }
    }

    // * 4. Dates must be valid date
    // BUG -> unhandled: dates are not validated. I hate javascript, why is working with dates so difficult

    // * Validate the payload
    return notifications;
};
