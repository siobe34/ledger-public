import "../styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { useState } from "react";
import { useRouter } from "next/router";

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { motion, AnimatePresence } from "framer-motion";
import { config as fontAwesomeConfig } from "@fortawesome/fontawesome-svg-core";

import type { AppPropsExtended } from "../types/App";

import { ScrollToTop } from "../components/ScrollToTop";
import { Header } from "../components/Header";

// * Configuring Font Awesome
fontAwesomeConfig.autoAddCss = false;

function MyApp({ Component, pageProps }: AppPropsExtended) {
    // * Get router instance
    const router = useRouter();

    // * Create supabase client on the client side
    // * Env variables must be named: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
    const [supabaseClient] = useState(() => createBrowserSupabaseClient());

    // * If page has nested layout then get layout, otherwise render default page
    const getLayout = Component.getLayout ?? ((page) => page);

    return (
        <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
            <div className='app'>
                {/* Button to scroll to top of page */}
                <ScrollToTop />

                {/* Main App Header */}
                <Header />

                {/* Main App Content */}
                <AnimatePresence mode='wait' key={router.route}>
                    <motion.main
                        className='relative flex flex-col items-center justify-start bg-bgBase text-txtBg/80'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, ease: [0.17, 0.67, 0.83, 0.67] }}
                    >
                        {getLayout(<Component {...pageProps} />)}
                    </motion.main>
                </AnimatePresence>
            </div>
        </SessionContextProvider>
    );
}

export default MyApp;
