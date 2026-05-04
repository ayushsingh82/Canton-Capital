"use client";

import { CcBox } from "./CcBox";
import { TrendSparkline } from "./AnalyticsCharts";

export function StatsCard({
  title,
  value,
  hint,
  trend,
  trendColor,
}: {
  title: string;
  value: string;
  hint?: string;
  trend?: number[];
  trendColor?: string;
}) {
  return (
    <CcBox>
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-neutral-500">
        {title}
      </p>
      <p className="mt-2 bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-2xl font-semibold tabular-nums text-transparent">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-xs text-neutral-500">{hint}</p>
      ) : null}
      {trend && trend.length > 0 ? (
        <div className="mt-2">
          <TrendSparkline data={trend} color={trendColor} height={32} />
        </div>
      ) : null}
    </CcBox>
  );
}
