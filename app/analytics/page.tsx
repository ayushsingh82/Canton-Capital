"use client";

import { useEffect, useState } from "react";
import { CcBox } from "@/components/canton-capital/CcBox";
import type { AnalyticsPayload } from "@/lib/canton-capital/types";
import { polkaContainer, polkaH1, polkaPage } from "@/lib/polka-ui";
import {
  VoteDistributionChart,
  FundRadarChart,
  ParticipationGauge,
  ExecutionTimelineChart
} from "@/components/canton-capital/AnalyticsCharts";

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
          <h1 className={polkaH1}>Advanced Analytics</h1>
          <p className="text-sm text-neutral-400 mt-2">
            Derived metrics for deeper insights — powered by the Canton JSON API.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <CcBox strong className="cc-chart-stagger-1 cc-chart-card">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500 text-center">
              Global Participation
            </h2>
            <div className="mt-2">
              <ParticipationGauge value={data.participationRate} label="Active Voters" />
            </div>
            <p className="mt-4 text-xs text-neutral-500 text-center">
              Overall network governance activation.
            </p>
          </CcBox>
          <CcBox strong className="cc-chart-stagger-2 cc-chart-card">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
              Proposal Efficiency
            </h2>
            <p className="mt-8 text-5xl font-semibold tabular-nums text-white pb-2 bg-gradient-to-br from-emerald-300 to-emerald-600 bg-clip-text text-transparent">
              {(data.successRate * 100).toFixed(0)}%
            </p>
            <p className="mt-4 text-xs text-neutral-500">
              Share of proposals where YES leads NO (demo heuristic).
            </p>
            <div className="mt-6 flex justify-between text-xs">
              <span className="text-emerald-400">Passed: {data.proposalOutcomes[0]?.value}</span>
              <span className="text-rose-400">Rejected/Tie: {data.proposalOutcomes[1]?.value}</span>
            </div>
          </CcBox>
          <CcBox strong className="cc-chart-stagger-3 cc-chart-card">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
              Ledger State
            </h2>
            <p className="mt-6 text-lg text-emerald-300 font-medium">
              {data.ledgerConnected ? "Connected (live data merged)" : "Demo Simulation Running"}
            </p>
            <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400/50 w-full animate-pulse" />
            </div>
            <p className="mt-6 text-xs text-neutral-500">
              Capital utilization: {data.totalCapital > 0
                ? `${Math.min(99, Math.round((data.activeProposals / Math.max(1, data.proposals)) * 100))}%`
                : "—"}
            </p>
          </CcBox>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <CcBox strong className="cc-chart-stagger-4 cc-chart-card">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500 mb-6">
              Vote Distribution (Recent Proposals)
            </h2>
            <VoteDistributionChart data={data.voteBreakdown} />
          </CcBox>
          
          <CcBox strong className="cc-chart-stagger-5 cc-chart-card">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500 mb-4">
              Fund Performance Multi-Axis
            </h2>
            <FundRadarChart data={data.fundScores} />
          </CcBox>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <CcBox strong className="md:col-span-2 cc-chart-card">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500 mb-6">
              Execution Timeline Status
            </h2>
            <ExecutionTimelineChart data={data.executionTimeline} />
          </CcBox>

          <CcBox strong className="md:col-span-1 cc-chart-card">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
              Best Voters Ranking
            </h2>
            <ul className="mt-6 space-y-3">
              {data.bestVoters.map((v, i) => (
                <li
                  key={v.party}
                  className="flex justify-between items-center rounded-xl border border-white/[0.04] bg-black/30 px-3 py-2.5 text-sm hover:bg-black/50 transition-colors"
                >
                  <span className="text-neutral-300 flex items-center gap-2">
                    <span className="w-5 h-5 flex items-center justify-center bg-white/5 rounded text-xs text-neutral-500">{i + 1}</span>
                    {v.party.split('::')[0]}
                  </span>
                  <span className="tabular-nums font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">{v.accurateVotes}</span>
                </li>
              ))}
            </ul>
          </CcBox>
        </div>
      </div>
    </div>
  );
}
