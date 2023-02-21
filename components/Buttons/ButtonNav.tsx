import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export const ButtonNav = ({
    icon,
    href,
    className,
    children,
}: {
    icon: IconDefinition;
    href: string;
    className?: string;
    children: React.ReactNode;
}) => {
    // * Get router instance
    const router = useRouter();

    // * State to store hover state for each nav item
    const [hover, setHover] = useState(false);

    // * State to store state for if current nav item is the active page
    const [active, setActive] = useState(false);

    // * Set nav button to active if current pathname is equal to href of the nav button
    useEffect(() => {
        if (router.pathname === href) setActive(true);
    }, []);

    return (
        <Link
            className={`relative inline-flex cursor-pointer items-center justify-center rounded border border-borderPrimary p-2 hover:border-transparent hover:bg-primary/90 hover:text-txtPrimary/90
        ${active ? "bg-primary text-txtPrimary" : "bg-bgLvl1"} ${className}`}
            href={href}
            onPointerEnter={() => setHover(true)}
            onPointerLeave={() => setHover(false)}
        >
            <FontAwesomeIcon icon={icon} />
            <span
                className={`${
                    !hover && "sm:hidden"
                } z-10 ml-2 sm:absolute sm:left-full sm:whitespace-nowrap sm:rounded sm:border sm:border-borderPrimary sm:bg-bgLvl1 sm:px-1 sm:text-sm sm:text-txtBg`}
            >
                {children}
            </span>
        </Link>
    );
};
