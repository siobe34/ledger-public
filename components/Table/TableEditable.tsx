import { useState, useEffect, useRef } from "react";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuid } from "uuid";

import { ITableEditable } from "../../types/ITable";
import { toCamelCase } from "../../lib/toCamelCase";
import { compareArrays } from "../../lib/compareArray";

import { buttonUtils } from "../Button";
import { inputUtils } from "../Input";
import { ButtonAdd } from "../Buttons/ButtonAdd";
import { ButtonDelete } from "../Buttons/ButtonDelete";

export const TableEditable = <THeaders extends keyof TValues, TValues extends object>({
    editable,
    headers,
    editableHeaders,
    values,
    setValues,
    layoutId,
}: ITableEditable<THeaders, TValues>) => {
    // * Column names passed in headers
    const colsInHeaders = Object.values(headers)
        .map((header) => toCamelCase(header))
        .sort();

    // * Column names passed in values
    const colsInValues = Object.keys(values[0]).sort();

    // * If the column names do not match then throw an error
    if (!compareArrays(colsInHeaders, colsInValues)) {
        // * Log error with additional details
        console.error({
            table: layoutId,
            columnsInHeaders: colsInHeaders,
            columnsInValues: colsInValues,
            message:
                "Column names passed in headers and values must match when converted to camelCase. Column names in values must be passed in camelCase.",
        });

        // * Throw error
        throw new Error(
            "Column names passed in headers and values must match when converted to camelCase. Column names in values must be passed in camelCase.",
        );
    }

    // BUG -> potential unhandled error:
    // * If the column names passed in each row of values are not all the same then it should throw an error

    // * Ref for table
    const tableRef = useRef<HTMLTableElement>(null);

    // * State to determine if table should be in edit mode
    const [editState, setEditState] = useState(false);

    // * State to store the table data
    const [tableData, setTableData] = useState(() => values);

    // * State for value to search table by
    const [searchValue, setSearchValue] = useState<string | null>(null);

    // * Update table data whenever state for values changes
    useEffect(() => {
        setTableData(() => values);
    }, [values]);

    // * Search the table for searchValue every time the state for searchValue changes
    useEffect(() => searchTable(), [searchValue]);

    // * Func to add a row to the table above the row that was clicked
    const addRow = (target: EventTarget) => {
        // * Cast type from EventTarget to HTMLElement
        const clickedRow = target as HTMLElement;

        // * Get the index number of the row that was clicked using the row's id attribute
        const rowIdx = Number(clickedRow.closest("tr")?.getAttribute("id")?.replace("trid__", ""));
        if ((!rowIdx && rowIdx !== 0) || isNaN(rowIdx)) return;

        // * Set the new state for tableData by inserting an empty row above the current row
        setTableData((prevState) => {
            // * New empty row
            const newRow = new Map();

            // * Add column names with empty values to the new row
            colsInValues.forEach((header) => newRow.set(header, ""));

            // * Copy prev state into a new array
            const newState = [...prevState];

            // * Return new state while inserting the new row
            return [...newState.slice(0, rowIdx + 1), Object.fromEntries(newRow), ...newState.slice(rowIdx + 1)];
        });
    };

    // * Func to delete the row that was clicked from the table
    const deleteRow = (target: EventTarget) => {
        // * Cast type from EventTarget to HTMLElement
        const clickedRow = target as HTMLElement;

        // * Get the index number of the row that was clicked using the row's id attribute
        const rowIdx = Number(clickedRow.closest("tr")?.getAttribute("id")?.replace("trid__", ""));
        if ((!rowIdx && rowIdx !== 0) || isNaN(rowIdx)) return;

        // * Set the new state for tableData by deleting 1 item in the array at the current index
        setTableData((prevState) => {
            // * Copy prev state into a new array
            const newState = [...prevState];

            // * Remove 1 element at the current index from the array
            newState.splice(rowIdx, 1);

            return newState;
        });
    };

    // * Func to discard any changes made to the table during the edit state
    const discardChanges = () => {
        // * Set table data to the initially passed in values
        setTableData(() => values);

        // * Change table state to no longer be editable
        setEditState(false);
    };

    // * Func to discard any changes made to the table during the edit state
    const saveChanges = () => {
        // * Get an array of inputs in the table using the tableRef
        const inputs = Array.from(tableRef.current!.querySelectorAll("input"));

        // * Map the inputs to produce an array of the values in the inputs
        const inputValues = inputs.map((inp) => inp.value);

        // * Initial array of strings to reduce the values into
        const pairArr: Array<string[]> = [];

        // * Define the number of columns in the table
        const n = Object.values(headers).length;

        // * Reduce the array of values to group the cell values into groups of n where n is the number of columns
        // * This will transform the array of cell values into an array of arrays where the inner array has the values of each row per column
        inputValues.reduce((initialArr, value, idx) => {
            if (idx % n) {
                initialArr[initialArr.length - 1].push(value);
            } else {
                initialArr.push([value]);
            }
            return initialArr;
        }, pairArr);

        // * Convert the array of arrays into an array of objects with the column name and corresponding cell value
        const newValues = pairArr.map((pair) => {
            // * Init object to hold the key/value pairs for each cell
            const rowData = new Map();

            // * Loop over column headers and insert a key with the column name and the cell value at the loop index which contains the cell value
            Object.values(headers).forEach((header, colIdx) => rowData.set(toCamelCase(header), pair[colIdx]));

            // * Return the key/value pair for each row
            return Object.fromEntries(rowData);
        });

        // * Set the new state for the tableData
        setTableData(() => newValues);

        // * Set the new state for the values passed from parent
        setValues(() => newValues);

        // * Change table state to no longer be editable
        setEditState(false);
    };

    // * Func to search data in table for a value and display only the rows that match
    const searchTable = () => {
        // * Don't run function if searchValue is null (default state is null)
        if (!searchValue) return;

        // * Loop through all rows in the table to find any rows that have a cell value matching the search value
        tableData.forEach((row, rowIndex) => {
            innerLoop: {
                // * Loop through all of the columns in the row to check each cell value for the search value
                for (const header in row) {
                    // * Show all table rows that have a matching cell value
                    if (String(row[header]).toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) {
                        document.getElementById(`trid__${rowIndex}`)!.style.display = "table-row";

                        // * Stop looping over cell values in that row if any 1 cell has a matching value
                        break innerLoop;
                    }
                    // * Hide any table rows that do not have a matching cell value
                    else {
                        document.getElementById(`trid__${rowIndex}`)!.style.display = "none";
                    }
                }
            }
        });
    };

    return (
        <div className='w-full'>
            {/* Container for Table Actions */}
            <div className='mb-2 flex w-full flex-wrap items-center gap-4'>
                {editable && editState ? (
                    // * Accept/Discard changes made during edit state
                    <>
                        <motion.button
                            layout
                            layoutId={layoutId}
                            className={`${buttonUtils.replace("py-2", "py-1")}`}
                            onClick={() => discardChanges()}
                            aria-label='Discard Edits'
                        >
                            <FontAwesomeIcon icon={faTrash} className='mr-2' /> Discard
                        </motion.button>
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`${buttonUtils.replace("py-2", "py-1")}`}
                            onClick={() => saveChanges()}
                            aria-label='Save Edits'
                        >
                            <FontAwesomeIcon icon={faSave} className='mr-2' /> Update
                        </motion.button>
                    </>
                ) : (
                    // * Toggle edit state of Table
                    editable && (
                        <motion.button
                            layout
                            layoutId={layoutId}
                            className={`${buttonUtils.replace("py-2", "py-1")}`}
                            onClick={() => setEditState(!editState)}
                            aria-label='Edit Values'
                        >
                            <FontAwesomeIcon icon={faEdit} className='mr-2' /> Edit
                        </motion.button>
                    )
                )}
                {/* Search bar for Table data */}
                <div className='ml-auto flex items-center justify-center'>
                    <FontAwesomeIcon icon={faSearch} className='translate-x-6' />
                    <input
                        type='text'
                        className='h-inherit w-full rounded border border-borderBase bg-inherit px-2 pl-8'
                        value={searchValue || ""}
                        onChange={({ target }) => setSearchValue(target.value)}
                    />
                </div>
            </div>
            {/* Table Container */}
            <div className='max-h-[50vh] w-full overflow-auto'>
                <table ref={tableRef} className='table w-full border-collapse'>
                    <thead>
                        <tr className='bg-bgBase'>
                            {Object.values(headers).map((header) => (
                                <th key={header.toString()} className='min-w-[100px] border border-borderBase/50 p-2 text-center capitalize'>
                                    {header.toString()}
                                </th>
                            ))}
                            {editState && <th className='min-w-[100px] border border-borderBase/50 p-2 text-center'>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData?.map((colRowPair) => (
                            <tr key={uuid()} id={`trid__${tableData?.indexOf(colRowPair)}`} className='hover:bg-bgLvl2 hover:text-txtBg'>
                                {Object.values(headers).map((headerUnformatted) => {
                                    // * Convert header to camel case
                                    const header = toCamelCase(headerUnformatted) as keyof typeof colRowPair;
                                    const value = String(colRowPair[header]);
                                    return (
                                        <td
                                            key={uuid()}
                                            id={`tdid__${tableData?.indexOf(colRowPair)}-${Object.values(headers).indexOf(headerUnformatted)}`}
                                            className='h-[2.5rem] min-w-[100px] whitespace-nowrap border border-borderBase/50 px-4 py-2'
                                        >
                                            {/* // * If edit mode is active and current header is in the editableHeaders column then make cell editable */}
                                            {editState ? (
                                                editableHeaders?.includes(headerUnformatted) ? (
                                                    <input
                                                        className={inputUtils.replace("border-borderBase", "border-borderPrimary")}
                                                        style={{ width: `clamp(100%, 100px,calc(100vw/${Object.values(headers).length + 1}))` }}
                                                        type='text'
                                                        defaultValue={value}
                                                    />
                                                ) : (
                                                    <input
                                                        className={`focus:outline-none ${inputUtils.replace(
                                                            "border-borderBase",
                                                            "border-borderBase/50",
                                                        )}`}
                                                        style={{ width: `clamp(100%, 100px,calc(100vw/${Object.values(headers).length + 1}))` }}
                                                        type='text'
                                                        value={value}
                                                        readOnly
                                                    />
                                                )
                                            ) : (
                                                value
                                            )}
                                        </td>
                                    );
                                })}
                                {editState && (
                                    <td className='h-[2.5rem] min-w-[100px] border border-borderBase/50 px-4 py-2'>
                                        <ButtonAdd className='m-1' onClick={({ target }) => addRow(target)} ariaLabel='Add Table Row' />
                                        <ButtonDelete className='m-1' onClick={({ target }) => deleteRow(target)} ariaLabel='Delete Table Row' />
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
