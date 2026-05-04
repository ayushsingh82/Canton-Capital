import { randomUUID } from "crypto";
import { SEED_FUNDS, SEED_PROPOSALS } from "./mock-data";
import type { FundRow, ProposalRow } from "./types";

type Store = {
  funds: FundRow[];
  proposals: ProposalRow[];
};

function globalStore(): Store {
  const g = globalThis as unknown as { __cantonCapitalStore?: Store };
  if (!g.__cantonCapitalStore) {
    g.__cantonCapitalStore = {
      funds: SEED_FUNDS.map((f) => ({
        ...f,
        investorsCount: f.investors.length,
      })),
      proposals: [...SEED_PROPOSALS],
    };
  }
  return g.__cantonCapitalStore;
}

export function listFunds(): FundRow[] {
  return globalStore().funds.map((f) => ({
    ...f,
    investorsCount: f.investors.length,
  }));
}

export function getFund(id: string): FundRow | undefined {
  return listFunds().find((f) => f.id === id);
}

export function createFund(input: {
  manager: string;
  initialCapital: number;
}): FundRow {
  const store = globalStore();
  const id = `fund-${randomUUID().slice(0, 8)}`;
  const row: FundRow = {
    id,
    manager: input.manager,
    totalCapital: input.initialCapital,
    investors: [],
    investorsCount: 0,
    treasuryBalance: input.initialCapital,
  };
  store.funds.push(row);
  return row;
}

export function listProposalsForFund(fundId?: string): ProposalRow[] {
  const all = globalStore().proposals;
  return fundId ? all.filter((p) => p.fundId === fundId) : all;
}

export function getProposal(id: string): ProposalRow | undefined {
  return globalStore().proposals.find((p) => p.id === id);
}

export function createProposal(input: {
  fundId: string;
  description: string;
  amount: number;
  proposer?: string;
}): ProposalRow {
  const store = globalStore();
  const id = `prop-${randomUUID().slice(0, 8)}`;
  const row: ProposalRow = {
    id,
    fundId: input.fundId,
    description: input.description,
    amount: input.amount,
    yesVotes: 0,
    noVotes: 0,
    executed: false,
    proposer: input.proposer ?? "Proposer::demo",
  };
  store.proposals.push(row);
  return row;
}

export function vote(input: {
  proposalId: string;
  choice: "yes" | "no";
}): ProposalRow | undefined {
  const store = globalStore();
  const p = store.proposals.find((x) => x.id === input.proposalId);
  if (!p || p.executed) return undefined;
  if (input.choice === "yes") p.yesVotes += 1;
  else p.noVotes += 1;
  return { ...p };
}

export function executeProposal(proposalId: string): ProposalRow | undefined {
  const store = globalStore();
  const p = store.proposals.find((x) => x.id === proposalId);
  if (!p || p.executed) return undefined;
  if (p.yesVotes <= p.noVotes) return undefined;
  p.executed = true;
  return { ...p };
}
