import { GetServerSidePropsContext } from "next";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

// * Func to use browser context to return user's session
export const getUserSession = async (context: GetServerSidePropsContext) => {
    // * Create supabase client on the server side using the browser context
    const supabaseServer = createServerSupabaseClient(context);

    // * Get user for the browser client requesting data from this page
    const {
        data: { user },
    } = await supabaseServer.auth.getUser();

    return user;
};
