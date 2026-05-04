"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links: { href: string; label: string }[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/funds", label: "Funds" },
  { href: "/create-fund", label: "Create fund" },
  { href: "/proposal/create", label: "Proposal" },
  { href: "/analytics", label: "Analytics" },
];

export function CapitalNavbar() {
  const pathname = usePathname();
  return (
    <header className="cc-nav sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="cc-gradient text-base font-semibold tracking-tight">
          Canton Capital
        </Link>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={pathname === href ? "cc-nav-active" : ""}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
