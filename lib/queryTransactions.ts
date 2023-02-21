import { Filter } from "mongodb";

import { TransactionsCollectionType } from "../types/Database";
import dbConnection from "../lib/dbConnection";
import { dbNames, dbCollections } from "../lib/DB_REFERENCES";

// TODO fix any in aggregationStages prop
// TODO fix any in queryParams.catgory prop
// TODO review logic and add comments
// TODO fix this func to be able to query with dynamic aggregation stages
export const queryTransactions = async (
    email: string,
    queryParams: {
        year?: number;
        month?: number;
        balance?: number;
        debit?: number;
        category?: any;
        credit?: number;
        description?: string;
        user?: string;
        account?: string;
    },
    groupStage: Filter<any>,
    unsetStage: Filter<any>,
) => {
    const client = await dbConnection;

    const db = client.db(dbNames.ledger);

    const dbQuery = await db
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
                    email: email,
                    ...queryParams,
                },
            },
            {
                $sort: { date: 1 },
            },
            { ...groupStage },
            { ...unsetStage },
        ])
        .toArray();

    return dbQuery;
};
