import type { NextApiRequest, NextApiResponse } from "next";

import { createServerSupabaseClient, User } from "@supabase/auth-helpers-nextjs";
import { randomUUID } from "crypto";

import { NotificationType } from "../../../types/INotifications";
import { TransactionsCollectionType } from "../../../types/Database";
import dbConnection from "../../../lib/dbConnection";
import { dbNames, dbCollections } from "../../../lib/DB_REFERENCES";

const queryTransactions = async (req: NextApiRequest, user: User) => {
    // * Array to store notifications to send back to client
    let notifications: NotificationType[];

    // BUG unhandled -> if db client or db instance cannot be successfully connected -> FIX EVERYWHERE
    // * Connect to mongodb server
    const client = await dbConnection;

    // * Get database instance
    const db = client.db(dbNames.ledger);

    // * Try to sanitize query parameters and return data from database, otherwise return error notification
    try {
        // * Clean request query parameters
        Object.keys(req.query).forEach((key) => req.query[key] === "All" && delete req.query[key]);

        // * Query transactions by logged in user's email and query parameters
        const queriedTransactions = await db
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
                        ...req.query,
                        year: Number(req.query.year),
                        month: Number(req.query.month),
                    },
                },
                { $unset: ["_id", "email", "year", "month"] },
            ])
            .sort({ date: 1 })
            .toArray();

        // * Convert the date to a readable format
        queriedTransactions.forEach(
            (transaction) =>
                (transaction.date = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", weekday: "short" }).format(
                    transaction.date,
                )),
        );

        // * If no transactions match the query return notification to client
        if (queriedTransactions.length === 0) {
            notifications = [
                { key: randomUUID(), type: "info", description: "No transactions were found with the requested year, month, user, and account." },
            ];
        } else {
            // * If transactions array is not empty then return a success notification to client
            notifications = [{ key: randomUUID(), type: "success", description: "Transactions successfully loaded." }];
        }

        // * Return query results
        return { status: 200, json: { transactions: queriedTransactions, notifications: notifications } };
    } catch (e) {
        console.error(e);

        // * Assign notifications to return
        notifications = [
            {
                key: randomUUID(),
                type: "error",
                description: "Unknown server error encountered while trying to retrieve transactions. Please try again.",
            },
        ];

        // * Return HTTP 500 unknown server error and respective notifications to client
        return { status: 500, json: { notifications: notifications } };
    }
};

const upsertTransactions = async (req: NextApiRequest, user: User) => {
    // * Array to store notifications to send back to client
    let notifications: NotificationType[];

    // * Connect to mongodb server
    const client = await dbConnection;

    // * Get database instance
    const db = client.db(dbNames.ledger);

    try {
        // * Empty notifications array to push notifications to
        notifications = [];

        // * Typecast request body to array of TransactionType
        // BUG type error -> transactions do not have the 'email' property, Omit<TransactionsType, 'email'> won't work - missing basic understanding of Document
        const transactions = req.body.transactions as unknown as TransactionsCollectionType[];

        // * For each transaction, try to insert/update the transaction into the database
        // ! transactionPartial is missing the email property and date property is a string instead of Date object
        for (const transactionPartial of transactions) {
            // * Convert the partial transaction to a true TransactionType
            const transaction = {
                ...transactionPartial,
                // * Assign current user's email to the transaction
                email: user.email,
                // * Using the date string, convert to Date object
                date: new Date(transactionPartial.date),
                // * Convert balance, credit, and debit from string to number with 2 decimals
                balance: transactionPartial.balance.toString() === "" ? 0 : Number(parseFloat(transactionPartial.balance.toString()).toFixed(2)),
                debit: transactionPartial.debit.toString() === "" ? 0 : Number(parseFloat(transactionPartial.debit.toString()).toFixed(2)),
                credit: transactionPartial.credit.toString() === "" ? 0 : Number(parseFloat(transactionPartial.credit.toString()).toFixed(2)),
            };

            // * Try to insert the transaction in the database
            try {
                // * If transaction date cannot be parsed then throw error
                if (!(transaction.date instanceof Date) || !isFinite(Number(transaction.date))) {
                    throw Error(`Transaction has an invalid date: ${transaction.date}`);
                }

                // * Fields to query transactions by to avoid duplication, removing category and comments from the transaction object
                const transactionQueryFields = (({ category, comments, ...transaction }) => transaction)(transaction);

                const newTransaction = await db
                    .collection<TransactionsCollectionType>(dbCollections.transactions)
                    .updateMany({ ...transactionQueryFields }, { $set: { ...transaction } }, { upsert: true });
            } catch (e) {
                console.error(e);

                // * For each transaction that failed to be inserted into the database, return notification to the client
                notifications.push({ key: randomUUID(), type: "error", description: `Could not save transaction: ${transaction.description}` });
            } finally {
                // * Continue to next transaction in loop
                continue;
            }
        }

        // * Assign notifications to return
        notifications.unshift({
            key: randomUUID(),
            type: "success",
            description: "Transactions successfully saved.",
        });

        // * Return to client
        return { status: 201, json: { notifications: notifications } };
    } catch (e) {
        console.error(e);

        // * Assign notifications to return
        notifications = [
            {
                key: randomUUID(),
                type: "error",
                description: "Unknown server error encountered while trying to update transactions. Please try again.",
            },
        ];

        // * Return HTTP 500 unknown server error and respective notifications to client
        return { status: 500, json: { notifications: notifications } };
    }
};

const transactions = async (req: NextApiRequest, res: NextApiResponse) => {
    // * Return HTTP 405 method not allowed if the request is anything other than a GET, POST or PUT request
    if (!req.method || !["GET", "POST", "PUT"].includes(req.method)) return res.status(405);

    // * Create supabase client on the server side using the browser context
    const supabaseServer = createServerSupabaseClient({ req: req, res: res });

    // * Get user for the browser client requesting data from this page
    const {
        data: { user },
    } = await supabaseServer.auth.getUser();

    // * If no user exists, send notification back to client that user is not logged in
    if (!user) {
        return {
            status: 401,
            json: { notifications: [{ type: "error", description: "You don't seem to be logged in. Please sign into your account." }] },
        };
    }

    // * Query transactions if user is authenticated and request method is GET
    if (req.method === "GET") {
        const queryResponse = await queryTransactions(req, user);
        return res.status(queryResponse.status).json(queryResponse.json);
    }

    // * Upsert transactions in db if user is authenticated and request method is POST/PUT
    if (req.method === "POST" || req.method === "PUT") {
        const upsertResponse = await upsertTransactions(req, user);
        return res.status(upsertResponse.status).json(upsertResponse.json);
    }
};

export default transactions;
