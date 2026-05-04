import type { FundRow, ProposalRow } from "./types";

export const SEED_FUNDS: FundRow[] = [
  {
    id: "fund-demo-1",
    manager: "Manager::alpha",
    totalCapital: 1_250_000,
    investors: ["Investor::a", "Investor::b", "Investor::c"],
    investorsCount: 3,
    treasuryBalance: 980_000,
  },
  {
    id: "fund-demo-2",
    manager: "Manager::beta",
    totalCapital: 640_000,
    investors: ["Investor::d", "Investor::e"],
    investorsCount: 2,
    treasuryBalance: 610_000,
  },
];

export const SEED_PROPOSALS: ProposalRow[] = [
  {
    id: "prop-demo-1",
    fundId: "fund-demo-1",
    description: "Allocate 120k to structured notes sleeve",
    amount: 120_000,
    yesVotes: 14,
    noVotes: 3,
    executed: false,
    proposer: "Allocator::p1",
  },
  {
    id: "prop-demo-2",
    fundId: "fund-demo-1",
    description: "Rebalance public equities band ±4%",
    amount: 45_000,
    yesVotes: 22,
    noVotes: 1,
    executed: true,
    proposer: "Allocator::p2",
  },
  {
    id: "prop-demo-3",
    fundId: "fund-demo-2",
    description: "Treasury buffer top-up",
    amount: 25_000,
    yesVotes: 5,
    noVotes: 7,
    executed: false,
    proposer: "Allocator::p3",
  },
];
