import { NextResponse } from "next/server";
import { buildAnalytics } from "@/lib/canton-capital/analytics";
import {
  effectiveToken,
  loadLedgerCapitalRows,
  mergeCapitalRows,
} from "@/lib/canton-capital/canton";
import { listFunds, listProposalsForFund } from "@/lib/canton-capital/store";

export async function GET() {
  const token = effectiveToken();
  const localFunds = listFunds();
  const localProposals = listProposalsForFund();

  let ledger = null as Awaited<ReturnType<typeof loadLedgerCapitalRows>>;
  if (token) {
    ledger = await loadLedgerCapitalRows(token);
  }

  const {
    funds,
    proposals,
    ledgerConnected,
  } = mergeCapitalRows(localFunds, localProposals, ledger);

  return NextResponse.json({
    ...buildAnalytics(funds, proposals),
    ledgerConnected,
  });
}
