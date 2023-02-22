import { useEffect } from "react";
import { useRouter } from "next/router";

import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";

import { Loading } from "../../components/Loading";

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

    // * If user is already logged in then redirect
    useEffect(() => {
        if (user && user.role === "authenticated") {
            router.push("/demo");
        }
    }, [user]);

    // * Func to artificially sign in user
    const publicSignIn = () => {
        supabaseClient.auth.signInWithPassword({ email: "siobe14@hotmail.com", password: "publicledgerpw" });
    };

    // * Show loading component while logged in user is redirected
    if (user) return <Loading />;

    return (
        <article className='mt-16 flex items-center p-2'>
            <div className='flex flex-col flex-wrap justify-center gap-4 rounded border border-borderBase bg-bgLvl1 py-8 px-12'>
                <button
                    className='inline-flex cursor-pointer items-center justify-center rounded border border-primary bg-primary py-2 px-4 text-txtPrimary hover:border-transparent hover:bg-bgSuccess hover:text-txtSuccess'
                    onClick={() => publicSignIn()}
                >
                    Public Sign In
                </button>
                <span className='rounded border border-bgBase bg-bgError p-4 text-txtError'>
                    Authentication is disabled.
                    <br />
                    Please sign in with the "Public Sign In" button above.
                </span>
                <Auth supabaseClient={supabaseClient} appearance={{ ...supaBaseAuthUI }} showLinks={false} />
            </div>
        </article>
    );
};

export default SignIn;
