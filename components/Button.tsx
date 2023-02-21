import Link from "next/link";

import { IButton } from "../types/IButton";

export const buttonUtils = `inline-flex cursor-pointer items-center justify-center rounded border border-borderBase text-txtBg bg-bgLvl1 py-2 px-4 hover:bg-primary hover:text-txtPrimary hover:border-transparent`;

export const Button = ({ className, children, onClick, href, hrefInternal, ariaLabel }: IButton) => {
    if (hrefInternal)
        return (
            <Link className={`${className} ${buttonUtils}`} href={hrefInternal} onClick={onClick} aria-label={ariaLabel}>
                {children}
            </Link>
        );
    if (href)
        return (
            <a className={`${className} ${buttonUtils}`} href={href} onClick={onClick} aria-label={ariaLabel}>
                {children}
            </a>
        );
    return (
        <button className={`${className} ${buttonUtils}`} onClick={onClick} aria-label={ariaLabel}>
            {children}
        </button>
    );
};
