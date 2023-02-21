import { useState } from "react";
import Head from "next/head";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { randomUUID } from "crypto";
import { Pie, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    Colors,
} from "chart.js";

import { PageWithLayout } from "../../../types/App";
import { IAnnualSummaryProps } from "../../../types/RouteProps/ISummaryRouteProps";
import { TransactionsCollectionType } from "../../../types/Database";
import dbConnection from "../../../lib/dbConnection";
import { dbCollections, dbNames } from "../../../lib/DB_REFERENCES";
import { apiRoutes, pathLinks } from "../../../lib/LINK_REFERENCES";
import { getUserSession } from "../../../lib/getUserSession";
import { queryTransactions } from "../../../lib/queryTransactions";
import { convertAnnualBalancesByUsertoTotalBalanceByMonth } from "../../../lib/convertAnnualBalancesByUsertoTotalBalanceByMonth";
import { YEARS } from "../../../lib/YEARS";
import { monthNumberToString, MONTHS } from "../../../lib/MONTH_MAPPING";

import { SummaryLayout } from "../../../components/Layouts/SummaryLayout";
import { NotificationGroup } from "../../../components/Notifications";
import { Button } from "../../../components/Button";
import { Table } from "../../../components/Table/Table";
import { Dropdown } from "../../../components/Dropdown";

// * Register ChartJS elements
ChartJS.register(CategoryScale, LinearScale, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler, Colors);

export const getServerSideProps: GetServerSideProps<IAnnualSummaryProps> = async (context: GetServerSidePropsContext) => {
    // * Use browser context to get user's session
    const user = await getUserSession(context);

    // * If no user exists, redirect to the login page
    if (!user || !user.email)
        return {
            redirect: {
                destination: pathLinks.signIn,
                permanent: false,
            },
        };

    // * If session exists, user is authorized to view data so we can make database queries

    // * Get database instance
    const client = await dbConnection;
    const db = client.db(dbNames.ledger);

    // * Return annual data for the current year
    const todaysDate = new Date();

    // * Get monthly balances for the year by user and account
    const dbAnnualBalanceSummary = await queryTransactions(
        user.email,
        {
            year: Number(todaysDate.toLocaleString("en-US", { year: "numeric" })),
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
                    year: Number(todaysDate.toLocaleString("en-US", { year: "numeric" })),
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

    // * If the database calls return empty arrays then display notification to client
    if (dbAnnualBalanceSummary.length === 0 || dbAnnualCategorySummary.length === 0) {
        return {
            props: {
                notifications: [
                    {
                        key: randomUUID(),
                        type: "info",
                        description: `Transaction data not found for ${todaysDate.toLocaleDateString("en-US", {
                            year: "numeric",
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
                    annualCategoricalSummary: dbAnnualCategorySummary,
                    annualBalanceSummary: dbAnnualBalanceSummary,
                }),
            ),
        },
    };
};

const Annual: PageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ data, notifications }) => {
    // * State to store notifications
    const [currentNotifications, setCurrentNotifications] = useState(() => notifications);

    // * State for year that annual balances are loaded for
    const [year, setYear] = useState(new Date().toLocaleString("en-US", { year: "numeric" }));

    // * State for annual balance data
    const [annualBalanceSummary, setAnnualBalanceSummary] = useState(() => (data ? data.annualBalanceSummary : undefined));

    // * State for annual spending by category
    const [annualCategoricalSummary, setAnnualCategoricalSummary] = useState(() => (data ? data.annualCategoricalSummary : undefined));

    // * Func to handle state change in dropdown for year
    const handleYearChange = (target: EventTarget) => {
        // * Typecast Event Target to HTML Element
        const element = target as HTMLElement;
        // * Set user to text content of event target
        setYear(element.textContent!);
    };

    // * Func to fetch new data based on parameter states (year, month)
    const refreshData = async () => {
        const response = await fetch(`${apiRoutes.annualSummary}?year=${year}`);
        const apiResponse = (await response.json()) as unknown as IAnnualSummaryProps;

        // * Refresh data from API response
        if (apiResponse.data && apiResponse.data.annualBalanceSummary.length > 0 && apiResponse.data.annualCategoricalSummary.length > 0) {
            setAnnualBalanceSummary(() => apiResponse.data!.annualBalanceSummary);
            setAnnualCategoricalSummary(() => apiResponse.data!.annualCategoricalSummary);
        }

        // * Set notifications from API response
        if (apiResponse.notifications) {
            setCurrentNotifications(() => apiResponse.notifications);
        }
    };

    return (
        <>
            <Head>
                <title>Analysis | Ledger</title>
            </Head>

            {/* Notifications Section */}
            {currentNotifications && <NotificationGroup notifications={currentNotifications} />}

            <h1 className='text-2xl font-bold underline'>Annual Summary</h1>

            {/* Load New Data */}
            <div className='flex w-full flex-col justify-center gap-6 p-4 text-sm sm:flex-row sm:justify-start sm:gap-6 sm:px-0'>
                <Button onClick={() => refreshData()}>
                    <FontAwesomeIcon icon={faRefresh} className='mr-2' /> Refresh
                </Button>
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
            </div>

            {/* Display charts and tables if data exists */}
            {annualBalanceSummary && annualCategoricalSummary && (
                <>
                    {/* Table and Line graph for Annual Balances */}
                    <h2 className='w-full border-b border-borderBase text-left'>Annual Balances</h2>
                    <article className='flex w-full flex-col items-center justify-center gap-8 rounded border border-borderBase/50 bg-bgLvl1 p-4 lg:flex-row lg:items-start'>
                        <figure className='w-full lg:w-2/5'>
                            <Table
                                values={annualBalanceSummary
                                    .sort((item1, item2) => (item1.month < item2.month ? -1 : item1.month > item2.month ? 1 : 0))
                                    .map((item) => ({
                                        ...item,
                                        month: monthNumberToString[item.month as keyof typeof monthNumberToString],
                                        balance: Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(item.balance),
                                    }))}
                                headers={{ 0: "user", 1: "account", 2: "month", 3: "balance" }}
                            />
                        </figure>
                        <figure className='h-[60vh] w-full lg:w-3/5'>
                            <Line
                                data={{
                                    labels: MONTHS,
                                    datasets: [
                                        {
                                            label: "Total Annual Balance",
                                            data: convertAnnualBalancesByUsertoTotalBalanceByMonth(annualBalanceSummary),
                                        },
                                        ...[...new Set(annualBalanceSummary.map((item) => item.user))].map((user) => ({
                                            label: user,
                                            data: [...new Set(annualBalanceSummary.map((item) => item.month))].map((month) =>
                                                annualBalanceSummary
                                                    .filter((item) => item.user === user && item.month === month)
                                                    .reduce(
                                                        (returnItem, currentItem) =>
                                                            currentItem.account === "Debit"
                                                                ? returnItem + currentItem.balance
                                                                : returnItem - currentItem.balance,
                                                        0,
                                                    ),
                                            ),
                                            hidden: true,
                                        })),
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    layout: { padding: 4 },
                                }}
                            />
                        </figure>
                    </article>

                    {/* Table and Pie graph for Annual Categorical Spending */}
                    <h2 className='w-full border-b border-borderBase text-left'>Categorical Spending</h2>
                    <article className='flex w-full flex-col items-center justify-center gap-8 rounded border border-borderBase/50 bg-bgLvl1 p-4 lg:flex-row lg:items-start'>
                        <figure className='w-full lg:w-2/5'>
                            <Table
                                headers={{ 0: "category", 1: "average", 2: "sum" }}
                                values={annualCategoricalSummary.map((item) => ({
                                    ...item,
                                    sum: Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(item.sum),
                                    average: Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(item.average),
                                }))}
                            />
                        </figure>
                        <figure className='h-[60vh] w-full lg:w-3/5'>
                            <Pie
                                data={{
                                    labels: annualCategoricalSummary.map((category) => category.category),
                                    datasets: [
                                        {
                                            data: annualCategoricalSummary.map((category) => category.sum.toFixed(2)),
                                            borderWidth: 0,
                                            hoverBorderWidth: 1,
                                            hoverOffset: 10,
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    layout: { padding: 4 },
                                }}
                            />
                        </figure>
                    </article>
                </>
            )}
        </>
    );
};

Annual.getLayout = function getLayout(page: React.ReactElement) {
    return <SummaryLayout>{page}</SummaryLayout>;
};

export default Annual;
