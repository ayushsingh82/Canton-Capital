"use client";

import { useEffect, useMemo, useState } from "react";
import { CcBox } from "@/components/canton-capital/CcBox";
import { StatsCard } from "@/components/canton-capital/StatsCard";
import {
  CapitalAreaChart,
  ActivityBarChart,
  ProposalDonutChart,
  CapitalDistributionChart,
  CapitalFlowChart,
} from "@/components/canton-capital/AnalyticsCharts";
import type { AnalyticsPayload } from "@/lib/canton-capital/types";

function fmtUsd(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n.toLocaleString()}`;
}

function ChartCallout({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "emerald" | "rose" | "amber" | "blue";
}) {
  const toneCls =
    tone === "emerald"
      ? "text-emerald-300"
      : tone === "rose"
        ? "text-rose-300"
        : tone === "amber"
          ? "text-amber-300"
          : tone === "blue"
            ? "text-blue-300"
            : "text-white/85";
  return (
    <div className="flex flex-col gap-0.5 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2">
      <span className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-white/40">
        {label}
      </span>
      <span className={`text-sm font-semibold tabular-nums ${toneCls}`}>
        {value}
      </span>
    </div>
  );
}

function LegendChip({ color, label, value }: { color: string; label: string; value?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-white/[0.05] bg-white/[0.02] px-2 py-1">
      <span className="inline-block h-2 w-2 rounded-full" style={{ background: color }} />
      <span className="text-[0.7rem] font-medium uppercase tracking-wide text-white/55">{label}</span>
      {value ? (
        <span className="ml-auto text-xs font-semibold tabular-nums text-white/80">{value}</span>
      ) : null}
    </div>
  );
}

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

  const derived = useMemo(() => {
    if (!data) return null;
    const cap = data.capitalOverTime;
    const last = cap[cap.length - 1]?.v ?? 0;
    const first = cap[0]?.v ?? 0;
    const peak = cap.reduce((m, p) => Math.max(m, p.v), 0);
    const growthPct = first > 0 ? ((last - first) / first) * 100 : 0;

    const flow = data.monthlyCapitalFlow;
    const totalIn = flow.reduce((a, m) => a + m.inflow, 0);
    const totalOut = flow.reduce((a, m) => a + m.outflow, 0);
    const bestMonth = flow.reduce(
      (best, m) => (m.net > (best?.net ?? -Infinity) ? m : best),
      flow[0],
    );

    const dist = data.capitalDistribution;
    const distTotal = dist.reduce((a, d) => a + d.value, 0);
    const top = dist.reduce(
      (best, d) => (d.value > (best?.value ?? -Infinity) ? d : best),
      dist[0],
    );
    const topShare = distTotal > 0 ? (top.value / distTotal) * 100 : 0;

    const acts = data.activityByDay;
    const actTotal = acts.reduce((a, d) => a + d.count, 0);
    const actAvg = acts.length > 0 ? actTotal / acts.length : 0;
    const actPeak = acts.reduce(
      (best, d) => (d.count > (best?.count ?? -Infinity) ? d : best),
      acts[0],
    );

    const yesValue = data.proposalOutcomes.find((o) => o.label.toLowerCase().includes("yes"))?.value ?? 0;
    const noValue = data.proposalOutcomes.find((o) => !o.label.toLowerCase().includes("yes"))?.value ?? 0;
    const outcomeTotal = yesValue + noValue;

    return {
      last, peak, growthPct,
      totalIn, totalOut, bestMonth,
      top, topShare, distTotal,
      actTotal, actAvg, actPeak,
      yesValue, noValue, outcomeTotal,
    };
  }, [data]);

  if (err || !data || !derived) {
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
            <span className="ml-2 text-white/30">•</span>
            <span className="text-white/40">Auto-refresh every 4s</span>
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatsCard
            title="Total funds"
            value={String(data.totalFunds)}
            hint={`${data.capitalDistribution.length} active`}
            trend={data.trendData.funds}
            trendColor="#34d399"
          />
          <StatsCard
            title="Total capital"
            value={fmtUsd(data.totalCapital)}
            hint={`Peak ${fmtUsd(derived.peak)}`}
            trend={data.trendData.capital}
            trendColor="#fbbf24"
          />
          <StatsCard
            title="Proposals"
            value={String(data.proposals)}
            hint={`${data.activeProposals} active • ${data.proposals - data.activeProposals} executed`}
            trend={data.trendData.proposals}
            trendColor="#60a5fa"
          />
          <StatsCard
            title="Success rate"
            value={`${(data.successRate * 100).toFixed(0)}%`}
            hint={`${derived.yesValue} of ${derived.outcomeTotal} passed`}
          />
          <StatsCard
            title="Participation"
            value={`${(data.participationRate * 100).toFixed(0)}%`}
            hint="Avg. votes per proposal"
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
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <ChartCallout label="Latest" value={fmtUsd(derived.last)} tone="emerald" />
              <ChartCallout label="Peak" value={fmtUsd(derived.peak)} />
              <ChartCallout
                label="Period growth"
                value={`${derived.growthPct >= 0 ? "+" : ""}${derived.growthPct.toFixed(1)}%`}
                tone={derived.growthPct >= 0 ? "emerald" : "rose"}
              />
              <ChartCallout label="Periods" value={`${data.capitalOverTime.length} pts`} />
            </div>
            <div className="mt-4 -ml-4">
              <CapitalAreaChart data={data.capitalOverTime} />
            </div>
          </CcBox>
          <CcBox strong className="lg:col-span-1 cc-chart-stagger-2 cc-chart-card">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
              Proposal Outcomes
            </h2>
            <p className="mt-1 text-xs text-white/35">All-time pass / fail mix</p>
            <div className="mt-2">
              <ProposalDonutChart data={data.proposalOutcomes} />
            </div>
            <div className="mt-3 space-y-2">
              <LegendChip
                color="#34d399"
                label="Passed"
                value={`${derived.yesValue} (${derived.outcomeTotal > 0 ? Math.round((derived.yesValue / derived.outcomeTotal) * 100) : 0}%)`}
              />
              <LegendChip
                color="#fb7185"
                label="Rejected / tie"
                value={`${derived.noValue} (${derived.outcomeTotal > 0 ? Math.round((derived.noValue / derived.outcomeTotal) * 100) : 0}%)`}
              />
            </div>
          </CcBox>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <CcBox strong className="lg:col-span-1 cc-chart-stagger-3 cc-chart-card">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
              Fund Distribution
            </h2>
            <p className="mt-1 mb-3 text-xs text-white/35">
              Capital by active fund — top {data.capitalDistribution.length}
            </p>
            <CapitalDistributionChart data={data.capitalDistribution} />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <ChartCallout label="Top fund" value={derived.top?.name ?? "—"} tone="emerald" />
              <ChartCallout label="Top share" value={`${derived.topShare.toFixed(0)}%`} />
              <ChartCallout label="Total AUM" value={fmtUsd(derived.distTotal)} />
              <ChartCallout label="Funds" value={String(data.capitalDistribution.length)} />
            </div>
          </CcBox>
          <CcBox strong className="lg:col-span-2 cc-chart-stagger-4 cc-chart-card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
                  Monthly Capital Flow
                </h2>
                <p className="mt-1 text-xs text-white/35">Inflow vs. outflow with rolling net</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <ChartCallout label="Inflow" value={fmtUsd(derived.totalIn)} tone="emerald" />
              <ChartCallout label="Outflow" value={fmtUsd(derived.totalOut)} tone="rose" />
              <ChartCallout
                label="Net"
                value={`${derived.totalIn - derived.totalOut >= 0 ? "+" : ""}${fmtUsd(derived.totalIn - derived.totalOut)}`}
                tone={derived.totalIn - derived.totalOut >= 0 ? "emerald" : "rose"}
              />
              <ChartCallout
                label="Best month"
                value={`${derived.bestMonth?.month ?? "—"} ${derived.bestMonth ? fmtUsd(derived.bestMonth.net) : ""}`}
                tone="amber"
              />
            </div>
            <div className="mt-4 -ml-4">
              <CapitalFlowChart data={data.monthlyCapitalFlow} />
            </div>
          </CcBox>
        </div>

        <div className="grid gap-4 lg:grid-cols-1">
          <CcBox strong className="cc-chart-stagger-5 cc-chart-card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
                  Activity Over Time
                </h2>
                <p className="mt-1 text-xs text-white/35">Governance events by weekday</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <ChartCallout label="Total events" value={String(derived.actTotal)} tone="blue" />
              <ChartCallout label="Avg / day" value={derived.actAvg.toFixed(1)} />
              <ChartCallout
                label="Peak day"
                value={derived.actPeak ? `${derived.actPeak.day} (${derived.actPeak.count})` : "—"}
                tone="amber"
              />
              <ChartCallout label="Window" value={`${data.activityByDay.length}-day`} />
            </div>
            <div className="mt-4">
              <ActivityBarChart data={data.activityByDay} />
            </div>
          </CcBox>
        </div>
      </div>
    </div>
  );
}
