import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CapitalNavbar } from "@/components/canton-capital/CapitalNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Canton Capital — Funds, governance, analytics",
  description:
    "Private fund + DAO-style proposals + analytics dashboard on Canton (hackathon demo).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <div className="cc-root flex min-h-full flex-1 flex-col">
          <CapitalNavbar />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
