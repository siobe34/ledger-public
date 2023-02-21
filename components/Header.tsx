import Link from "next/link";

import { useUser } from "@supabase/auth-helpers-react";

import { pathLinks } from "../lib/LINK_REFERENCES";

import { Logo } from "../components/Logo";
import { ThemeToggler } from "../components/ThemeToggler";

export const Header = () => {
    // * Get client side user instance from state context
    const user = useUser();

    return (
        <header className='flex flex-wrap items-center justify-center gap-8 border-b border-borderBase bg-bgBase py-4'>
            <Link className='mx-auto' href='/'>
                <Logo />
            </Link>
            <div className='flex flex-wrap items-center justify-center gap-4'>
                {!user && (
                    <Link href={pathLinks.signIn} className='border-primary hover:border-b'>
                        Sign In/Register
                    </Link>
                )}
                <ThemeToggler className='mr-2' />
            </div>
        </header>
    );
};
