import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import { useUser } from "@supabase/auth-helpers-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faChartArea, faChartLine, faDollar, faTable, faUserAlt, faUsers } from "@fortawesome/free-solid-svg-icons";

import { pathLinks } from "../lib/LINK_REFERENCES";

export default function Home() {
    // * Get client side user instance from state context
    const user = useUser();

    return (
        <>
            <Head>
                <title>Ledger | Home</title>
                <meta
                    name='description'
                    content='Get started with Ledger today to track your bank transactions, categorize them, and view insightful charts about your spending
                    habits.'
                />
                <meta name='theme-color' content='#111111' />
                <link rel='icon' type='image/svg+xml' href='/favicon/favicon.svg' />
                <link rel='icon' type='image/png' href='/favicon/favicon.png' />
                <link rel='manifest' href='/site.webmanifest' />
            </Head>

            {/* Site Navigation Links */}
            {user && (
                <ul className='mb-4 flex w-full flex-wrap items-center justify-center gap-2 border-b border-borderBase p-2'>
                    <li className='text-center hover:text-primary hover:underline'>
                        <Link href={pathLinks.manage} className='px-4'>
                            Account Management
                        </Link>
                    </li>
                    <li className='text-center hover:text-primary hover:underline'>
                        <Link href={pathLinks.transactions} className='px-4'>
                            View Transactions
                        </Link>
                    </li>
                    <li className='text-center hover:text-primary hover:underline'>
                        <Link href={pathLinks.transactionsUpload} className='px-4'>
                            Upload Transactions
                        </Link>
                    </li>
                    <li className='text-center hover:text-primary hover:underline'>
                        <Link href={pathLinks.monthly} className='px-4'>
                            Monthly Summary
                        </Link>
                    </li>
                    <li className='text-center hover:text-primary hover:underline'>
                        <Link href={pathLinks.annual} className='px-4'>
                            Annual Summary
                        </Link>
                    </li>
                    <li className='text-center hover:text-primary hover:underline'>
                        <Link href={pathLinks.signOut} className='px-4'>
                            Sign Out
                        </Link>
                    </li>
                </ul>
            )}

            <article className='my-8 flex w-full flex-col items-center justify-center gap-4 p-4'>
                <h1 className='text-3xl text-primary no-underline'>Ledger.</h1>
                <p className='flex text-center text-lg text-txtBg lg:w-3/5 xl:w-2/5'>
                    Get started with Ledger today to track your bank transactions, categorize them, and view insightful charts about your spending
                    habits.
                </p>
                <Link href={pathLinks.signIn} className='rounded border border-transparent bg-primary py-2 px-4 text-txtPrimary hover:bg-primary/80'>
                    Sign Up!
                </Link>
            </article>
            <article className='my-8 flex w-full flex-col items-center justify-center gap-4 p-4'>
                <h2 className='text-2xl text-txtBg'>
                    No personal bank credentials required!
                    <br />
                    <span className='text-primary'>Upload your own data.</span>
                </h2>
                <figure className='relative h-[200px] w-full sm:h-[300px]'>
                    <Image src='/assets/bank.svg' alt='Person recording bank transactions.' fill priority />
                </figure>
            </article>
            <article className='my-16 flex w-full flex-col items-center justify-center gap-4 p-4'>
                <h2 className='text-2xl text-txtBg'>Spending Habits at a Glance</h2>
                <div className='flex w-full flex-col items-center justify-center gap-4 sm:flex-row'>
                    <figure className='relative h-[200px] w-full sm:h-[300px] sm:flex-1'>
                        <Image src='/assets/insightCharts.svg' alt='Person analyzing financial trends.' fill />
                    </figure>
                    <div className='flex-1 text-xl text-txtBg'>
                        <h3 className='mb-4 text-left font-medium'>Monthly and annual breakdowns of:</h3>
                        <ul className='flex flex-col gap-2'>
                            <li>
                                <FontAwesomeIcon icon={faChartArea} className='mr-2 text-primary' /> Categorical Spending
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faChartLine} className='mr-2 text-primary' /> Account Balances
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faUserAlt} className='mr-2 text-primary' /> Income, Expenses, and Savings by User
                            </li>
                        </ul>
                    </div>
                </div>
            </article>
            <article className='my-16 flex w-full flex-col items-center justify-center gap-4 p-4'>
                <h2 className='text-2xl text-txtBg'>
                    Manage Spending on a <span className='italic underline'>Transactional</span> Level
                </h2>
                <div className='flex w-full flex-col items-center justify-center gap-4 sm:flex-row'>
                    <figure className='relative h-[200px] w-full sm:h-[300px] sm:flex-1'>
                        <Image src='assets/transaction.svg' alt='Credit and/or Debit cards.' fill />
                    </figure>
                    <div className='flex-1 text-xl text-txtBg'>
                        <ul className='flex flex-col gap-2'>
                            <li>
                                <FontAwesomeIcon icon={faTable} className='mr-2 text-primary' /> View and edit each transaction in a{" "}
                                <span className='text-primary underline'>spreadsheet-like</span> Table
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faUsers} className='mr-2 text-primary' /> Configurable categories and user accounts
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faDollar} className='mr-2 text-primary' /> Interactively upload transactions with a CSV file
                                from your banking provider
                            </li>
                        </ul>
                    </div>
                </div>
            </article>
            <Link
                href={pathLinks.signIn}
                className='mt-10 mb-16 max-w-[80%] rounded border border-transparent bg-primary px-8 py-6 text-2xl text-txtPrimary hover:bg-primary/80'
            >
                Try Ledger Today
                <FontAwesomeIcon icon={faArrowRight} className='ml-4' />
            </Link>
        </>
    );
}
