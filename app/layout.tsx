import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PolkaNavbar } from "@/components/polkabasket-style/PolkaNavbar";

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
      <body className="min-h-screen overflow-x-hidden font-sans antialiased">
        <div className="min-h-screen bg-neutral-950">
          <PolkaNavbar />
          <main className="min-h-screen">{children}</main>
        </div>
      </body>
    </html>
  );
}
