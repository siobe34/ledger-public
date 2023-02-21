import { useState } from "react";
import Head from "next/head";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { ObjectId } from "mongodb";
import { randomUUID } from "crypto";

import { PageWithLayout } from "../../types/App";
import { NotificationType } from "../../types/INotifications";
import { ManageCollectionType } from "../../types/Database";
import dbConnection from "../../lib/dbConnection";
import { dbNames, dbCollections } from "../../lib/DB_REFERENCES";
import { apiRoutes, pathLinks } from "../../lib/LINK_REFERENCES";
import { validateManagePayload } from "../../lib/validateManagePayload";

import { ManageLayout } from "../../components/Layouts/ManageLayout";
import { NotificationGroup } from "../../components/Notifications";
import { Button } from "../../components/Button";
import { List } from "../../components/List";

export const getServerSideProps: GetServerSideProps<{ data?: ManageCollectionType; notifications?: NotificationType[] }> = async (
    context: GetServerSidePropsContext,
) => {
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

    // * Query from database with current user's email address
    const query = await db.collection<ManageCollectionType>(dbCollections.manage).findOne({ email: user.email });

    // * If a user exists and no query is found then that means it's a new user
    if (!query)
        return {
            props: {
                data: JSON.parse(
                    JSON.stringify({
                        _id: new ObjectId(),
                        email: user.email,
                        payload: { users: [""], categories: [""], accounts: [{ user: "", accountName: "", balance: "" }] },
                    }),
                ),
                notifications: [{ key: randomUUID(), type: "info", description: "Please fill in the Users and Categories information below." }],
            },
        };

    // * Return page request rendered with the data from db query
    return {
        props: {
            data: JSON.parse(JSON.stringify(query)),
        },
    };
};

const Manage: PageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ data, notifications }) => {
    // * Init state to store notifications
    const [currentNotifications, setCurrentNotifications] = useState(() => notifications);

    // * Init state to store Users array for payload
    const [users, setUsers] = useState<Array<string | number | boolean> | undefined>(() => data?.payload.users);

    // * Init state to store Categories array for payload
    const [categories, setCategories] = useState<Array<string | number | boolean> | undefined>(() => data?.payload.categories);

    // * Function to make POST/PUT request to server API route to update database
    const saveAccountSettings = async () => {
        // * Type cast payload to correct types
        const usersPayload = users as ManageCollectionType["payload"]["users"];
        const categoriesPayload = categories as ManageCollectionType["payload"]["categories"];

        // * Payload to validate and post upon successful validation
        const payload = { users: usersPayload, categories: categoriesPayload };

        // * Pass the payload through a function to validate the payload for the Manage route data
        const validateResponse = validateManagePayload(payload);

        // * Set notifications returned by payload validation function
        setCurrentNotifications(() => validateResponse.notifications);

        // * If payload is not successfully validated then do not make request to API
        if (!validateResponse.status) return;

        // * Define default request method of POST
        let reqMethod = "POST";
        // * If the length of users and categories remains the same then the request method is changed to PUT because no new entries are being created
        if (data?.payload.categories.length === payload.categories.length && data?.payload.users.length === payload.users.length) {
            reqMethod = "PUT";
        }

        // * Define request options
        const opts = {
            method: reqMethod,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ payload: payload }),
        };

        // * Make POST request to API route that will update the database with the payload
        const response = await fetch(apiRoutes.manageUpsert, opts);
        // * Resolve API response
        const json = await response.json();

        // * Set current notifications to notifications received from API endpoint
        if (json && json.notifications)
            setCurrentNotifications((prevState) => (prevState ? [...json.notifications, ...prevState] : json.notifications));
    };

    return (
        <>
            <Head>
                <title>Manage Account | Ledger</title>
            </Head>

            {/* Notifications Section */}
            {currentNotifications && <NotificationGroup notifications={currentNotifications} />}

            <h1 className='text-2xl font-bold underline'>Manage Account Settings</h1>

            <div className='flex w-full flex-col justify-center gap-6 p-4 text-sm sm:justify-start sm:gap-6 sm:px-0 md:flex-row'>
                <Button className='px-8 py-5' onClick={() => saveAccountSettings()}>
                    <FontAwesomeIcon icon={faUpload} className='mr-2' />
                    Save Account Settings
                </Button>
            </div>

            {users && categories && (
                <div className='flex w-full flex-col items-center justify-start gap-8 py-4'>
                    <article className='flex w-full flex-col items-start justify-center gap-8 rounded border border-borderBase bg-bgLvl1 p-4'>
                        <h2 className='w-full border-b border-borderBase text-left'>Users</h2>
                        <List layoutId='users-list' values={users} setValues={setUsers} />
                    </article>
                    <article className='flex w-full flex-col items-start justify-center gap-8 rounded border border-borderBase bg-bgLvl1 p-4'>
                        <h2 className='w-full border-b border-borderBase text-left'>Categories</h2>
                        <List layoutId='categories-list' values={categories} setValues={setCategories} />
                    </article>
                </div>
            )}
        </>
    );
};

Manage.getLayout = function getLayout(page: React.ReactElement) {
    return <ManageLayout>{page}</ManageLayout>;
};

export default Manage;
