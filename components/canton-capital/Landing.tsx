import Link from "next/link";
import { CcBox } from "./CcBox";
import { BarChart3, Landmark, Vote } from "lucide-react";

export function Landing() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-16 px-4 py-20">
      <section className="space-y-6">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/45">
          Canton • Funds • Governance • Analytics
        </p>
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
          <span className="cc-gradient">Canton Capital</span>
          <br />
          <span className="text-white/90">
            Private fund operations with measured decisions.
          </span>
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-white/55">
          Capital moves on-ledger; the dashboard turns those choices into
          live metrics—so your hackathon story is not just execution, but
          insight.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard" className="cc-btn cc-btn--primary">
            Open dashboard
          </Link>
          <Link href="/funds" className="cc-btn">
            View funds
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "Funds",
            body: "Create and inspect fund records, treasury, and investors—wired to API routes you can swap for Canton JSON API.",
            icon: Landmark,
          },
          {
            title: "Governance",
            body: "Proposals, votes, and execute flow—designed for a clean live demo on stage.",
            icon: Vote,
          },
          {
            title: "Analytics",
            body: "Success rate, participation, and activity views backed by /api/analytics.",
            icon: BarChart3,
          },
        ].map(({ title, body, icon: Icon }) => (
          <CcBox key={title} strong>
            <Icon className="mb-3 h-6 w-6 text-white/50" strokeWidth={1.5} />
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/70">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/45">{body}</p>
          </CcBox>
        ))}
      </section>
    </div>
  );
}
