import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLineChart, faPieChart } from "@fortawesome/free-solid-svg-icons";

import { pathLinks } from "../../lib/LINK_REFERENCES";

import { Dashboard } from "./Dashboard";

export const SummaryLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Dashboard>
            <div className='flex w-full flex-col gap-8'>
                <ul className='flex flex-wrap justify-center gap-2 border-y border-borderPrimary py-4 sm:justify-start sm:border-t-0 sm:py-0'>
                    <li className='w-full rounded border border-borderPrimary bg-bgLvl1 text-center text-txtBg hover:border-transparent hover:bg-primary hover:text-txtPrimary sm:w-auto sm:rounded-none sm:rounded-t sm:border-b-0'>
                        <Link href={pathLinks.monthly} className='inline-flex w-full items-center justify-center px-4 py-1'>
                            <FontAwesomeIcon icon={faPieChart} className='mr-2' />
                            Monthly Summary
                        </Link>
                    </li>
                    <li className='w-full rounded border border-borderPrimary bg-bgLvl1 text-center text-txtBg hover:border-transparent hover:bg-primary hover:text-txtPrimary sm:w-auto sm:rounded-none sm:rounded-t sm:border-b-0'>
                        <Link href={pathLinks.annual} className='inline-flex w-full items-center justify-center px-4 py-1'>
                            <FontAwesomeIcon icon={faLineChart} className='mr-2' />
                            Annual Summary
                        </Link>
                    </li>
                </ul>
                <div className='flex flex-col items-center justify-start gap-4 sm:items-start'>{children}</div>
            </div>
        </Dashboard>
    );
};
