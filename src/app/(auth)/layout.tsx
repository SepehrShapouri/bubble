import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";

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
    template:"%s | bubble",
    default:"bubble"
  },
  description: "Your daily go to social network",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {user} = await validateRequest()
  if(user) redirect("/")
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
