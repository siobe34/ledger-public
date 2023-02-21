import { useState, useRef } from "react";
import Head from "next/head";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClose, faFileCsv, faUpload } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuid } from "uuid";
import { randomUUID } from "crypto";

import { PageWithLayout } from "../../../types/App";
import { NotificationType } from "../../../types/INotifications";
import { ManageCollectionType, TransactionsCollectionType } from "../../../types/Database";
import dbConnection from "../../../lib/dbConnection";
import { dbNames, dbCollections } from "../../../lib/DB_REFERENCES";
import { apiRoutes, pathLinks } from "../../../lib/LINK_REFERENCES";
import { CSVtoJSON } from "../../../lib/CSVtoJSON";
import { validateTransactionPayload } from "../../../lib/validateTransactionPayload";

import { TransactionLayout } from "../../../components/Layouts/TransactionLayout";
import { NotificationGroup } from "../../../components/Notifications";
import { Button } from "../../../components/Button";
import { Dropdown } from "../../../components/Dropdown";
import { Modal } from "../../../components/Modal";
import { TableEditable } from "../../../components/Table/TableEditable";

export const getServerSideProps: GetServerSideProps<{
    data?: { manage: ManageCollectionType };
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

    // * If user exists and no info for manage account is found then redirect to the account management page
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

    // * Return page request rendered with the data from db query
    return {
        props: {
            data: JSON.parse(
                JSON.stringify({
                    manage: dbManageQuery,
                }),
            ),
        },
    };
};

const UploadTransactions: PageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ data, notifications }) => {
    // * Ref for input used to load CSV file
    const inputRef = useRef<HTMLInputElement>(null);

    // * State to store notifications
    const [currentNotifications, setCurrentNotifications] = useState(() => notifications);

    // *State to store transactions array to display in table
    const [transactions, setTransactions] = useState<Array<{ [key: string]: string | number | boolean }> | undefined>();

    // * State of user that transactions are loaded for
    const [user, setUser] = useState("Select User");

    // * State of account that transactions are loaded for
    const [account, setAccount] = useState("Select Account");

    // * State to show/hide modal component
    const [modalState, setModalState] = useState(false);

    // * State to ignore or include first row in the user loaded CSV file
    const [CSVIgnoreFirstRow, setCSVIgnoreFirstRow] = useState(false);

    // * State for columns loaded in by CSV file and the order in which they're loaded
    const [CSVColumns, setCSVColumns] = useState([
        { display: true, name: "date", columnOrder: 1 },
        { display: true, name: "description", columnOrder: 2 },
        { display: true, name: "credit", columnOrder: 3 },
        { display: true, name: "debit", columnOrder: 4 },
        { display: true, name: "balance", columnOrder: 5 },
        { display: false, name: "category", columnOrder: 6 },
        { display: false, name: "comments", columnOrder: 7 },
        { display: false, name: "user", columnOrder: 8 },
        { display: false, name: "account", columnOrder: 9 },
    ]);

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

    // * Func to select file from input type file
    const handleFileLoader = () => {
        // * If user/account column are not included in the CSV then they must be specified in the dropdown, display a notification message to try again if not selected
        const requiredUserColumn = CSVColumns.filter((item) => item.name === "user")[0];
        const requiredAccountColumn = CSVColumns.filter((item) => item.name === "account")[0];
        if ((!requiredUserColumn.display && user === "Select User") || (!requiredAccountColumn.display && account === "Select Account")) {
            setCurrentNotifications([
                {
                    key: uuid(),
                    type: "error",
                    description: "User/account to load Transactions for not specified.",
                },
                {
                    key: uuid(),
                    type: "info",
                    description: "If a user and account are not loaded via an external file, they must be specified in the dropdowns above.",
                },
            ]);
            return;
        }

        // * If user and account are specified then trigger click on file input to load CSV file
        inputRef.current?.click();
    };

    // * Func to change the column order or exclusion/inclusion of a column from the loaded CSV file
    const handleCSVColumnStateChange = (columnName: string, newProperty: { key: "display" | "columnOrder"; value: boolean | number }) => {
        setCSVColumns((prevState) => {
            // * Copy prev state
            const newState = [...prevState];

            // * Get state of column that was clicked
            const existingColumnState = prevState.filter((item) => item.name === columnName)[0];

            // * Get index of column in the previous state
            const existingIdx = prevState.indexOf(existingColumnState);

            // * Copy the existing column state while updating the property passed in func call
            const newColumnState = { ...existingColumnState, [newProperty.key]: newProperty.value };

            // * Return new state
            return [...newState.slice(0, existingIdx), newColumnState, ...newState.slice(existingIdx + 1)];
        });
    };

    // * Func to load transactions from a CSV file, convert it to JSON, and display in Table
    const loadCSVData = async () => {
        // * Get file inputted by user
        const file = inputRef.current?.files;

        // * If no file exists then display notification message
        if (!file || !file[0]) {
            setCurrentNotifications([{ key: uuid(), type: "info", description: "No file selected. Please try again." }]);
            return;
        }

        // * If file is not a CSV then display notification message
        if (file[0].type !== "text/csv") {
            setCurrentNotifications([
                {
                    key: uuid(),
                    type: "error",
                    description: "File must be a CSV file with the following 5 ordered columns: Date, Description, Credit, Debit, Balance.",
                },
            ]);
            return;
        }

        // * Await promise for file
        const CSVPromise = await fetch(URL.createObjectURL(file[0]));
        // * Resolve promise for file
        const CSVFile = await CSVPromise.text();

        // * If promise cannot be resolved to return a string then display notification message
        if (!CSVFile) {
            setCurrentNotifications([
                { key: uuid(), type: "error", description: "Error while trying to read the file. File may be corrupt. Please try again." },
            ]);
            return;
        }

        // * Try to convert CSV to JSON and set transactions state to display in Table
        try {
            // * Convert the CSV string from file into a JSON object
            const json = CSVtoJSON(
                CSVFile,
                CSVColumns.filter((item) => item.display)
                    .sort((col1, col2) => (col1.columnOrder < col2.columnOrder ? -1 : col1.columnOrder > col2.columnOrder ? 1 : 0))
                    .map((item) => item.name),
                CSVIgnoreFirstRow,
            );

            // * Add the user and account from state to the JSON object
            json.map((row) => {
                CSVColumns.filter((item) => !item.display).forEach((col) =>
                    col.name === "user" ? (row[col.name] = user) : col.name == "account" ? (row[col.name] = account) : (row[col.name] = ""),
                );
            });

            // * Set the transactions state to display JSON data in Table component
            setTransactions(json);

            // * Close modal after transactions are loaded into Table component
            setModalState(false);
        } catch (e) {
            console.error(e);

            setCurrentNotifications([
                {
                    key: uuid(),
                    type: "error",
                    description:
                        "File could not be successfully interpreted. Please ensure the format is a CSV file with the following 5 columns: Date, Description, Credit, Debit, Balance.",
                },
            ]);
        }
    };

    // * Func to post transactions data to api route
    const postTransactions = async () => {
        // * Don't save transactions if no data in table
        if (!transactions) return;

        // * Validate the transactions data
        const validateNotifications = validateTransactionPayload(data!.manage.payload, transactions as TransactionsCollectionType[]);
        setCurrentNotifications(validateNotifications);

        // * If transaction validation returns notifications then do not save transactions
        if (validateNotifications.length > 0) return;

        // * Define request options
        const opts = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transactions: transactions }),
        };

        // * Make POST request to API route that will update the database with the payload
        const response = await fetch(apiRoutes.transactions, opts);
        // * Resolve API response
        const json = await response.json();

        // * Set current notifications to notifications received from API endpoint
        if (json && json.notifications) setCurrentNotifications(json.notifications);
    };

    return (
        <>
            <Head>
                <title>Ledger | Transactions</title>
            </Head>

            {/* Notifications Section */}
            {currentNotifications && <NotificationGroup notifications={currentNotifications} />}

            <h1 className='text-2xl font-bold underline'>Upload Transactions</h1>

            {/* Load File and Save Transactions */}
            <div className='flex w-full flex-col justify-center gap-6 p-4 text-sm sm:justify-start sm:gap-6 sm:px-0 md:flex-row'>
                <Button className='px-8' onClick={() => postTransactions()}>
                    <FontAwesomeIcon icon={faUpload} className='mr-2' /> Save Transactions
                </Button>
                <Button className='px-8' onClick={() => setModalState(true)}>
                    <FontAwesomeIcon icon={faFileCsv} className='mr-2 text-xl' /> Load Data
                </Button>
                <input
                    ref={inputRef}
                    type='file'
                    onChange={(event) => {
                        // * Func to load CSV file
                        loadCSVData();
                        // * Set input value to empty string so user can select the same file again while still triggering onChange event
                        event.target.value = "";
                    }}
                    className='hidden'
                />
            </div>

            {/* Transactions Table component */}
            {transactions && (
                <article className='w-full rounded border border-borderBase bg-bgLvl1 p-4'>
                    <TableEditable
                        layoutId='upload-transactions-table'
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
                        editable
                        editableHeaders={["Category", "Comments"]}
                        values={transactions}
                        setValues={setTransactions}
                    />
                </article>
            )}

            {/* Modal to Upload File */}
            <Modal modalState={modalState} setModalState={setModalState}>
                <h2>Choose file loading parameters to load data.</h2>
                <p>Select columns and order of columns to load from your CSV file.</p>
                <Button className='px-8' onClick={() => handleFileLoader()}>
                    <FontAwesomeIcon icon={faFileCsv} className='mr-2 text-xl' /> Select CSV File
                </Button>
                <div className='flex flex-wrap justify-center gap-4'>
                    <div className='flex flex-col items-center justify-center'>
                        <label>User</label>
                        <Dropdown>
                            <Button className='mb-1'>{user}</Button>
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
                                Credit
                            </Button>
                            <Button className='border-none' onClick={({ target }) => handleAccountChange(target)}>
                                Debit
                            </Button>
                        </Dropdown>
                    </div>
                    <div className='flex flex-col items-center justify-center'>
                        <label>Ignore First Row</label>
                        <Button onClick={() => setCSVIgnoreFirstRow(!CSVIgnoreFirstRow)} className='mb-1 h-8'>
                            <FontAwesomeIcon icon={CSVIgnoreFirstRow ? faCheck : faClose} className='text-base' />
                        </Button>
                    </div>
                </div>
                <div className='w-full overflow-auto'>
                    <table className='table w-full border-collapse'>
                        <thead>
                            <tr className='bg-bgBase'>
                                <th className='whitespace-nowrap border border-borderBase/50 px-6 py-4 text-center capitalize'>Select Column</th>
                                <th className='whitespace-nowrap border border-borderBase/50 px-6 py-4 text-center capitalize'>Column Name</th>
                                <th className='whitespace-nowrap border border-borderBase/50 px-6 py-4 text-center capitalize'>Column Order</th>
                            </tr>
                        </thead>
                        <tbody>
                            {CSVColumns.map((header) => (
                                <tr key={header.name} className='hover:bg-bgLvl2 hover:text-txtBg'>
                                    <td className='whitespace-nowrap border border-borderBase/50 px-4 py-2 text-center'>
                                        {["account", "category", "comments", "user"].includes(header.name) ? (
                                            <input
                                                type='checkbox'
                                                defaultChecked={header.display}
                                                onChange={() => handleCSVColumnStateChange(header.name, { key: "display", value: !header.display })}
                                                className='cursor-pointer bg-inherit'
                                            />
                                        ) : (
                                            "Required"
                                        )}
                                    </td>
                                    <td className='whitespace-nowrap border border-borderBase/50 px-4 py-2 text-center capitalize'>{header.name}</td>
                                    <td className='whitespace-nowrap border border-borderBase/50 px-4 py-2 text-center'>
                                        <input
                                            type='number'
                                            min={1}
                                            max={CSVColumns.length}
                                            defaultValue={header.columnOrder}
                                            onChange={({ currentTarget }) =>
                                                handleCSVColumnStateChange(header.name, {
                                                    key: "columnOrder",
                                                    value: Number(currentTarget.value),
                                                })
                                            }
                                            className='h-8 w-8 rounded border border-borderBase bg-inherit text-center text-sm'
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Modal>
        </>
    );
};

UploadTransactions.getLayout = function getLayout(page: React.ReactElement) {
    return <TransactionLayout>{page}</TransactionLayout>;
};
export default UploadTransactions;
