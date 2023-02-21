import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { ViewType } from "@supabase/auth-ui-react/dist/esm/src/types";

import { Loading } from "../../components/Loading";
import { Button } from "../../components/Button";

// * Customizing theme for supabase Auth UI component
const supaBaseAuthUI = {
    theme: ThemeSupa,
    variables: {
        default: {
            colors: {
                brand: "rgb(var(--primary))",
                brandAccent: "rgb(var(--borderPrimary))",
                brandButtonText: "rgb(var(--txtPrimary))",
                inputText: "rgb(var(--txtBg))",
                inputLabelText: "rgb(var(--txtBg))",
                messageText: "rgb(var(--txtBg))",
            },
        },
    },
    className: { button: "hover:text-txtPrimary" },
};

const SignIn = () => {
    // * Get router instance
    const router = useRouter();

    // * Get client side supabase instance from state context
    const supabaseClient = useSupabaseClient();

    // * Get client side user instance from state context
    const user = useUser();

    // * State of view shown in supabase Auth component
    const [view, setView] = useState<ViewType>("sign_in");

    // * If user is already logged in then redirect
    useEffect(() => {
        if (user && user.role === "authenticated") {
            router.push("/transactions");
        }
    }, [user]);

    // * Show loading component while logged in user is redirected
    if (user) return <Loading />;

    return (
        <article className='mt-16 flex items-center p-2'>
            <div className='flex flex-col flex-wrap justify-center gap-4 rounded border border-borderBase bg-bgLvl1 py-8 px-12'>
                {view === "sign_in" ? (
                    <Button onClick={() => setView("sign_up")}>Register</Button>
                ) : (
                    <Button onClick={() => setView("sign_in")}>Sign In</Button>
                )}
                <Auth supabaseClient={supabaseClient} appearance={{ ...supaBaseAuthUI }} view={view} />
            </div>
        </article>
    );
};

export default SignIn;
