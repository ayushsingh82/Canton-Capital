"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { path: "/funds", label: "Explore" },
  { path: "/dashboard", label: "Dashboard" },
  { path: "/create-fund", label: "Create" },
  { path: "/analytics", label: "Analytics" },
];

export function PolkaNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);

  return (
    <header className="absolute left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        <nav
          className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-neutral-950/90 px-4 py-3 shadow-xl backdrop-blur-md sm:px-6"
          aria-label="Main"
        >
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-white no-underline transition hover:opacity-90 sm:text-xl"
          >
            Canton Capital
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "border-b-2 border-white text-white"
                    : "text-neutral-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white sm:inline-flex">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              Demo mode
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-neutral-400 hover:bg-white/5 hover:text-white md:hidden"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {mobileMenuOpen ? (
          <div className="mt-2 rounded-2xl border border-white/10 bg-neutral-950/95 p-4 shadow-xl backdrop-blur-md md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? "border-b-2 border-white text-white"
                      : "text-neutral-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
