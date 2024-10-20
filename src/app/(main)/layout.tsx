import Navbar from "@/components/main/Navbar";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import MenuBar from "./MenuBar";
import Providers from "@/components/providers/Providers";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    template: "%s | bubble",
    default: "bubble",
  },
  description: "Your daily go to social network",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
        <div className="flex min-h-screen flex-col bg-stone-100 dark:bg-slate-900">
          <Navbar />
          <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-5">
            <MenuBar className="sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-4 xl:w-80" />
            {children}
          </div>
          <MenuBar className="sticky bottom-0 max-h-[70px] flex w-full justify-evenly  border-t bg-card p-3 sm:hidden" />
        </div>
        </Providers>
      </body>
    </html>
  );
}
