"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBarChart,
  RadialBar,
  Legend,
  LineChart,
  Line,
  ComposedChart,
} from "recharts";
import type { AnalyticsPayload } from "@/lib/canton-capital/types";

/* ── Color palette ── */
const EMERALD = "#34d399";
const BLUE = "#60a5fa";
const VIOLET = "#a78bfa";
const AMBER = "#fbbf24";
const ROSE = "#fb7185";
const TEAL = "#2dd4bf";
const COLORS = [EMERALD, BLUE, VIOLET, AMBER, ROSE, TEAL];

/* ── Custom tooltip ── */
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="cc-tooltip">
      {label && (
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
          {label}
        </p>
      )}
      {payload.map((entry, i) => (
        <p key={i} style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, margin: "3px 0", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: entry.color }} />
          <span style={{ color: "rgba(255,255,255,0.5)" }}>{entry.name}</span>
          <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums", marginLeft: "auto" }}>
            {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
          </span>
        </p>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   1. Capital Area Chart (gradient fill)
   ═══════════════════════════════════════════ */
export function CapitalAreaChart({
  data,
}: {
  data: AnalyticsPayload["capitalOverTime"];
}) {
  return (
    <div className="cc-chart-container cc-chart-responsive">
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="capitalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={EMERALD} stopOpacity={0.35} />
              <stop offset="95%" stopColor={EMERALD} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="t"
            tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            width={52}
          />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="v"
            name="Capital"
            stroke={EMERALD}
            strokeWidth={2}
            fill="url(#capitalGrad)"
            animationDuration={1200}
            animationEasing="ease-out"
            dot={false}
            activeDot={{ r: 5, fill: EMERALD, stroke: "#0a0a0a", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ═══════════════════════════════════════════
   2. Proposal Donut Chart
   ═══════════════════════════════════════════ */
export function ProposalDonutChart({
  data,
}: {
  data: AnalyticsPayload["proposalOutcomes"];
}) {
  const total = data.reduce((a, x) => a + x.value, 0);
  const donutColors = [EMERALD, ROSE];

  return (
    <div className="cc-chart-container" style={{ position: "relative" }}>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            animationDuration={1000}
            animationEasing="ease-out"
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={donutColors[i % donutColors.length]} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {/* Center label */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <p style={{ fontSize: 28, fontWeight: 700, color: "#fff", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
          {total}
        </p>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>
          Total
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   3. Activity Bar Chart
   ═══════════════════════════════════════════ */
export function ActivityBarChart({
  data,
}: {
  data: AnalyticsPayload["activityByDay"];
}) {
  return (
    <div className="cc-chart-container cc-chart-responsive">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={BLUE} stopOpacity={0.8} />
              <stop offset="100%" stopColor={BLUE} stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<ChartTooltip />} />
          <Bar
            dataKey="count"
            name="Events"
            fill="url(#barGrad)"
            radius={[6, 6, 0, 0]}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ═══════════════════════════════════════════
   4. Vote Distribution — Stacked Bar
   ═══════════════════════════════════════════ */
export function VoteDistributionChart({
  data,
}: {
  data: AnalyticsPayload["voteBreakdown"];
}) {
  return (
    <div className="cc-chart-container cc-chart-responsive">
      <ResponsiveContainer width="100%" height={Math.max(180, data.length * 52)}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={140}
          />
          <Tooltip content={<ChartTooltip />} />
          <Bar
            dataKey="yes"
            name="YES"
            stackId="votes"
            fill={EMERALD}
            radius={[0, 0, 0, 0]}
            animationDuration={800}
          />
          <Bar
            dataKey="no"
            name="NO"
            stackId="votes"
            fill={ROSE}
            radius={[0, 6, 6, 0]}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ═══════════════════════════════════════════
   5. Fund Radar Chart
   ═══════════════════════════════════════════ */
export function FundRadarChart({
  data,
}: {
  data: AnalyticsPayload["fundScores"];
}) {
  if (!data.length) return <p className="text-xs text-neutral-500">No fund data</p>;

  return (
    <div className="cc-chart-container">
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={[
          { axis: "Capital", ...Object.fromEntries(data.map(d => [d.fund, d.capital])) },
          { axis: "Proposals", ...Object.fromEntries(data.map(d => [d.fund, d.proposals])) },
          { axis: "Investors", ...Object.fromEntries(data.map(d => [d.fund, d.investors])) },
          { axis: "Activity", ...Object.fromEntries(data.map(d => [d.fund, d.activity])) },
          { axis: "Governance", ...Object.fromEntries(data.map(d => [d.fund, d.governance])) },
        ]}>
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          {data.map((d, i) => (
            <Radar
              key={d.fund}
              name={d.fund}
              dataKey={d.fund}
              stroke={COLORS[i % COLORS.length]}
              fill={COLORS[i % COLORS.length]}
              fillOpacity={0.15}
              strokeWidth={2}
              animationDuration={1000}
            />
          ))}
          <Legend
            wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}
          />
          <Tooltip content={<ChartTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ═══════════════════════════════════════════
   6. Sparkline (tiny inline chart)
   ═══════════════════════════════════════════ */
export function TrendSparkline({
  data,
  color = EMERALD,
  height = 36,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  const points = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={points} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
        <defs>
          <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          animationDuration={600}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ═══════════════════════════════════════════
   7. Participation Gauge (radial bar)
   ═══════════════════════════════════════════ */
export function ParticipationGauge({
  value,
  label = "Participation",
}: {
  value: number;
  label?: string;
}) {
  const pct = Math.round(value * 100);
  const gaugeData = [{ name: label, value: pct, fill: EMERALD }];

  return (
    <div className="cc-chart-container" style={{ position: "relative" }}>
      <ResponsiveContainer width="100%" height={200}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="85%"
          startAngle={210}
          endAngle={-30}
          barSize={14}
          data={gaugeData}
        >
          <RadialBar
            dataKey="value"
            cornerRadius={12}
            background={{ fill: "rgba(255,255,255,0.04)" }}
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        pointerEvents: "none",
      }}>
        <p style={{ fontSize: 30, fontWeight: 700, color: "#fff", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
          {pct}%
        </p>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>
          {label}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   8. Capital Distribution Pie
   ═══════════════════════════════════════════ */
export function CapitalDistributionChart({
  data,
}: {
  data: AnalyticsPayload["capitalDistribution"];
}) {
  return (
    <div className="cc-chart-container">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            animationDuration={1000}
            stroke="rgba(10,10,10,0.8)"
            strokeWidth={2}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color || COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ═══════════════════════════════════════════
   9. Monthly Capital Flow (composed)
   ═══════════════════════════════════════════ */
export function CapitalFlowChart({
  data,
}: {
  data: AnalyticsPayload["monthlyCapitalFlow"];
}) {
  return (
    <div className="cc-chart-container cc-chart-responsive">
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={EMERALD} stopOpacity={0.3} />
              <stop offset="100%" stopColor={EMERALD} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ROSE} stopOpacity={0.3} />
              <stop offset="100%" stopColor={ROSE} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="month"
            tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            width={52}
          />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="inflow"
            name="Inflow"
            stroke={EMERALD}
            strokeWidth={2}
            fill="url(#inflowGrad)"
            animationDuration={1000}
          />
          <Area
            type="monotone"
            dataKey="outflow"
            name="Outflow"
            stroke={ROSE}
            strokeWidth={2}
            fill="url(#outflowGrad)"
            animationDuration={1000}
          />
          <Line
            type="monotone"
            dataKey="net"
            name="Net"
            stroke={AMBER}
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            animationDuration={1200}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ═══════════════════════════════════════════
   10. Execution Timeline (stacked bar)
   ═══════════════════════════════════════════ */
export function ExecutionTimelineChart({
  data,
}: {
  data: AnalyticsPayload["executionTimeline"];
}) {
  return (
    <div className="cc-chart-container">
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="executed" name="Executed" stackId="exec" fill={EMERALD} radius={[0, 0, 0, 0]} animationDuration={800} />
          <Bar dataKey="pending" name="Pending" stackId="exec" fill={AMBER} radius={[6, 6, 0, 0]} animationDuration={800} />
          <Legend wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
