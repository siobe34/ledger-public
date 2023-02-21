import type { NextApiRequest, NextApiResponse } from "next";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { randomUUID } from "crypto";

import { ManageCollectionType } from "../../../types/Database";
import dbConnection from "../../../lib/dbConnection";
import { dbNames, dbCollections } from "../../../lib/DB_REFERENCES";

const upsertManageByEmail = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST" || req.method === "PUT") {
        // * Array to store notifications to send back to client
        const notifications = [];

        // * Create supabase client on the server side using the browser context
        const supabaseServer = createServerSupabaseClient({ req: req, res: res });

        // * Get session for the browser client requesting data from this page
        const {
            data: { user },
        } = await supabaseServer.auth.getUser();

        // * If no user exists, send notification back to client that user is not logged in
        if (!user) {
            notifications.push({ key: randomUUID(), type: "error", description: "You don't seem to be logged in. Please sign into your account." });
            return res.status(401).json({ notifications: notifications });
        }

        // * Connect to mongodb server
        const client = await dbConnection;

        // * Get database instance
        const db = client.db(dbNames.ledger);

        // * Try to update the user's manage document in the database
        try {
            // * Query one document by logged in user's email and update the document's payload
            const updateQuery = await db
                .collection<ManageCollectionType>(dbCollections.manage)
                .updateOne({ email: user.email }, { $set: { payload: req.body.payload } }, { upsert: true });

            // * Return an info notification message if there were no changes to be updated
            if (updateQuery.modifiedCount === 0) {
                notifications.push({ key: randomUUID(), type: "info", description: "No changes needed, your settings are already up to date." });
                return res.status(200).json({ notifications: notifications });
            }

            // * Return a successful notification message if the database was successfully updated
            if (updateQuery.upsertedCount === 1 || updateQuery.modifiedCount === 1) {
                notifications.push({ key: randomUUID(), type: "success", description: "Account management settings successfully updated." });
                return res.status(200).json({ notifications: notifications });
            }

            // * If the api call to the database was successfully completed but the matchCount and modifiedCount are not equal to 1 then reply with an error notification
            notifications.push({
                key: randomUUID(),
                type: "error",
                description:
                    "The client update request was correct but the account management settings were not able to be updated due to an unexpected server error.",
            });
            console.error(updateQuery);
            return res.status(500).json({ notifications: notifications });
        } catch (e) {
            console.error(e);
            // * Return unexpected error if not able to update the database successfully
            notifications.push({
                key: randomUUID(),
                type: "error",
                description: "Unable to update account management settings. Unexpected server error encountered.",
            });
            return res.status(500).json({ notifications: notifications });
        }
    }

    // * Return HTTP 405 method not allowed if the request is anything other than a POST or PUT request
    return res.status(405);
};

export default upsertManageByEmail;
