"use client";

import { useEffect, useState } from "react";
import { CcBox } from "@/components/canton-capital/CcBox";
import type { AnalyticsPayload } from "@/lib/canton-capital/types";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsPayload | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/analytics");
      setData(await res.json());
    })();
  }, []);

  if (!data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-sm text-white/50">Loading…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold cc-gradient">Advanced analytics</h1>
        <p className="text-sm text-white/45">
          Derived metrics for judges — same source as the dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <CcBox strong>
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
            Proposal efficiency
          </h2>
          <p className="mt-4 text-3xl font-semibold tabular-nums text-white/90">
            {(data.successRate * 100).toFixed(0)}%
          </p>
          <p className="mt-2 text-xs text-white/35">
            Share of proposals where YES leads NO (demo heuristic).
          </p>
        </CcBox>
        <CcBox strong>
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
            Capital utilization (demo)
          </h2>
          <p className="mt-4 text-3xl font-semibold tabular-nums text-white/90">
            {data.totalCapital > 0
              ? `${Math.min(99, Math.round((data.activeProposals / Math.max(1, data.proposals)) * 100))}%`
              : "—"}
          </p>
          <p className="mt-2 text-xs text-white/35">
            Active proposals vs total — tune with real treasury logic later.
          </p>
        </CcBox>
        <CcBox strong>
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
            Ledger
          </h2>
          <p className="mt-4 text-lg text-white/80">
            {data.ledgerConnected ? "Connected (counts merged)" : "Demo store only"}
          </p>
        </CcBox>
      </div>

      <CcBox strong>
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
          Best voters (demo ranking)
        </h2>
        <ul className="mt-4 space-y-2">
          {data.bestVoters.map((v, i) => (
            <li
              key={v.party}
              className="flex justify-between border border-white/10 bg-black/30 px-3 py-2 text-sm"
            >
              <span className="text-white/60">
                {i + 1}. {v.party}
              </span>
              <span className="tabular-nums text-white/85">{v.accurateVotes}</span>
            </li>
          ))}
        </ul>
      </CcBox>

      <CcBox strong>
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
          Most active funds
        </h2>
        <ul className="mt-4 space-y-2">
          {data.fundActivity.map((f) => (
            <li
              key={f.fundId}
              className="flex justify-between border border-white/10 bg-black/30 px-3 py-2 text-sm"
            >
              <span className="text-white/70">{f.label}</span>
              <span className="tabular-nums text-white/85">{f.score}</span>
            </li>
          ))}
        </ul>
      </CcBox>
    </div>
  );
}
