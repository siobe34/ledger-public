import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

import { pathLinks } from "../../../lib/LINK_REFERENCES";

const SignOut = () => {
    // * Get router instance
    const router = useRouter();

    // * Get client side supabase instance from state context
    const supabaseClient = useSupabaseClient();

    // * Get client side user instance from state context
    const user = useUser();

    // * State to show message of logout status
    const [logoutStatus, setLogoutStatus] = useState(user ? "in progress..." : "not required.");

    useEffect(() => {
        // * If user is not logged in, redirect to the login page
        if (!user) router.push(pathLinks.signIn);

        try {
            // * Set the refresh token to expire from client side, this should also render it expired from server side
            // * Access tokens cannot be expired and therefore should have a short expiration time by default
            supabaseClient.auth.signOut();

            // * If successful, render on page
            setLogoutStatus("successful");
        } catch (e) {
            console.error(e);

            // * If signout unsuccessful, render on page
            setLogoutStatus("unsuccessful");
        }
    }, [user]);

    return (
        <article className='mt-16 p-2'>
            <p className='rounded border border-borderBase bg-bgLvl1 p-4'>Session sign out {logoutStatus}</p>
        </article>
    );
};

export default SignOut;
