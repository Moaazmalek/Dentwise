import {Analytics} from '@vercel/analytics/next'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {ClerkProvider} from '@clerk/nextjs'
import UserSync from "@/components/UserSync";
import TanStackProvider from "@/components/providers/TanstackProvider";
import { Toaster } from "sonner";
import MobileNav from '@/components/MobileNav';
import { currentUser } from '@clerk/nextjs/server';
import Navbar from '@/components/Navbar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DentWise - AI Powered Dental Assistant",
  description: "Get instant dental advice through voice calls with our AI assistent. Available 24/7",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const user = await currentUser();
    const isAdmin = user?.publicMetadata?.role === "admin";
  return (
    <TanStackProvider>
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark `}
      >
        {/**Done in the home page */}
        {/* <UserSync/> */}
        <Toaster />
        <Navbar isAdmin={isAdmin}/>
       
          {children}
       
        <MobileNav isAdmin={isAdmin} />
        <Analytics/>
      </body>
    </html>
    </ClerkProvider>
    </TanStackProvider>
  );
}
