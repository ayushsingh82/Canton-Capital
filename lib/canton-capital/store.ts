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

export type ExecuteFailure =
  | "not-found"
  | "already-executed"
  | "not-passed"
  | "insufficient-treasury";

export type ExecuteResult =
  | { ok: true; proposal: ProposalRow; fund: FundRow }
  | { ok: false; reason: ExecuteFailure };

export function executeProposal(proposalId: string): ExecuteResult {
  const store = globalStore();
  const p = store.proposals.find((x) => x.id === proposalId);
  if (!p) return { ok: false, reason: "not-found" };
  if (p.executed) return { ok: false, reason: "already-executed" };
  if (p.yesVotes <= p.noVotes) return { ok: false, reason: "not-passed" };
  const fund = store.funds.find((f) => f.id === p.fundId);
  if (!fund) return { ok: false, reason: "not-found" };
  const treasury = fund.treasuryBalance ?? fund.totalCapital;
  if (treasury < p.amount) return { ok: false, reason: "insufficient-treasury" };
  fund.treasuryBalance = treasury - p.amount;
  p.executed = true;
  return { ok: true, proposal: { ...p }, fund: { ...fund } };
}
