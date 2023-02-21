import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faCircleInfo, faCircleCheck, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

import { INotificationGroup, INotificationItem, NotificationType } from "../types/INotifications";

import { buttonUtils } from "./Button";

export const NotificationGroup = ({ notifications }: INotificationGroup) => {
    // * State to store array of active notifications
    const [activeNotifications, setActiveNotifications] = useState(() => notifications);

    // * Update the active notifications any time the notifications are updated
    useEffect(() => {
        setActiveNotifications(() => notifications);
    }, [notifications]);

    // * Func to remove a notification item
    const removeNotificationItem = (item: NotificationType) => {
        // * Get the index of the notification item
        const itemIndex = activeNotifications.indexOf(item);

        // * Set new state for active notifications
        setActiveNotifications((prevState) => {
            const newState = [...prevState];

            // * Remove the 1 notification item from the active notifications array using index
            newState.splice(itemIndex, 1);

            return newState;
        });
    };

    return (
        <AnimatePresence>
            {activeNotifications.length > 0 ? (
                <motion.ul
                    className='pointer-events-none absolute top-0 right-0 z-50 flex w-full flex-col items-end justify-center gap-2 px-4 py-2'
                    initial={{ y: "-100vh", opacity: 0 }}
                    animate={{ y: 0, opacity: 1, transition: { duration: 0.75 } }}
                    exit={{ y: "-100vh", opacity: 0, transition: { duration: 0.75 } }}
                    aria-label='Notifications'
                >
                    {activeNotifications.length > 1 && (
                        <button
                            className={`self-end ${buttonUtils.replace("py-2", "").replace("px-4", "px-2")} pointer-events-auto`}
                            onClick={() => setActiveNotifications([])}
                            aria-label='Hide All Notifications'
                        >
                            Hide All
                        </button>
                    )}
                    <AnimatePresence>
                        {activeNotifications.map((notification) => (
                            <NotificationItem
                                key={notification.key}
                                notificationItem={notification}
                                removeNotificationItem={removeNotificationItem}
                            />
                        ))}
                    </AnimatePresence>
                </motion.ul>
            ) : null}
        </AnimatePresence>
    );
};

const NotificationItem = ({ notificationItem, removeNotificationItem }: INotificationItem) => {
    // * State for current counter, starts at 0 and increases to notificationTimeout
    const [counter, setCounter] = useState(0);

    // * Default timeout for notifications (10s)
    // BUG -> when multiple notification items exist, they all try to be removed after 10s and some of them don't always get removed
    const notificationTimeout = 10000;

    // * Set default icon to (i) for information
    let icon = faCircleInfo;

    // * Set default background colour of blue
    let timeoutColour = "bg-txtInfo";
    let txtColour = "text-txtInfo";
    let bgColour = "bg-bgInfo";

    // * Change the icons and background colours dependent on notification type
    if (notificationItem.type === "success") {
        icon = faCircleCheck;
        timeoutColour = "bg-txtSuccess";
        txtColour = "text-txtSuccess";
        bgColour = "bg-bgSuccess";
    }

    if (notificationItem.type === "error") {
        icon = faCircleExclamation;
        timeoutColour = "bg-txtError";
        txtColour = "text-txtError";
        bgColour = "bg-bgError";
    }

    // * Increase counter until it reaches timeout, then remove notification when timeout is reached
    useEffect(() => {
        // * Func to reduce timeout every 1000 ms and remove notification once countdown is complete
        const countdownTimer = setTimeout(() => {
            // * Remove notification if countdown is reached
            if (counter === notificationTimeout) {
                removeNotificationItem(notificationItem);
                return;
            }

            // * Increase timer by 100 ms
            setCounter((prevState) => prevState + 100);
        }, 100);

        // * Clear timeout func
        return () => clearTimeout(countdownTimer);
    }, [counter]);

    return (
        <motion.li
            className={`pointer-events-auto relative flex items-center justify-between overflow-hidden rounded border border-borderBase py-2 px-4 ${txtColour} ${bgColour}`}
            exit={{ opacity: 0 }}
            layout
        >
            <span>
                <FontAwesomeIcon className='mr-2' icon={icon} />
                {notificationItem.description}
            </span>
            <button className='ml-2 cursor-pointer' onClick={() => removeNotificationItem(notificationItem)} aria-label='Close Notification'>
                <FontAwesomeIcon icon={faClose} />
            </button>
            <span
                className={`absolute bottom-0 left-0 h-[3px] transition-all ${timeoutColour}`}
                style={{ width: `${(notificationTimeout - counter) / 100}%` }}
            />
        </motion.li>
    );
};
