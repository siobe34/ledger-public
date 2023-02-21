import type { NextPage } from "next";
import type { AppProps } from "next/app";

import { Session } from "@supabase/auth-helpers-nextjs";

export type PageWithLayout<P = {}, IP = P> = NextPage<P, IP> & { getLayout?: (page: React.ReactElement) => React.ReactNode };

export type AppPropsExtended = AppProps & { Component: PageWithLayout; initialSession: Session };
