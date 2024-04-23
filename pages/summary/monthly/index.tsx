import { useState } from "react";
import Head from "next/head";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { randomUUID } from "crypto";
import { v4 as uuid } from "uuid";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, BarElement, Title, Tooltip, Legend, Filler, Colors } from "chart.js";

import { PageWithLayout } from "../../../types/App";
import { IMonthlySummaryProps } from "../../../types/RouteProps/ISummaryRouteProps";
import { apiRoutes, pathLinks } from "../../../lib/LINK_REFERENCES";
import { getUserSession } from "../../../lib/getUserSession";
import { queryTransactions } from "../../../lib/queryTransactions";
import { convertMonthlyBalanceSummaryToSavingsTable } from "../../../lib/convertMonthlyBalanceSummaryToSavingsTable";
import { convertMonthlyBalanceSummaryToUserBalanceTable } from "../../../lib/convertMonthlyBalanceSummaryToUserBalanceTable";
import { convertMonthlyAccountBalanceToTotalBalance } from "../../../lib/convertMonthlyAccountBalanceToTotalBalance";
import { convertToMapOfCategoricalSpendingByUser } from "../../../lib/convertToMapOfCategoricalSpendingByUser";
import { YEARS } from "../../../lib/YEARS";
import { MONTHS } from "../../../lib/MONTH_MAPPING";

import { SummaryLayout } from "../../../components/Layouts/SummaryLayout";
import { NotificationGroup } from "../../../components/Notifications";
import { Button } from "../../../components/Button";
import { Table } from "../../../components/Table/Table";
import { Dropdown } from "../../../components/Dropdown";
import { monthStringToNumber } from "../../../lib/MONTH_MAPPING";

// * Register ChartJS elements
ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Title, Tooltip, Legend, Filler, Colors);

export const getServerSideProps: GetServerSideProps<IMonthlySummaryProps> = async (context: GetServerSidePropsContext) => {
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

    // * Query from transactions database with current user's email address and today's year and month
    const todaysDate = new Date('2023-05-04');

    // * Get monthly summary by user and category ignoring potential "Credit Card" and "Income" category
    const dbMonthlyCategoricalSummaryByUser = await queryTransactions(
        user.email,
        {
            year: Number(todaysDate.toLocaleString("en-US", { year: "numeric" })),
            month: Number(todaysDate.toLocaleString("en-US", { month: "numeric" })),
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
                year: Number(todaysDate.toLocaleString("en-US", { year: "numeric" })),
                month: Number(todaysDate.toLocaleString("en-US", { month: "numeric" })),
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

    // * If the database calls return empty arrays then display notification to client
    if (dbMonthlyCategoricalSummaryByUser.length === 0 || dbMonthlyBalanceSummary.length === 0) {
        return {
            props: {
                notifications: [
                    {
                        key: randomUUID(),
                        type: "info",
                        description: `Transaction data not found for ${todaysDate.toLocaleDateString("en-US", {
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
                    monthlyCategoricalSummaryByUser: dbMonthlyCategoricalSummaryByUser,
                    monthlyCategoricalSummary: [...new Set(dbMonthlyCategoricalSummaryByUser.map((item) => item.category))].map((category) => ({
                        category: category,
                        sum: dbMonthlyCategoricalSummaryByUser
                            .filter((item) => item.category === category)
                            .reduce((returnItem, currentItem) => currentItem.sum + returnItem, 0),
                    })),
                    monthlyAccountBalanceSummary: dbMonthlyBalanceSummary,
                }),
            ),
        },
    };
};

const Monthly: PageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ data, notifications }) => {
    // * State to store notifications
    const [currentNotifications, setCurrentNotifications] = useState(() => notifications);

    // * State for year and month that transactions are loaded for
    const [year, setYear] = useState(new Date('2023-05-04').toLocaleString("en-US", { year: "numeric" }));
    const [month, setMonth] = useState(new Date('2023-05-04').toLocaleString("en-US", { month: "long" }));
    const [chartMonth, setChartMonth] = useState(month);

    // * State for monthly spending by category and user
    const [monthlyCategoricalSummaryByUser, setMonthlyCategoricalSummaryByUser] = useState(data ? data.monthlyCategoricalSummaryByUser : undefined);

    // * State for monthly spending by category only
    const [monthlyCategoricalSummary, setMonthlyCategoricalSummary] = useState(data ? data.monthlyCategoricalSummary : undefined);

    // * State for monthly account balance summary
    const [monthlyAccountBalanceSummary, setmonthlyAccountBalanceSummary] = useState(data ? data.monthlyAccountBalanceSummary : undefined);

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

    // * Func to fetch new data based on parameter states (year, month)
    const refreshData = async () => {
        // * Set notifications to show data is loading
        setCurrentNotifications(() => [{ key: uuid(), type: "info", description: "Loading data..." }]);

        const response = await fetch(
            `${apiRoutes.monthlySummary}?year=${year}&month=${monthStringToNumber[month as keyof typeof monthStringToNumber]}`,
        );
        const apiResponse = (await response.json()) as unknown as IMonthlySummaryProps;

        // * Refresh data from API response
        if (
            apiResponse.data &&
            apiResponse.data.monthlyCategoricalSummary.length > 0 &&
            apiResponse.data.monthlyCategoricalSummaryByUser.length > 0 &&
            apiResponse.data.monthlyAccountBalanceSummary.length > 0
        ) {
            setChartMonth(month);
            setMonthlyCategoricalSummary(() => apiResponse.data!.monthlyCategoricalSummary);
            setMonthlyCategoricalSummaryByUser(() => apiResponse.data!.monthlyCategoricalSummaryByUser);
            setmonthlyAccountBalanceSummary(() => apiResponse.data!.monthlyAccountBalanceSummary);
        }

        // * Set notifications from API response
        if (apiResponse.notifications) {
            setCurrentNotifications(() => apiResponse.notifications);
        }
    };

    return (
        <>
            <Head>
                <title>Summary | Ledger</title>
            </Head>

            {/* Notifications Section */}
            {currentNotifications && <NotificationGroup notifications={currentNotifications} />}

            <h1 className='text-2xl font-bold underline'>Monthly Summary</h1>

            {/* Load New Data */}
            <div className='flex w-full flex-col justify-center gap-6 p-4 text-sm sm:justify-start sm:gap-6 sm:px-0 md:flex-row'>
                <Button className='px-8' onClick={() => refreshData()}>
                    <FontAwesomeIcon icon={faRefresh} className='mr-2' /> Refresh
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
                </div>
            </div>

            {/* Display charts and tables if data exists */}
            {monthlyCategoricalSummary && monthlyCategoricalSummaryByUser && monthlyAccountBalanceSummary && (
                <>
                    {/* Balance Summary Tables */}
                    <h2 className='w-full border-b border-borderBase text-left'>Monthly Balances</h2>
                    <div className='flex w-full flex-col flex-wrap justify-around gap-8 sm:flex-row'>
                        <article className='flex max-w-full flex-1 flex-col rounded border border-borderBase/50 bg-bgLvl1 p-2'>
                            <h3 className='my-4'>Income/Expenses by User</h3>
                            <Table
                                headers={{ 0: "user", 1: "income", 2: "expenses", 3: "savings" }}
                                values={convertMonthlyBalanceSummaryToSavingsTable(monthlyAccountBalanceSummary)}
                            />
                        </article>
                        <article className='flex max-w-full flex-1 flex-col rounded border border-borderBase/50 bg-bgLvl1 p-2'>
                            <h3 className='my-4'>Balance by Account & User</h3>
                            <Table
                                headers={{ 0: "user", 1: "account", 2: "balance" }}
                                values={convertMonthlyBalanceSummaryToUserBalanceTable(monthlyAccountBalanceSummary)}
                            />
                        </article>
                        <article className='flex max-w-full flex-1 flex-col rounded border border-borderBase/50 bg-bgLvl1 p-2'>
                            <h3 className='my-4'>Total Balance by User</h3>
                            <Table
                                headers={{ 0: "user", 1: "balance" }}
                                values={convertMonthlyAccountBalanceToTotalBalance(monthlyAccountBalanceSummary)}
                            />
                        </article>
                    </div>

                    {/* Bar and Pie graphs for Monthly Categorical Spending */}
                    <h2 className='w-full border-b border-borderBase text-left'>Monthly Spending By User</h2>
                    <article className='flex w-full flex-col items-center justify-center gap-8 rounded border border-borderBase/50 bg-bgLvl1 p-4 sm:flex-row'>
                        <figure className='h-[700px] w-full sm:h-[50vh] sm:w-1/2'>
                            <Pie
                                data={{
                                    labels: monthlyCategoricalSummary.map((item) => item.category),
                                    datasets: [
                                        {
                                            label: `Spending (${chartMonth})`,
                                            data: monthlyCategoricalSummary.map((category) => category.sum),
                                            borderWidth: 0,
                                            hoverBorderWidth: 1,
                                            hoverOffset: 10,
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { title: { display: true, text: "Monthly Spending By Category" } },
                                }}
                            />
                        </figure>
                        <figure className='h-[700px] w-full sm:h-[50vh] sm:w-1/2'>
                            <Bar
                                data={{
                                    labels: [...new Set(monthlyCategoricalSummaryByUser.map((item) => item.category))],
                                    datasets: Array.from(
                                        convertToMapOfCategoricalSpendingByUser(monthlyCategoricalSummaryByUser).entries(),
                                        ([user, categoricalSpendingOfUser]) => ({
                                            label: user,
                                            data: categoricalSpendingOfUser,
                                            borderRadius: 3,
                                            barThickness: 30,
                                        }),
                                    ),
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { title: { display: true, text: "Monthly Categorical Spending By User" } },
                                }}
                            />
                        </figure>
                    </article>
                </>
            )}
        </>
    );
};

Monthly.getLayout = function getLayout(page: React.ReactElement) {
    return <SummaryLayout>{page}</SummaryLayout>;
};

export default Monthly;
