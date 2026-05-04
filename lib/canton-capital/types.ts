export type FundRow = {
  id: string;
  manager: string;
  totalCapital: number;
  investors: string[];
  investorsCount: number;
  treasuryBalance?: number;
};

export type ProposalRow = {
  id: string;
  fundId: string;
  description: string;
  amount: number;
  yesVotes: number;
  noVotes: number;
  executed: boolean;
  proposer?: string;
};

export type AnalyticsPayload = {
  totalFunds: number;
  totalCapital: number;
  proposals: number;
  activeProposals: number;
  successRate: number;
  participationRate: number;
  capitalOverTime: { t: string; v: number }[];
  proposalOutcomes: { label: string; value: number }[];
  activityByDay: { day: string; count: number }[];
  bestVoters: { party: string; accurateVotes: number }[];
  fundActivity: { fundId: string; label: string; score: number }[];
};
