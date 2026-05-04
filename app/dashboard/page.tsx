"use client";

import { useEffect, useState } from "react";
import { CcBox } from "@/components/canton-capital/CcBox";
import { StatsCard } from "@/components/canton-capital/StatsCard";
import {
  CapitalAreaChart,
  ActivityBarChart,
  ProposalDonutChart,
  CapitalDistributionChart,
  CapitalFlowChart,
  TrendSparkline
} from "@/components/canton-capital/AnalyticsCharts";
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
            Operations Dashboard
          </h1>
          <p className="mt-1 text-sm text-neutral-400 flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full ${ledgerConnected ? "bg-emerald-400 cc-live-dot" : "bg-neutral-500"}`} />
            Fed by <code className="text-white/60">GET /api/analytics</code>
            {ledgerConnected ? " • Ledger contracts active" : " • Demo store running"}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatsCard
            title="Total funds"
            value={String(data.totalFunds)}
            trend={data.trendData.funds}
            trendColor="#34d399"
          />
          <StatsCard
            title="Total capital"
            value={`$${(data.totalCapital / 1000).toLocaleString()}k`}
            trend={data.trendData.capital}
            trendColor="#fbbf24"
          />
          <StatsCard
            title="Proposals"
            value={String(data.proposals)}
            hint={`${data.activeProposals} active`}
            trend={data.trendData.proposals}
            trendColor="#60a5fa"
          />
          <StatsCard
            title="Success rate"
            value={`${(data.successRate * 100).toFixed(0)}%`}
          />
          <StatsCard
            title="Participation"
            value={`${(data.participationRate * 100).toFixed(0)}%`}
            trend={data.trendData.participation}
            trendColor="#fb7185"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <CcBox strong className="lg:col-span-2 cc-chart-stagger-1 cc-chart-card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
                  Capital trajectory
                </h2>
                <p className="mt-1 text-xs text-white/35">Asset growth indexed by period</p>
              </div>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">Live</span>
            </div>
            <div className="mt-4 -ml-4">
              <CapitalAreaChart data={data.capitalOverTime} />
            </div>
          </CcBox>
          <CcBox strong className="lg:col-span-1 cc-chart-stagger-2 cc-chart-card">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
              Proposal Outcomes
            </h2>
            <div className="mt-2">
              <ProposalDonutChart data={data.proposalOutcomes} />
            </div>
          </CcBox>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <CcBox strong className="lg:col-span-1 cc-chart-stagger-3 cc-chart-card">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
              Fund Distribution
            </h2>
            <p className="mt-1 mb-4 text-xs text-white/35">Capital by active fund</p>
            <CapitalDistributionChart data={data.capitalDistribution} />
          </CcBox>
          <CcBox strong className="lg:col-span-2 cc-chart-stagger-4 cc-chart-card">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
              Monthly Capital Flow
            </h2>
            <div className="mt-4 -ml-4">
              <CapitalFlowChart data={data.monthlyCapitalFlow} />
            </div>
          </CcBox>
        </div>

        <div className="grid gap-4 lg:grid-cols-1">
          <CcBox strong className="cc-chart-stagger-5 cc-chart-card">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
              Activity Over Time
            </h2>
            <div className="mt-4">
              <ActivityBarChart data={data.activityByDay} />
            </div>
          </CcBox>
        </div>
      </div>
    </div>
  );
}
