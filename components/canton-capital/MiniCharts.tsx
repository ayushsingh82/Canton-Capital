"use client";

import type { AnalyticsPayload } from "@/lib/canton-capital/types";

export function CapitalOverTimeChart({
  data,
}: {
  data: AnalyticsPayload["capitalOverTime"];
}) {
  const max = Math.max(...data.map((d) => d.v), 1);
  return (
    <div className="flex h-[120px] items-end gap-1">
      {data.map((d, i) => (
        <i
          key={d.t + i}
          className="min-w-[4px] flex-1 rounded-none bg-gradient-to-t from-white/20 to-white/50"
          style={{
            height: `${Math.max(8, (d.v / max) * 100)}%`,
            opacity: 0.35 + (i / data.length) * 0.45,
          }}
          title={`${d.t}: ${d.v.toLocaleString()}`}
        />
      ))}
    </div>
  );
}

export function ActivityBars({
  data,
}: {
  data: AnalyticsPayload["activityByDay"];
}) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex h-28 items-end gap-1">
      {data.map((d) => (
        <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full bg-gradient-to-t from-white/10 to-white/40"
            style={{ height: `${(d.count / max) * 100}%`, minHeight: "4px" }}
          />
          <span className="text-[0.6rem] text-white/35">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

export function OutcomePie({
  data,
}: {
  data: AnalyticsPayload["proposalOutcomes"];
}) {
  const total = data.reduce((a, x) => a + x.value, 0) || 1;
  return (
    <div className="flex flex-col gap-3">
      {data.map((slice) => {
        const pct = (slice.value / total) * 100;
        return (
          <div key={slice.label}>
            <div className="flex justify-between text-xs text-white/50">
              <span>{slice.label}</span>
              <span className="tabular-nums text-white/70">
                {pct.toFixed(0)}%
              </span>
            </div>
            <div className="mt-1 h-2 w-full bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-white/25 to-white/55"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
