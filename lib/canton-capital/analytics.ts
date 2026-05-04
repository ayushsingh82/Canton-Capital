import type { FundRow, ProposalRow, AnalyticsPayload } from "./types";

const CHART_COLORS = [
  "#34d399", // emerald-400
  "#60a5fa", // blue-400
  "#a78bfa", // violet-400
  "#fbbf24", // amber-400
  "#f472b6", // pink-400
  "#2dd4bf", // teal-400
  "#fb923c", // orange-400
  "#818cf8", // indigo-400
];

export function buildAnalytics(
  funds: FundRow[],
  proposals: ProposalRow[],
): AnalyticsPayload {
  const totalCapital = funds.reduce((a, f) => a + f.totalCapital, 0);
  const activeProposals = proposals.filter((p) => !p.executed).length;

  const passed = proposals.filter((p) => p.yesVotes > p.noVotes);
  const successRate =
    proposals.length > 0 ? passed.length / proposals.length : 0;

  let totalVotes = 0;
  for (const p of proposals) {
    totalVotes += p.yesVotes + p.noVotes;
  }
  const participationRate =
    proposals.length > 0
      ? Math.min(1, totalVotes / (proposals.length * 12))
      : 0;

  // Capital over time — simulate quarterly growth
  const capitalOverTime = Array.from({ length: 8 }, (_, i) => ({
    t: `Q${(i % 4) + 1} '${24 + Math.floor(i / 4)}`,
    v: Math.round(
      totalCapital * (0.45 + i * 0.08) * (0.92 + Math.random() * 0.16),
    ),
  }));

  const yesWin = proposals.filter((p) => p.yesVotes > p.noVotes).length;
  const noWin = proposals.length - yesWin;
  const proposalOutcomes = [
    { label: "Majority YES", value: Math.max(1, yesWin) },
    { label: "Majority NO / tie", value: Math.max(0, noWin) },
  ];

  const activityByDay = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
    (day, i) => ({
      day,
      count: 2 + ((i + proposals.length) % 5) + Math.floor(Math.random() * 3),
    }),
  );

  const bestVoters = [
    { party: "Allocator::p2", accurateVotes: 22 },
    { party: "Allocator::p1", accurateVotes: 14 },
    { party: "Allocator::p3", accurateVotes: 5 },
  ];

  const fundActivity = funds.map((f) => ({
    fundId: f.id,
    label: f.id.replace("fund-", "Fund "),
    score: Math.round(
      (proposals.filter((p) => p.fundId === f.id).length / 3) * 100,
    ),
  }));

  // ── Enhanced chart data ──

  // Capital distribution — per-fund pie
  const capitalDistribution = funds.map((f, i) => ({
    name: f.id.replace("fund-", "Fund "),
    value: f.totalCapital,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));

  // Vote breakdown — per-proposal stacked bars
  const voteBreakdown = proposals.map((p) => ({
    name: p.description.length > 28 ? p.description.slice(0, 28) + "…" : p.description,
    yes: p.yesVotes,
    no: p.noVotes,
    total: p.yesVotes + p.noVotes,
  }));

  // Sparkline-ready trend data (simulate 12-point series)
  const trendData = {
    funds: Array.from(
      { length: 12 },
      (_, i) => Math.max(1, funds.length - 2 + Math.floor(i / 4)),
    ),
    capital: Array.from({ length: 12 }, (_, i) =>
      Math.round(totalCapital * (0.5 + (i / 12) * 0.5) * (0.9 + Math.random() * 0.2)),
    ),
    proposals: Array.from(
      { length: 12 },
      (_, i) =>
        Math.max(1, proposals.length - 3 + Math.floor(i / 3) + Math.floor(Math.random() * 2)),
    ),
    participation: Array.from({ length: 12 }, (_, i) =>
      Math.round(participationRate * 100 * (0.6 + (i / 12) * 0.4) + Math.random() * 10),
    ),
  };

  // Multi-axis fund scores for radar
  const fundScores = funds.map((f) => {
    const fundProposals = proposals.filter((p) => p.fundId === f.id);
    const fundVotes = fundProposals.reduce(
      (a, p) => a + p.yesVotes + p.noVotes,
      0,
    );
    return {
      fund: f.id.replace("fund-", "Fund "),
      capital: Math.min(100, Math.round((f.totalCapital / Math.max(1, totalCapital)) * 100)),
      proposals: Math.min(100, fundProposals.length * 33),
      investors: Math.min(100, f.investorsCount * 25),
      activity: Math.min(100, Math.round(fundVotes * 5)),
      governance: Math.min(
        100,
        Math.round(
          (fundProposals.filter((p) => p.executed).length /
            Math.max(1, fundProposals.length)) *
            100,
        ),
      ),
    };
  });

  // Monthly capital flow
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const monthlyCapitalFlow = months.map((month, i) => {
    const inflow = Math.round(totalCapital * 0.08 * (0.7 + Math.random() * 0.6));
    const outflow = Math.round(
      totalCapital * 0.04 * (0.5 + Math.random() * 0.5) + proposals.filter(p => p.executed).reduce((a, p) => a + p.amount, 0) * 0.02 * (i + 1),
    );
    return { month, inflow, outflow, net: inflow - outflow };
  });

  // Execution timeline
  const executionTimeline = funds.map((f) => {
    const fp = proposals.filter((p) => p.fundId === f.id);
    return {
      label: f.id.replace("fund-", "Fund "),
      executed: fp.filter((p) => p.executed).length,
      pending: fp.filter((p) => !p.executed).length,
    };
  });

  return {
    totalFunds: funds.length,
    totalCapital,
    proposals: proposals.length,
    activeProposals,
    successRate,
    participationRate,
    capitalOverTime,
    proposalOutcomes,
    activityByDay,
    bestVoters,
    fundActivity,
    capitalDistribution,
    voteBreakdown,
    trendData,
    fundScores,
    monthlyCapitalFlow,
    executionTimeline,
  };
}
