"use client";

import { useEffect, useState } from "react";
import { CcBox } from "@/components/canton-capital/CcBox";
import { StatsCard } from "@/components/canton-capital/StatsCard";
import {
  ActivityBars,
  CapitalOverTimeChart,
  OutcomePie,
} from "@/components/canton-capital/MiniCharts";
import type { AnalyticsPayload } from "@/lib/canton-capital/types";

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [ledgerConnected, setLedgerConnected] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/analytics");
        if (!res.ok) throw new Error("Failed to load analytics");
        const json = (await res.json()) as AnalyticsPayload;
        if (!cancelled) {
          setData(json);
          setLedgerConnected(!!json.ledgerConnected);
          setErr(null);
        }
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Error");
      }
    }
    load();
    const id = setInterval(load, 4000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (err || !data) {
    return (
      <div className="min-h-screen overflow-hidden bg-neutral-950 pt-20">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:px-8">
          <p className="text-sm text-neutral-400">{err ?? "Loading dashboard…"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-neutral-950 pt-20">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 md:px-8">
      <div>
        <h1 className="bg-gradient-to-br from-white via-white to-neutral-500 bg-clip-text text-2xl font-semibold text-transparent">
          Operations dashboard
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          Fed by <code className="text-white/60">GET /api/analytics</code>
          {ledgerConnected ? " • Ledger contracts detected" : " • Demo store"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          title="Total funds"
          value={String(data.totalFunds)}
        />
        <StatsCard
          title="Total capital"
          value={`$${data.totalCapital.toLocaleString()}`}
        />
        <StatsCard
          title="Proposals"
          value={String(data.proposals)}
          hint={`${data.activeProposals} active`}
        />
        <StatsCard
          title="Success rate"
          value={`${(data.successRate * 100).toFixed(0)}%`}
        />
        <StatsCard
          title="Participation"
          value={`${(data.participationRate * 100).toFixed(0)}%`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <CcBox strong className="lg:col-span-1">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
            Capital trajectory
          </h2>
          <p className="mt-1 text-xs text-white/35">Indexed by period</p>
          <div className="mt-4">
            <CapitalOverTimeChart data={data.capitalOverTime} />
          </div>
        </CcBox>
        <CcBox strong className="lg:col-span-1">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
            Proposal outcomes
          </h2>
          <div className="mt-6">
            <OutcomePie data={data.proposalOutcomes} />
          </div>
        </CcBox>
        <CcBox strong className="lg:col-span-1">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
            Activity
          </h2>
          <div className="mt-6">
            <ActivityBars data={data.activityByDay} />
          </div>
        </CcBox>
      </div>
      </div>
    </div>
  );
}
