import type { NextApiRequest, NextApiResponse } from "next";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { randomUUID } from "crypto";

import { NotificationType } from "../../../../types/INotifications";
import { TransactionsCollectionType } from "../../../../types/Database";
import dbConnection from "../../../../lib/dbConnection";
import { dbCollections, dbNames } from "../../../../lib/DB_REFERENCES";
import { queryTransactions } from "../../../../lib/queryTransactions";

// TODO review comments and logic
const annualSummaryHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    // * Return HTTP 405 method not allowed if the request is anything other than a GET, POST or PUT request
    if (!req.method || req.method !== "GET") return res.status(405);

    // * Create supabase client on the server side using the browser context
    const supabaseServer = createServerSupabaseClient({ req: req, res: res });

    // * Get user for the browser client requesting data from this page
    const {
        data: { user },
    } = await supabaseServer.auth.getUser();

    // * If no user exists, send notification back to client that user is not logged in
    if (!user || !user.email) {
        return {
            status: 401,
            json: { notifications: [{ type: "error", description: "You don't seem to be logged in. Please sign into your account." }] },
        };
    }

    // * Array to store notifications to send back to client
    let notifications: NotificationType[] = [];

    // * Try to sanitize query parameters and return data from database, otherwise return error notification
    try {
        // * Get database instance
        const client = await dbConnection;
        const db = client.db(dbNames.ledger);

        // * Query transactions by logged in user's email for the provided year
        const dbAnnualBalanceSummary = await queryTransactions(
            user.email,
            {
                year: Number(req.query.year),
            },
            {
                $group: {
                    _id: { user: "$user", account: "$account", month: "$month" },
                    user: { $first: "$user" },
                    account: { $first: "$account" },
                    month: { $first: "$month" },
                    balance: { $last: "$balance" },
                },
            },
            { $unset: ["_id"] },
        );

        // * Get annual expense total and average by category
        const dbAnnualCategorySummary = await db
            .collection<TransactionsCollectionType>(dbCollections.transactions)
            .aggregate([
                {
                    $addFields: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                    },
                },
                {
                    $match: {
                        email: user.email,
                        year: Number(req.query.year),
                        category: { $nin: ["Credit Card", "Income"] },
                    },
                },
                {
                    $sort: { date: 1 },
                },
                {
                    $group: {
                        _id: { category: "$category" },
                        sum: { $sum: { $subtract: ["$debit", "$credit"] } },
                        category: { $first: "$category" },
                        count: { $addToSet: "$month" },
                    },
                },
                {
                    $addFields: { average: { $divide: ["$sum", { $size: "$count" }] } },
                },
                { $unset: ["_id", "count"] },
            ])
            .toArray();

        // * If no transactions are found to match the query return notification to client
        if (dbAnnualBalanceSummary.length === 0 || dbAnnualCategorySummary.length === 0) {
            notifications = [
                {
                    key: randomUUID(),
                    type: "error",
                    description: `Transaction data not found for ${req.query.year}.`,
                },
                {
                    key: randomUUID(),
                    type: "info",
                    description: 'New transactions can be uploaded on the "Upload Transactions" page.',
                },
            ];
        } else {
            // * If transactions array is not empty then return a success notification to client
            notifications.push({ key: randomUUID(), type: "success", description: "Annual Summary successfully loaded." });
        }

        // * Return query results
        return res.status(200).json({
            data: { annualCategoricalSummary: dbAnnualCategorySummary, annualBalanceSummary: dbAnnualBalanceSummary },
            notifications: notifications,
        });
    } catch (e) {
        console.error(e);

        // * Assign notifications to return
        notifications.push({
            key: randomUUID(),
            type: "error",
            description: "Unknown server error encountered while trying to retrieve annual summary. Please try again.",
        });

        // * Return HTTP 500 unknown server error and respective notifications to client
        return res.status(500).json({ notifications: notifications });
    }
};

export default annualSummaryHandler;
