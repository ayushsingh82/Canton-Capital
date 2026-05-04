import type { FundRow, ProposalRow } from "./types";

/** JSON API payload shapes for `CantonCapital` templates (Decimal → string in JSON). */
export type LedgerFundPayload = {
  manager: string;
  investors: string[];
  totalCapital: string | number;
};

export type LedgerProposalPayload = {
  fundManager: string;
  proposer: string;
  description: string;
  amount: string | number;
  yesVotes: number;
  noVotes: number;
  executed: boolean;
};

export type ContractResult<T> = {
  contractId: string;
  templateId: string;
  payload: T;
};

function num(v: string | number | undefined): number {
  if (v === undefined) return 0;
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isFinite(n) ? n : 0;
}

export function contractToFundRow(c: ContractResult<LedgerFundPayload>): FundRow {
  const p = c.payload;
  const tc = num(p.totalCapital);
  const inv = p.investors ?? [];
  return {
    id: c.contractId,
    manager: p.manager,
    totalCapital: tc,
    investors: inv,
    investorsCount: inv.length,
    treasuryBalance: tc,
  };
}

export function contractToProposalRow(
  c: ContractResult<LedgerProposalPayload>,
  funds: FundRow[],
): ProposalRow {
  const p = c.payload;
  const fund = funds.find((f) => f.manager === p.fundManager);
  return {
    id: c.contractId,
    fundId: fund?.id ?? `mgr:${p.fundManager.slice(0, 32)}`,
    description: p.description,
    amount: num(p.amount),
    yesVotes: p.yesVotes ?? 0,
    noVotes: p.noVotes ?? 0,
    executed: Boolean(p.executed),
    proposer: p.proposer,
  };
}

export function mergeById<T extends { id: string }>(local: T[], remote: T[]): T[] {
  const m = new Map<string, T>();
  for (const x of local) m.set(x.id, x);
  for (const x of remote) m.set(x.id, x);
  return [...m.values()];
}
