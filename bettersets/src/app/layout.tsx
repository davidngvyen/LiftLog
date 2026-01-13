import type { Metadata } from "next";
import { Geist_Mono, Press_Start_2P } from "next/font/google"; // Added Press_Start_2P
import "./globals.css";
import { ReactNode } from "react";
// import Header from "@/components/layout/Header"; // Keeping header/footer for landing pages if needed, but dashboard has its own
// import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-press-start-2p",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BetterSets",
  description: "A fitness tracking app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pressStart2P.variable} ${geistMono.variable} antialiased`}
      >
        {/* We might want to clear Header/Footer for dashboard routes, 
            but for now leaving them as they might be used on landing. 
            Dashboard layout will likely overlay or we should restructure if Header conflicts.
            Actually, DashboardLayout has its own Sidebar, so Header might look weird if it persists.
            Ideally RootLayout only provides Context/Body, and (marketing) layout provides Header/Footer.
            For now, I'll comment them out to strictly follow the User's "App" design which didn't have a top header.
         */}
        {/* <Header /> */}
        {children}
        {/* <Footer /> */}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
