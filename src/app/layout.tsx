import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import { type Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Ledger",
  description:
    "Get started with Ledger today to track your bank transactions, categorize them, and view insightful charts about your spending habits.",
  icons: [
    { rel: "icon", type: "image+svg/xml", url: "/favicon.svg" },
    { rel: "icon", type: "image/png", url: "/favicon/favicon.png" },
  ],
  manifest: "/site.webmanifest",
  robots: "/robots.txt",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`grid min-h-screen grid-rows-[minmax(5vh,auto)_1fr] font-sans ${inter.variable}`}
        style={{ minHeight: "100dvh" }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex flex-col items-center justify-start">
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
