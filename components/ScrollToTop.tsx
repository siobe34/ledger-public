import { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleUp } from "@fortawesome/free-solid-svg-icons";

export const ScrollToTop = () => {
    // * State to show or hide scroll to top button
    const [showScroll, setShowScroll] = useState<boolean>(false);

    // * Function to scroll to top of window
    const scrollTop = () => {
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        // * Function to determine if client is at top of page or not
        // * If at top of page then don't show scroll to top button, otherwise show it
        const checkIfScroll = () => {
            const clientHeight = document.documentElement.clientHeight;
            const maxPageHeight = document.documentElement.scrollHeight;
            if (maxPageHeight > clientHeight) setShowScroll(true);
        };

        // * Add event listener on page load to check if at top of page every time client window scrolls
        window.addEventListener("scroll", () => {
            checkIfScroll();
            if (window.scrollY === 0) setShowScroll(false);
        });
    }, []);

    return (
        <button
            className={`fixed bottom-8 right-[5vw] ${
                showScroll ? "flex" : "hidden"
            } z-10 cursor-pointer items-center justify-center rounded-full text-2xl`}
            type='button'
            aria-label='Scroll to Top'
            onClick={() => scrollTop()}
        >
            <FontAwesomeIcon icon={faChevronCircleUp} />
        </button>
    );
};
