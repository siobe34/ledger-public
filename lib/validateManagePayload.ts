import { v4 as uuid } from "uuid";

import { ManageCollectionType } from "../types/Database";
import { NotificationType } from "../types/INotifications";
import { arrayPrimsHasDuplicates } from "./arrayHasDuplicates";
import { arrayHasEmpty } from "./arrayHasEmpty";

export const validateManagePayload = (payload: ManageCollectionType["payload"]): { status: boolean; notifications: NotificationType[] } => {
    const users = payload.users;
    const categories = payload.categories;

    // * If either the users, categories, or accounts do not exist then do not validate the payload
    if (!users || !categories) {
        return {
            status: false,
            notifications: [
                {
                    key: uuid(),
                    type: "error",
                    description: "Account settings cannot be saved while any of the users, categories, or accounts information is empty.",
                },
            ],
        };
    }

    // * If the users array has any duplicates then do not validate the payload
    if (arrayPrimsHasDuplicates(users.map((user) => user.toLowerCase()))) {
        return {
            status: false,
            notifications: [
                { key: uuid(), type: "error", description: "The list of users may not include any duplicated values." },
                { key: uuid(), type: "info", description: "Case-sensitivity is ignored so please choose names of users carefully." },
            ],
        };
    }

    // * If the categories array has any empty strings then do not validate the payload
    if (arrayHasEmpty(users)) {
        return { status: false, notifications: [{ key: uuid(), type: "error", description: "The list of users may not include any empty values." }] };
    }

    // * If the categories array has any duplicates then do not validate the payload
    if (arrayPrimsHasDuplicates(categories.map((category) => category.toLowerCase()))) {
        return {
            status: false,
            notifications: [
                { key: uuid(), type: "error", description: "The list of categories may not include any duplicated values." },
                { key: uuid(), type: "info", description: "Case-sensitivity is ignored so please choose names of categories carefully." },
            ],
        };
    }

    // * If the categories array has any empty strings then do not validate the payload
    if (arrayHasEmpty(categories)) {
        return {
            status: false,
            notifications: [{ key: uuid(), type: "error", description: "The list of categories may not include any empty values." }],
        };
    }

    // * Validate the payload
    return {
        status: true,
        notifications: [
            { key: uuid(), type: "success", description: "The account settings have been successfully validated and are now being saved." },
        ],
    };
};
