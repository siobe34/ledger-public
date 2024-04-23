import { useState } from "react";
import Head from "next/head";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh, faUpload } from "@fortawesome/free-solid-svg-icons";
import { randomUUID } from "crypto";
import { v4 as uuid } from "uuid";

import { PageWithLayout } from "../../types/App";
import { NotificationType } from "../../types/INotifications";
import { ManageCollectionType, TransactionsCollectionType } from "../../types/Database";
import dbConnection from "../../lib/dbConnection";
import { dbNames, dbCollections } from "../../lib/DB_REFERENCES";
import { apiRoutes, pathLinks } from "../../lib/LINK_REFERENCES";
import { YEARS } from "../../lib/YEARS";
import { MONTHS, monthStringToNumber } from "../../lib/MONTH_MAPPING";
import { validateTransactionPayload } from "../../lib/validateTransactionPayload";

import { TransactionLayout } from "../../components/Layouts/TransactionLayout";
import { NotificationGroup } from "../../components/Notifications";
import { Button } from "../../components/Button";
import { TableEditable } from "../../components/Table/TableEditable";
import { Dropdown } from "../../components/Dropdown";

export const getServerSideProps: GetServerSideProps<{
    data?: { manage: ManageCollectionType; transactions: TransactionsCollectionType[] };
    notifications?: NotificationType[];
}> = async (context: GetServerSidePropsContext) => {
    // * Create supabase client on the server side using the browser context
    const supabaseServer = createServerSupabaseClient(context);

    // * Get user for the browser client requesting data from this page
    const {
        data: { user },
    } = await supabaseServer.auth.getUser();

    // * If no user exists, redirect to the login page
    if (!user || !user.email)
        return {
            redirect: {
                destination: pathLinks.signIn,
                permanent: false,
            },
        };

    // * If session exists, user is authorized to view data so we can make database queries
    // * Connect to mongodb server
    const client = await dbConnection;

    // * Get database instance
    const db = client.db(dbNames.ledger);

    // * Query current user's account information
    const dbManageQuery = await db.collection<ManageCollectionType>(dbCollections.manage).findOne({ email: user.email });

    // * Query from transactions database with current user's email address and today's year and month
    const todaysDate = new Date('2023-05-04');
    const dbTransactionsQuery = await db
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
                    year: Number(todaysDate.toLocaleString("en-US", { year: "numeric" })),
                    month: Number(todaysDate.toLocaleString("en-US", { month: "numeric" })),
                },
            },
            { $unset: ["_id", "email", "year", "month"] },
        ])
        .toArray();

    // * Convert the date to a readable format
    dbTransactionsQuery.forEach(
        (transaction) =>
            (transaction.date = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", weekday: "short" }).format(
                transaction.date,
            )),
    );

    // * If user exists and no account management settings are found then redirect to the manage account page
    if (!dbManageQuery)
        return {
            redirect: {
                destination: pathLinks.manage,
                permanent: false,
                props: {
                    notifications: [
                        {
                            key: randomUUID(),
                            type: "info",
                            description: "Transactions can only be uploaded once the account management settings have been updated.",
                        },
                    ],
                },
            },
        };

    // * If transactions array is an empty array then display notification to client
    if (dbTransactionsQuery.length === 0) {
        return {
            props: {
                data: JSON.parse(JSON.stringify({ manage: dbManageQuery })),
                notifications: [
                    {
                        key: randomUUID(),
                        type: "info",
                        description: `No transactions exist for ${todaysDate.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                        })}.`,
                    },
                    {
                        key: randomUUID(),
                        type: "info",
                        description: 'New transactions can be uploaded on the "Upload Transactions" page.',
                    },
                ],
            },
        };
    }

    // * Return page request rendered with the data from db query
    return {
        props: {
            data: JSON.parse(
                JSON.stringify({
                    manage: dbManageQuery,
                    transactions: dbTransactionsQuery,
                }),
            ),
        },
    };
};

const Transactions: PageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ data, notifications }) => {
    // * State to store notifications
    const [currentNotifications, setCurrentNotifications] = useState(() => notifications);

    // *State to store transactions array to display in table
    const [transactions, setTransactions] = useState(() => data?.transactions);

    // * State for year and month that transactions are loaded for
    const [year, setYear] = useState(new Date('2023-05-04').toLocaleString("en-US", { year: "numeric" }));
    const [month, setMonth] = useState(new Date('2023-05-04').toLocaleString("en-US", { month: "long" }));

    // * State of user that transactions are loaded for
    const [user, setUser] = useState("All");

    // * State of account that transactions are loaded for
    const [account, setAccount] = useState("All");

    // * Func to handle state change in dropdown for year
    const handleYearChange = (target: EventTarget) => {
        // * Typecast Event Target to HTML Element
        const element = target as HTMLElement;
        // * Set user to text content of event target
        setYear(element.textContent!);
    };

    // * Func to handle state change in dropdown for month
    const handleMonthChange = (target: EventTarget) => {
        // * Typecast Event Target to HTML Element
        const element = target as HTMLElement;
        // * Set user to text content of event target
        setMonth(element.textContent!);
    };

    // * Func to handle state change in dropdown for user
    const handleUserChange = (target: EventTarget) => {
        // * Typecast Event Target to HTML Element
        const element = target as HTMLElement;
        // * Set user to text content of event target
        setUser(element.textContent!);
    };

    // * Func to handle state change in dropdown for account
    const handleAccountChange = (target: EventTarget) => {
        // * Typecast Event Target to HTML Element
        const element = target as HTMLElement;
        // * Set user to text content of event target
        setAccount(element.textContent!);
    };

    // * Func to fetch new data based on parameter states (year, month, user, account)
    const loadTransactions = async () => {
        // * Set notifications to show data is loading
        setCurrentNotifications(() => [{ key: uuid(), type: "info", description: "Loading data.." }]);

        // * Convert month from full month name to number of month
        const queryMonth = monthStringToNumber[month as keyof typeof monthStringToNumber];

        const response = await fetch(`${apiRoutes.transactions}?year=${year}&month=${queryMonth}&user=${user}&account=${account}`);
        const transactionsQuery = await response.json();

        // * Set transactions from API response if length is greater than 0
        if (transactionsQuery.transactions && transactionsQuery.transactions.length > 0) {
            setTransactions(() => transactionsQuery.transactions);
        }

        // * Set notifications from API response if they exist
        if (transactionsQuery.notifications) {
            setCurrentNotifications(() => transactionsQuery.notifications);
        }
    };

    // * Func to save transactions data
    const saveTransactions = async () => {
        // * Don't save transactions if no data in table
        if (!transactions) {
            setCurrentNotifications([{ key: uuid(), type: "info", description: "No transactions to save." }]);
            return;
        }

        // * Set notifications to show data is being verified
        setCurrentNotifications(() => [{ key: uuid(), type: "info", description: "Verifying data..." }]);

        // * Validate the transactions data
        const validateNotifications = validateTransactionPayload(data!.manage.payload, transactions);
        setCurrentNotifications(validateNotifications);

        // * If transaction validation returns notifications then do not save transactions
        if (validateNotifications.length > 0) return;

        // * Set notifications to show data is being saved
        setCurrentNotifications(() => [{ key: uuid(), type: "info", description: "Saving data..." }]);

        // * Define request options
        const opts = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transactions: transactions }),
        };

        // * Make request to API route that will update the database with the payload
        const response = await fetch(apiRoutes.transactions, opts);
        // * Resolve API response
        const json = await response.json();

        // * Set current notifications to notifications received from API endpoint
        if (json && json.notifications) setCurrentNotifications(json.notifications);
    };

    return (
        <>
            <Head>
                <title>Transactions | Ledger</title>
            </Head>

            {/* Notifications Section */}
            {currentNotifications && <NotificationGroup notifications={currentNotifications} />}

            <h1 className='text-2xl font-bold underline'>Monthly Transactions</h1>

            {/* Load and Save Transactions */}
            <div className='flex w-full flex-col justify-center gap-6 p-4 text-sm sm:justify-start sm:gap-6 sm:px-0 md:flex-row'>
                <Button className='px-8' onClick={() => saveTransactions()}>
                    <FontAwesomeIcon icon={faUpload} className='mr-2' /> Save Transactions
                </Button>
                <Button className='px-8' onClick={() => loadTransactions()}>
                    <FontAwesomeIcon icon={faRefresh} className='mr-2' /> Refresh Table
                </Button>
                <div className='flex flex-wrap justify-center gap-4'>
                    <div className='flex flex-col items-center justify-center'>
                        <label>Year</label>
                        <Dropdown>
                            <Button className='mb-1'>{year}</Button>
                            <>
                                {YEARS.map((dropdownYear) => (
                                    <Button key={dropdownYear} className='border-none' onClick={({ target }) => handleYearChange(target)}>
                                        {dropdownYear}
                                    </Button>
                                ))}
                            </>
                        </Dropdown>
                    </div>
                    <div className='flex flex-col items-center justify-center'>
                        <label>Month</label>
                        <Dropdown>
                            <Button className='mb-1'>{month}</Button>
                            <>
                                {MONTHS.map((dropdownMonth) => (
                                    <Button key={dropdownMonth} className='border-none' onClick={({ target }) => handleMonthChange(target)}>
                                        {dropdownMonth}
                                    </Button>
                                ))}
                            </>
                        </Dropdown>
                    </div>
                    <div className='flex flex-col items-center justify-center'>
                        <label>User</label>
                        <Dropdown>
                            <Button className='mb-1'>{user}</Button>
                            <Button className='border-none' onClick={({ target }) => handleUserChange(target)}>
                                All
                            </Button>
                            <>
                                {data?.manage.payload.users.map((dropdownUser) => (
                                    <Button key={dropdownUser} className='border-none' onClick={({ target }) => handleUserChange(target)}>
                                        {dropdownUser}
                                    </Button>
                                ))}
                            </>
                        </Dropdown>
                    </div>
                    <div className='flex flex-col items-center justify-center'>
                        <label>Account Type</label>
                        <Dropdown>
                            <Button className='mb-1'>{account}</Button>
                            <Button className='border-none' onClick={({ target }) => handleAccountChange(target)}>
                                All
                            </Button>
                            <Button className='border-none' onClick={({ target }) => handleAccountChange(target)}>
                                Credit
                            </Button>
                            <Button className='border-none' onClick={({ target }) => handleAccountChange(target)}>
                                Debit
                            </Button>
                        </Dropdown>
                    </div>
                </div>
            </div>

            {/* Transactions Table component */}
            {transactions && (
                <motion.article
                    className='w-full rounded border border-borderBase bg-bgLvl1 p-4'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <TableEditable
                        layoutId='transactions-table'
                        editable
                        editableHeaders={["Category", "Comments"]}
                        headers={{
                            0: "Date",
                            1: "Description",
                            2: "Credit",
                            3: "Debit",
                            4: "Balance",
                            5: "Category",
                            6: "User",
                            7: "Account",
                            8: "Comments",
                        }}
                        values={transactions}
                        setValues={setTransactions}
                    />
                </motion.article>
            )}
        </>
    );
};

Transactions.getLayout = function getLayout(page: React.ReactElement) {
    return <TransactionLayout>{page}</TransactionLayout>;
};

export default Transactions;
