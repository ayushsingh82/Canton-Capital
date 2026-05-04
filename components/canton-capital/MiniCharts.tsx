"use client";

/**
 * Legacy-compatible chart wrappers — same prop interface as before,
 * but now powered by the Recharts components from AnalyticsCharts.
 */

import {
  CapitalAreaChart,
  ActivityBarChart,
  ProposalDonutChart,
} from "./AnalyticsCharts";
import type { AnalyticsPayload } from "@/lib/canton-capital/types";

export function CapitalOverTimeChart({
  data,
}: {
  data: AnalyticsPayload["capitalOverTime"];
}) {
  return <CapitalAreaChart data={data} />;
}

export function ActivityBars({
  data,
}: {
  data: AnalyticsPayload["activityByDay"];
}) {
  return <ActivityBarChart data={data} />;
}

export function OutcomePie({
  data,
}: {
  data: AnalyticsPayload["proposalOutcomes"];
}) {
  return <ProposalDonutChart data={data} />;
}
