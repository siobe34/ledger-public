import Head from "next/head";
import Link from "next/link";

import { useUser } from "@supabase/auth-helpers-react";

import { pathLinks } from "../../lib/LINK_REFERENCES";

export default function Home() {
    // * Get client side user instance from state context
    const user = useUser();

    return (
        <>
            <Head>
                <title>Demo | Ledger</title>
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
                <p className='text-center text-lg text-txtBg lg:w-3/5 xl:w-2/5'>
                    <span className='text-primary no-underline'>Ledger</span> is a tool to manage your budget on a transactional level with helpful
                    charts to see historical net worth, monthly categorical spending, and search personal transactions with a user-friendly interface.
                </p>
                <span className='rounded border border-borderBase bg-bgInfo py-4 text-center text-lg text-txtInfo lg:w-3/5 xl:w-2/5'>
                    This is a public demo with a sample dataset of bank transactions.
                </span>
                <p className='text-center text-lg text-txtBg lg:w-3/5 xl:w-2/5'>
                    Sample data exists only for the year 2023, transactions for each month are viewable in a table{" "}
                    <Link href={pathLinks.transactions} className='text-primary hover:underline'>
                        here
                    </Link>
                    . Charts and analysis of spending habits can be seen{" "}
                    <Link href={pathLinks.monthly} className='text-primary hover:underline'>
                        here
                    </Link>
                    .
                </p>
            </article>
        </>
    );
}
