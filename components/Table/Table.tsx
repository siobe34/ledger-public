import { useState, useMemo } from "react";

import { motion } from "framer-motion";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { v4 as uuid } from "uuid";

import { ITable } from "../../types/ITable";

export const Table = <THeaders extends keyof TValues, TValues extends object>({ headers, values }: ITable<THeaders, TValues>) => {
    // BUG -> potential unhandled error:
    // * If the column names passed in each row of values are not all the same then it should throw an error

    // * State for header to sort by
    const [sortByHeader, setSortByHeader] = useState<THeaders | null>(null);
    const [showSortByHeader, setShowSortByHeader] = useState<THeaders>(headers[0]);

    // * Only sort when values or state for sortByHeader changes
    useMemo(() => {
        // * Only sort when sortByHeader is not null
        if (sortByHeader !== null) {
            // * Sort columns
            // BUG -> sort method doesn't sort numbers correctly
            values.sort((a, b) => (a[sortByHeader] < b[sortByHeader] ? -1 : a[sortByHeader] > b[sortByHeader] ? 1 : 0));
        }
    }, [values, sortByHeader]);

    return (
        <div className='max-h-[50vh] w-full overflow-auto'>
            <div className='w-full overflow-auto'>
                <motion.table layout className='table w-full border-collapse'>
                    <thead>
                        <tr className='bg-bgBase'>
                            {Object.values(headers).map((header) => (
                                <th
                                    key={header.toString()}
                                    className='relative min-w-[100px] whitespace-nowrap border border-borderBase/50 px-6 py-2 text-center capitalize'
                                    onMouseEnter={() => setShowSortByHeader(header)}
                                    onMouseOut={() => setShowSortByHeader(header)}
                                >
                                    {header.toString()}
                                    {sortByHeader === header ||
                                        (showSortByHeader === header && (
                                            <motion.button
                                                className='hover:text-primary absolute'
                                                onClick={() => setSortByHeader(header)}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                            >
                                                <FontAwesomeIcon icon={header === sortByHeader ? faChevronUp : faChevronDown} className='pl-1' />
                                            </motion.button>
                                        ))}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {values.map((colRowPair) => (
                            <tr key={uuid()} id={`trid__${values.indexOf(colRowPair)}`} className='hover:bg-bgLvl2 hover:text-txtBg'>
                                {Object.values(headers).map((headerUnformatted) => {
                                    // * Convert header to camel case
                                    const value = String(colRowPair[headerUnformatted]);
                                    return (
                                        <td
                                            key={uuid()}
                                            id={`tdid__${values.indexOf(colRowPair)}-${Object.values(headers).indexOf(headerUnformatted)}`}
                                            className='h-[2.5rem] min-w-[100px] whitespace-nowrap border border-borderBase/50 px-4 py-2'
                                        >
                                            {value}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </motion.table>
            </div>
        </div>
    );
};
