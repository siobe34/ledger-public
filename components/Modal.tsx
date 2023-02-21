import { useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

import { IModal } from "../types/IModal";

import { Button } from "./Button";

export const Modal = ({ children, modalState, setModalState }: IModal) => {
    // * Func to detect keyboard event and close modal if the Escape key is pressed
    const closeModalOnEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") setModalState(false);
    };

    // * Bind keyboard event listener to listen for Escape keydown events whenever modalState changes
    useEffect(() => {
        // * If modal is not displayed then don't add/remove any listener
        if (!modalState) return;

        // * Add keydown listener to document element
        document.documentElement.addEventListener("keydown", closeModalOnEsc);

        // * Remove keydown listener from document element
        return () => document.documentElement.removeEventListener("keydown", closeModalOnEsc);
    }, [modalState]);

    return (
        <AnimatePresence>
            {modalState ? (
                <motion.div
                    className='fixed top-0 left-0 z-40 flex h-full w-full items-center justify-center bg-bgBase/60 p-4'
                    exit={{ opacity: 0 }}
                    onClick={() => setModalState(false)}
                >
                    <motion.div
                        className='relative flex h-full w-full flex-col items-center gap-4 rounded-lg border border-borderBase bg-bgLvl1 p-8 lg:w-5/6'
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ type: "tween" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Button className='absolute right-4 top-4' onClick={() => setModalState(false)}>
                            <FontAwesomeIcon icon={faClose} />
                        </Button>
                        {children}
                    </motion.div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
};
