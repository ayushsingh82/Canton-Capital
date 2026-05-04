"use client";

import Link from "next/link";
import PixelBlast from "./PixelBlast";

const SECTION_PADDING = "px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24 lg:py-28";
const CONTENT_MAX = "mx-auto max-w-7xl";
const SILVER = "#A3A3A3";

export function LandingPolka() {
  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Hero — matches PolkaBasket HomePage */}
      <section
        className={`relative min-h-[92vh] w-full overflow-hidden sm:min-h-[95vh] ${SECTION_PADDING}`}
        style={{ paddingTop: "calc(5rem + 2vh)" }}
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            maskImage: "radial-gradient(circle at center, transparent 20%, black 80%)",
            WebkitMaskImage: "radial-gradient(circle at center, transparent 20%, black 80%)",
            opacity: 0.7,
          }}
        >
          <PixelBlast
            variant="square"
            pixelSize={3}
            color={SILVER}
            patternScale={2}
            patternDensity={0.6}
            pixelSizeJitter={0}
            enableRipples
            rippleSpeed={0.4}
            rippleThickness={0.12}
            rippleIntensityScale={0.8}
            liquid={false}
            liquidStrength={0.12}
            liquidRadius={1.2}
            liquidWobbleSpeed={5}
            speed={0.5}
            edgeFade={0.3}
            transparent
          />
        </div>
        <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-15%,rgba(163,163,163,0.08),transparent_50%)]" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`,
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        <div
          className={`relative z-10 flex min-h-[85vh] flex-col items-center justify-center text-center ${CONTENT_MAX}`}
        >
          <div className="landing-section landing-stagger-1 mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            <span className="text-xs font-medium uppercase tracking-widest text-neutral-400">
              Canton Network • Funds &amp; governance
            </span>
          </div>

          <h1 className="landing-section landing-stagger-2 max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="bg-gradient-to-br from-white via-white to-neutral-500 bg-clip-text text-transparent">
              Decisions in
            </span>
            <br />
            <span className="bg-gradient-to-br from-white via-white to-neutral-500 bg-clip-text text-transparent">
              one ledger
            </span>
          </h1>

          <p className="landing-section landing-stagger-3 mt-8 max-w-3xl text-lg leading-relaxed text-neutral-400 sm:text-xl">
            Canton Capital turns fund creation, proposals, and votes into live analytics—so
            allocators and judges see{" "}
            <span className="text-white">execution plus insight</span> on the dashboard.
          </p>

          <p className="landing-section landing-stagger-3 mt-4 max-w-2xl text-sm leading-relaxed text-neutral-500 sm:text-base">
            Create a fund, route proposals, vote, execute—then open analytics backed by the same
            API shape you will wire to the Canton JSON API.
          </p>

          <div className="landing-section landing-stagger-4 mt-12 flex flex-col items-center gap-6 sm:flex-row">
            <Link
              href="/dashboard"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-white px-10 py-4 text-sm font-bold text-neutral-950 transition hover:bg-neutral-200"
            >
              <span className="relative z-10">Open dashboard</span>
              <div className="absolute inset-0 z-0 bg-gradient-to-r from-white via-neutral-100 to-white opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
            <a
              href="#how"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-10 py-4 text-sm font-bold text-white transition hover:bg-white/10"
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={`relative overflow-hidden bg-black ${SECTION_PADDING}`}>
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
        <div className={`relative z-10 ${CONTENT_MAX}`}>
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-3xl sm:p-10 md:p-12">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-0">
              {[
                { value: "Live", label: "API routes" },
                { value: "Funds", label: "Dashboard" },
                { value: "Vote", label: "Governance" },
                { value: "JSON", label: "Canton-ready" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center text-center sm:border-e sm:border-white/10 sm:px-6 last:sm:border-e-0"
                >
                  <p className="bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl md:text-6xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-widest text-neutral-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Split section */}
      <section className={`relative overflow-hidden ${SECTION_PADDING}`}>
        <div className={`relative z-10 ${CONTENT_MAX}`}>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-500">
                Ledger-backed clarity
              </p>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                One surface.
                <br />
                Full pipeline.
              </h2>
              <div className="mt-8 space-y-6 text-lg text-neutral-400">
                <p>
                  Models follow <span className="text-white">Fund</span> and{" "}
                  <span className="text-white">Proposal</span> templates—simple Daml you can
                  extend later while the UI stays stable.
                </p>
                <p>
                  The <span className="text-white">analytics layer</span> aggregates counts and
                  outcomes so your demo ends on insight, not just buttons.
                </p>
              </div>
              <div className="mt-10 flex items-center gap-4">
                <div className="h-px flex-grow bg-white/10" />
                <span className="text-xs font-medium uppercase tracking-widest text-neutral-500">
                  Canton JSON API
                </span>
              </div>
            </div>
            <div className="relative aspect-square rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-50" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-xl bg-white/10 p-2.5">
                    <svg className="text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-mono uppercase tracking-tighter text-neutral-500">
                    Store + optional ledger
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <div className="h-full w-[80%] bg-emerald-500/50" />
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <div className="h-full w-[65%] bg-blue-500/50" />
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <div className="h-full w-[90%] bg-pink-500/50" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-white">Funds • Proposals • Votes</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                    Hackathon-ready flow
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid — Social Layer analogue */}
      <section className={`relative overflow-hidden bg-white/[0.03] ${SECTION_PADDING}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(163,163,163,0.05),transparent_50%)]" />
        <div className={`relative z-10 ${CONTENT_MAX}`}>
          <div className="flex flex-col items-center text-center">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
              Product surface
            </p>
            <h2 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Funds. Proposals. Analytics.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-400 sm:text-lg">
              Same interaction model as a polished DeFi app—tuned for Canton Capital routes and API handlers.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Explore funds",
                description: "Browse capital, managers, and drill into treasury + proposals.",
              },
              {
                title: "Create & propose",
                description: "Ship fund and proposal forms wired to POST endpoints you own.",
              },
              {
                title: "Vote & execute",
                description: "Yes/no flow with execute when the tally passes—demo-friendly.",
              },
              {
                title: "Analytics OS",
                description: "Dashboard and advanced page share one aggregation pipeline.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 transition duration-300 hover:border-white/[0.1] hover:bg-white/[0.05]"
              >
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className={`relative overflow-hidden ${SECTION_PADDING}`}>
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(163,163,163,0.06),transparent_60%)]" />
        <div className={`relative z-10 ${CONTENT_MAX}`}>
          <div className="flex flex-col items-center text-center">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
              The process
            </p>
            <h2 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              From fund to insight
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg md:text-xl">
              One demo path: create → propose → vote → execute → refresh analytics.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-3 sm:gap-8 lg:mt-20">
            {[
              {
                step: "1",
                title: "Create fund",
                description: "POST /api/funds with manager and initial capital.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                step: "2",
                title: "Propose & vote",
                description: "Create a proposal, tally YES/NO from the detail page.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                ),
              },
              {
                step: "3",
                title: "Analyze",
                description: "GET /api/analytics powers charts and judge-friendly metrics.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
              },
            ].map((item) => (
              <article
                key={item.step}
                className="group relative flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 transition duration-300 hover:border-white/[0.1] hover:bg-white/[0.05]"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition group-hover:border-white/15 group-hover:bg-white/10">
                    {item.icon}
                  </span>
                  <span className="text-2xl font-bold tabular-nums text-white/20">{item.step}</span>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] bg-black/20 py-12">
        <div className={`${CONTENT_MAX} px-4 sm:px-6 md:px-10`}>
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div className="text-center md:text-left">
              <p className="mb-2 text-lg font-bold text-white">Canton Capital</p>
              <p className="mx-auto max-w-xs text-sm text-neutral-400 md:mx-0">
                Funds, governance, and analytics on Canton—UI aligned with PolkaBasket patterns.
              </p>
            </div>
            <div className="flex justify-center gap-6 md:justify-end">
              <Link href="/funds" className="text-sm text-neutral-400 transition hover:text-white">
                Explore
              </Link>
              <Link href="/dashboard" className="text-sm text-neutral-400 transition hover:text-white">
                Dashboard
              </Link>
              <Link href="/analytics" className="text-sm text-neutral-400 transition hover:text-white">
                Analytics
              </Link>
            </div>
          </div>
          <div className="mt-12 border-t border-white/5 pt-8 text-center">
            <p className="text-xs text-neutral-600">
              © {new Date().getFullYear()} Canton Capital · Hackathon demo
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
