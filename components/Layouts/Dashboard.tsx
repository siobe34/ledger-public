import { useState } from "react";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faBars, faUserAlt, faTable, faHome, faSignOut, faChartArea } from "@fortawesome/free-solid-svg-icons";

import { pathLinks } from "../../lib/LINK_REFERENCES";

import { ButtonNav } from "../Buttons/ButtonNav";

export const Dashboard = ({ children }: { children: React.ReactNode }) => {
    // * State of menu displayed or hidden
    const [active, setActive] = useState(false);

    return (
        <div className='grid h-full w-full grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)] sm:grid-cols-[auto_minmax(0,1fr)] sm:grid-rows-1'>
            {/* Dashboard navigation links */}
            <motion.nav className='flex flex-col flex-wrap gap-4 border-b border-borderBase bg-bgBase p-8 sm:border-b-[0] sm:border-r sm:px-4' layout>
                {/* Mobile Menu Button */}
                <motion.button
                    className='flex items-start self-center text-xl sm:hidden'
                    type='button'
                    aria-label='Mobile Menu'
                    onClick={() => setActive(!active)}
                    whileHover={{ opacity: 0.5 }}
                >
                    <FontAwesomeIcon className='pointer-events-none' icon={active ? faClose : faBars} />
                </motion.button>
                {/* Display menu buttons if active */}
                <ul className={`${active ? "flex" : "hidden"} flex-col gap-4 sm:flex`}>
                    <ButtonNav
                        icon={faHome}
                        href={pathLinks.home}
                        className='after:absolute after:top-full after:mt-2 after:hidden after:w-[130%] after:border after:border-borderPrimary/40 sm:relative sm:mb-2 sm:after:block'
                    >
                        Home
                    </ButtonNav>
                    <ButtonNav icon={faUserAlt} href={pathLinks.manage}>
                        Account Management
                    </ButtonNav>
                    <ButtonNav icon={faTable} href={pathLinks.transactions}>
                        Transactions
                    </ButtonNav>
                    <ButtonNav icon={faChartArea} href={pathLinks.monthly}>
                        Charts & Analysis
                    </ButtonNav>
                    <ButtonNav
                        icon={faSignOut}
                        href={pathLinks.signOut}
                        className='after:absolute after:bottom-full after:mb-2 after:hidden after:w-[130%] after:border after:border-borderPrimary/40 sm:relative sm:mt-2 sm:after:block'
                    >
                        Sign Out
                    </ButtonNav>
                </ul>
            </motion.nav>
            <motion.div className='flex w-full flex-col items-center justify-start gap-4 p-8 sm:items-start' layout>
                {children}
            </motion.div>
        </div>
    );
};
