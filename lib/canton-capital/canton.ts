/**
 * Canton JSON API — same **v1** surface as Slinky (`polkabasket` sibling: see `slinky/src/lib/canton.ts`).
 * Uses POST `/v1/query` with `templateIds`, not `/v2/state/...` (sandbox JSON API may not expose v2).
 *
 * @see https://docs.daml.com/json-api/index.html
 */

import {
  APPLICATION_ID,
  LEDGER_ID,
  templateId as damlTemplateId,
} from "./config";
import type {
  ContractResult,
  LedgerFundPayload,
  LedgerProposalPayload,
} from "./ledger-map";
import {
  contractToFundRow,
  contractToProposalRow,
  mergeById,
} from "./ledger-map";
import type { FundRow, ProposalRow } from "./types";

const CANTON_URL =
  process.env.CANTON_URL ?? process.env.NEXT_PUBLIC_CANTON_JSON_API_URL ?? "";

function base64url(str: string): string {
  return Buffer.from(str, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** Sandbox-style admin JWT (unsigned) — same claims shape as Slinky / CantonPay. */
export function adminToken(): string {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      "https://daml.com/ledger-api": {
        ledgerId: LEDGER_ID,
        applicationId: APPLICATION_ID,
        admin: true,
      },
      exp: Math.floor(Date.now() / 1000) + 86400,
      sub: "admin",
    }),
  );
  return `${header}.${payload}.unsigned`;
}

async function apiCall<T>(
  endpoint: string,
  body: unknown,
  token: string,
): Promise<T> {
  const res = await fetch(`${CANTON_URL.replace(/\/$/, "")}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Canton API ${endpoint} (${res.status}): ${errText}`);
  }
  return res.json() as Promise<T>;
}

export async function queryContracts<T>(
  templateShortName: string,
  token: string,
): Promise<ContractResult<T>[]> {
  if (!CANTON_URL) return [];
  const data = await apiCall<{ result?: ContractResult<T>[] }>(
    "/v1/query",
    { templateIds: [damlTemplateId(templateShortName)] },
    token,
  );
  return data.result ?? [];
}

/**
 * Load Fund + Proposal rows from the ledger (Slinky-style v1 query).
 * Returns `null` if the API is unreachable or misconfigured.
 */
export async function loadLedgerCapitalRows(
  token: string,
): Promise<{ funds: FundRow[]; proposals: ProposalRow[] } | null> {
  if (!CANTON_URL) return null;
  try {
    const fundContracts = await queryContracts<LedgerFundPayload>("Fund", token);
    const funds = fundContracts.map(contractToFundRow);
    const proposalContracts =
      await queryContracts<LedgerProposalPayload>("Proposal", token);
    const proposals = proposalContracts.map((c) =>
      contractToProposalRow(c, funds),
    );
    return { funds, proposals };
  } catch {
    return null;
  }
}

export function effectiveToken(): string | undefined {
  const explicit =
    process.env.CANTON_TOKEN ?? process.env.JSON_API_TOKEN ?? "";
  if (explicit) return explicit;
  if (CANTON_URL) return adminToken();
  return undefined;
}

export function mergeCapitalRows(
  localFunds: FundRow[],
  localProposals: ProposalRow[],
  ledger: { funds: FundRow[]; proposals: ProposalRow[] } | null,
): { funds: FundRow[]; proposals: ProposalRow[]; ledgerConnected: boolean } {
  if (!ledger) {
    return {
      funds: localFunds,
      proposals: localProposals,
      ledgerConnected: false,
    };
  }
  return {
    funds: mergeById(localFunds, ledger.funds),
    proposals: mergeById(localProposals, ledger.proposals),
    ledgerConnected: true,
  };
}
