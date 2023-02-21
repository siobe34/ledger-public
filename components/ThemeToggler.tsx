import { useState, useEffect, useMemo } from "react";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon, faCircleHalfStroke } from "@fortawesome/free-solid-svg-icons";

import { ITheme } from "../types/ITheme";
import { updateChartJSColours } from "../lib/updateChartJSColours";

export const ThemeToggler = ({ className }: { className: string }) => {
    // * State to store the currently selected theme
    const [currentTheme, setCurrentTheme] = useState<ITheme["theme"]>("light");

    const toggleTheme = () => {
        if (currentTheme === "light") {
            // * Set class 'dark' on document element
            document.documentElement.classList.add("dark");
            setCurrentTheme("dark");

            // * Set dark theme in Local Storage
            window.localStorage.setItem("theme", "dark");
        }

        if (currentTheme === "dark") {
            setCurrentTheme("light");
            // * Remove class 'dark' from document element
            document.documentElement.classList.remove("dark");

            // * Set light theme in Local Storage
            window.localStorage.setItem("theme", "light");
        }
    };

    useEffect(() => {
        // * Get stored theme from Local Storage
        const storedTheme = window.localStorage.getItem("theme") as ITheme["theme"];
        const preferDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

        //* 1. Check if local storage has a saved theme
        //* Theme is dark mode
        if (storedTheme && storedTheme === "dark") {
            // * Set class 'dark' on document element and set 'dark' theme state
            document.documentElement.classList.add("dark");
            setCurrentTheme("dark");
        }
        //* Theme is light mode
        if (storedTheme && storedTheme === "light") {
            // * Remove potential 'dark' from document element and set 'light' theme state
            document.documentElement.classList.remove("dark");
            setCurrentTheme("light");
        }
        //* 2. If no theme exists then check media queries for user-prefers-theme
        //* Media query matches dark mode
        if (!storedTheme && preferDarkTheme) {
            // * Set class 'dark' on document element and set 'dark' theme state
            document.documentElement.classList.add("dark");
            setCurrentTheme("dark");
        }
        //* Media query does not match dark mode
        if (!storedTheme && !preferDarkTheme) {
            // * Remove class 'dark' on document element and set 'light' theme state
            document.documentElement.classList.remove("dark");
            setCurrentTheme("light");
        }
        //* 3. If a saved theme and a media query BOTH exists then use the saved theme
        //* This case is already handled by code above
    }, []);

    // * Update the chart js colours whenever the current theme changes
    useMemo(() => {
        // * Call function to update ChartJS colours based on current theme
        // ! This function is called whenever any page on the site loads which may impact performance since not all pages have charts..but the logic in the function is so minimal that it shouldn't be an issue
        updateChartJSColours(currentTheme);
    }, [currentTheme]);

    return (
        <button
            type='button'
            aria-label='Toggle Site Theme'
            className={`${className} hover:bg-primary relative flex cursor-pointer items-center justify-center gap-6 rounded-2xl border border-borderPrimary bg-bgLvl1 py-2 px-[0.8rem] text-base hover:border-transparent hover:text-txtPrimary`}
            onClick={() => toggleTheme()}
        >
            <motion.span
                className={`absolute ${
                    currentTheme === "light" ? "right-[15%]" : "right-[65%]"
                } flex h-4 w-4 items-center justify-center rounded-full bg-inherit`}
                layout
            >
                <FontAwesomeIcon icon={faCircleHalfStroke} />
            </motion.span>
            <FontAwesomeIcon className='pointer-events-none text-sm' icon={faMoon} />
            <FontAwesomeIcon className='pointer-events-none text-sm' icon={faSun} color='#f2f28d' />
        </button>
    );
};
