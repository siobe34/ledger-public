import { useState, useRef } from "react";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuid } from "uuid";

import { IList } from "../types/IList";

import { ButtonAdd } from "./Buttons/ButtonAdd";
import { ButtonDelete } from "./Buttons/ButtonDelete";
import { buttonUtils } from "./Button";

export const List = ({ values, setValues, layoutId }: IList) => {
    // * Ref for list UL
    const listRef = useRef<HTMLUListElement>(null);

    // * State to determine if list should be in edit mode
    const [editState, setEditState] = useState(false);

    // * State to store the list data
    const [listData, setListData] = useState(() => values);

    // * Func to add a row to the list of items
    const addRow = (target: EventTarget) => {
        // * Cast type from EventTarget to HTMLElement
        const clickedRow = target as HTMLElement;

        // * Get the index number of the row that was clicked
        const index = Array.from(listRef.current!.children).indexOf(clickedRow.closest("li")!);

        // * Set the new state for tableData by inserting an empty row above the current row
        setListData((prevState) => {
            // * Copy prev state into a new array
            const newState = [...prevState];

            // * Return new state while inserting the new empty row
            return [...newState.slice(0, index + 1), "", ...newState.slice(index + 1)];
        });
    };

    // * Func to delete the row that was clicked from the list
    const deleteRow = (target: EventTarget) => {
        // * Cast type from EventTarget to HTMLElement
        const clickedRow = target as HTMLElement;

        // * Get the index number of the row that was clicked
        const index = Array.from(listRef.current!.children).indexOf(clickedRow.closest("li")!);

        // * Set the new state for tableData by deleting 1 item in the array at the current index
        setListData((prevState) => {
            // * Copy prev state into a new array
            const newState = [...prevState];

            // * Remove 1 element at the current index from the array
            newState.splice(index, 1);

            return newState;
        });
    };

    // * Func to discard any changes made to the data during the edit state
    const discardChanges = () => {
        // * Set list data to the initially passed in values
        setListData(() => values);

        // * Change table state to no longer be editable
        setEditState(false);
    };

    // * Func to discard any changes made to the table during the edit state
    const saveChanges = () => {
        // * Get an array of inputs in the table using the tableRef
        const inputs = Array.from(listRef.current!.querySelectorAll("input"));

        // * Map the inputs to produce an array of the values in the inputs
        const newValues = inputs.map((inp) => inp.value);

        // * Set the new state for the listData
        setListData(() => newValues);

        // * Set the new state for the values passed from parent
        setValues(() => newValues);

        // * Change table state to no longer be editable
        setEditState(false);
    };

    return (
        <div className='flex w-full flex-col gap-4'>
            <div className='flex flex-wrap gap-4'>
                {editState ? (
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
                    <motion.button
                        layout
                        layoutId={layoutId}
                        className={`${buttonUtils.replace("py-2", "py-1")}`}
                        onClick={() => setEditState(!editState)}
                        aria-label='Edit'
                    >
                        <FontAwesomeIcon icon={faEdit} className='mr-2' /> Edit
                    </motion.button>
                )}
            </div>
            <ul ref={listRef} className='flex max-w-full list-inside list-decimal flex-col justify-center gap-2 overflow-auto p-4'>
                {listData.map((listItem) => (
                    <li key={uuid()} className='list-item'>
                        {editState ? (
                            <>
                                <input
                                    className='max-w-full rounded border border-borderBase/50 bg-inherit px-2'
                                    type='text'
                                    defaultValue={listItem.toString()}
                                />
                                <ButtonAdd className='m-2' onClick={({ target }) => addRow(target)} ariaLabel='Add Row' />
                                <ButtonDelete className='m-2' onClick={({ target }) => deleteRow(target)} ariaLabel='Delete Row' />
                            </>
                        ) : (
                            listItem.toString()
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};
