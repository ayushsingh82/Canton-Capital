"use client";

import { useEffect, useState } from "react";
import { CcBox } from "@/components/canton-capital/CcBox";
import type { AnalyticsPayload } from "@/lib/canton-capital/types";
import { polkaContainer, polkaH1, polkaPage } from "@/lib/polka-ui";

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
      <div className={polkaPage}>
        <div className={`${polkaContainer} py-12`}>
          <p className="text-sm text-neutral-400">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={polkaPage}>
      <div className={polkaContainer}>
        <div>
          <h1 className={polkaH1}>Advanced analytics</h1>
          <p className="text-sm text-neutral-400">
            Derived metrics for judges — same source as the dashboard.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <CcBox strong>
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
              Proposal efficiency
            </h2>
            <p className="mt-4 text-3xl font-semibold tabular-nums text-white">
              {(data.successRate * 100).toFixed(0)}%
            </p>
            <p className="mt-2 text-xs text-neutral-500">
              Share of proposals where YES leads NO (demo heuristic).
            </p>
          </CcBox>
          <CcBox strong>
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
              Capital utilization (demo)
            </h2>
            <p className="mt-4 text-3xl font-semibold tabular-nums text-white">
              {data.totalCapital > 0
                ? `${Math.min(99, Math.round((data.activeProposals / Math.max(1, data.proposals)) * 100))}%`
                : "—"}
            </p>
            <p className="mt-2 text-xs text-neutral-500">
              Active proposals vs total — tune with real treasury logic later.
            </p>
          </CcBox>
          <CcBox strong>
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
              Ledger
            </h2>
            <p className="mt-4 text-lg text-neutral-200">
              {data.ledgerConnected ? "Connected (counts merged)" : "Demo store only"}
            </p>
          </CcBox>
        </div>

        <CcBox strong>
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
            Best voters (demo ranking)
          </h2>
          <ul className="mt-4 space-y-2">
            {data.bestVoters.map((v, i) => (
              <li
                key={v.party}
                className="flex justify-between rounded-xl border border-white/[0.06] bg-black/30 px-3 py-2 text-sm"
              >
                <span className="text-neutral-400">
                  {i + 1}. {v.party}
                </span>
                <span className="tabular-nums text-neutral-200">{v.accurateVotes}</span>
              </li>
            ))}
          </ul>
        </CcBox>

        <CcBox strong>
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
            Most active funds
          </h2>
          <ul className="mt-4 space-y-2">
            {data.fundActivity.map((f) => (
              <li
                key={f.fundId}
                className="flex justify-between rounded-xl border border-white/[0.06] bg-black/30 px-3 py-2 text-sm"
              >
                <span className="text-neutral-300">{f.label}</span>
                <span className="tabular-nums text-neutral-200">{f.score}</span>
              </li>
            ))}
          </ul>
        </CcBox>
      </div>
    </div>
  );
}
