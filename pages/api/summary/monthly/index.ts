import type { NextApiRequest, NextApiResponse } from "next";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { randomUUID } from "crypto";

import { NotificationType } from "../../../../types/INotifications";
import { queryTransactions } from "../../../../lib/queryTransactions";

// TODO review comments and logic
const monthlySummaryHandler = async (req: NextApiRequest, res: NextApiResponse) => {
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
        // * Query transactions by logged in user's email for the provided month and year, ignoring potential "Credit Card" and "Income" categories
        const dbMonthlyCategoricalSummaryByUser = await queryTransactions(
            user.email,
            {
                year: Number(req.query.year),
                month: Number(req.query.month),
                category: { $nin: ["Credit Card", "Income"] },
            },
            {
                $group: {
                    _id: { user: "$user", category: "$category" },
                    sum: { $sum: { $subtract: ["$debit", "$credit"] } },
                    user: { $first: "$user" },
                    category: { $first: "$category" },
                },
            },
            { $unset: ["_id"] },
        );

        // * Get monthly summary of account balance, income, expenses, and savings by user
        const dbMonthlyBalanceSummary = (
            await queryTransactions(
                user.email,
                {
                    year: Number(req.query.year),
                    month: Number(req.query.month),
                    category: { $nin: ["Credit Card"] },
                },
                {
                    $group: {
                        _id: { user: "$user", account: "$account" },
                        credit: { $sum: "$credit" },
                        debit: { $sum: "$debit" },
                        balance: { $last: "$balance" },
                        user: { $first: "$user" },
                        account: { $first: "$account" },
                    },
                },
                { $unset: ["_id"] },
            )
        ).map((item) => ({ ...item, savings: item.credit - item.debit }));

        // * If no transactions are found to match the query return notification to client
        if (dbMonthlyBalanceSummary.length === 0 || dbMonthlyCategoricalSummaryByUser.length === 0) {
            notifications = [
                {
                    key: randomUUID(),
                    type: "error",
                    description: `Transaction data not found for ${new Date(`${req.query.year}-${req.query.month}-1`).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                    })}.`,
                },
                {
                    key: randomUUID(),
                    type: "info",
                    description: 'New transactions can be uploaded on the "Upload Transactions" page.',
                },
            ];
        } else {
            // * If transactions array is not empty then return a success notification to client
            notifications.push({ key: randomUUID(), type: "success", description: "Monthly Summary successfully loaded." });
        }

        // * Return query results
        return res.status(200).json({
            data: {
                monthlyCategoricalSummaryByUser: dbMonthlyCategoricalSummaryByUser,
                monthlyCategoricalSummary: [...new Set(dbMonthlyCategoricalSummaryByUser.map((item) => item.category))].map((category) => ({
                    category: category,
                    sum: dbMonthlyCategoricalSummaryByUser
                        .filter((item) => item.category === category)
                        .reduce((returnItem, currentItem) => currentItem.sum + returnItem, 0),
                })),
                monthlyAccountBalanceSummary: dbMonthlyBalanceSummary,
            },
            notifications: notifications,
        });
    } catch (e) {
        console.error(e);

        // * Assign notifications to return
        notifications.push({
            key: randomUUID(),
            type: "error",
            description: "Unknown server error encountered while trying to retrieve monthly summary. Please try again.",
        });

        // * Return HTTP 500 unknown server error and respective notifications to client
        return res.status(500).json({ notifications: notifications });
    }
};

export default monthlySummaryHandler;
