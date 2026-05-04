import { NextResponse } from "next/server";
import { buildAnalytics } from "@/lib/canton-capital/analytics";
import { listFunds, listProposalsForFund } from "@/lib/canton-capital/store";
import { contractsArray, fetchContracts } from "@/lib/canton-capital/canton";

export async function GET() {
  const token =
    process.env.CANTON_TOKEN ?? process.env.JSON_API_TOKEN ?? undefined;
  const remote = await fetchContracts(token);
  const contracts = contractsArray(remote);
  const fundContracts = contracts.filter((c) =>
    c.templateId.includes("Fund"),
  );
  const proposalContracts = contracts.filter((c) =>
    c.templateId.includes("Proposal"),
  );

  const localFunds = listFunds();
  const localProposals = listProposalsForFund();

  if (fundContracts.length > 0 || proposalContracts.length > 0) {
    // Surface live counts when ledger returns templates; full merge is out of scope for the demo.
    const totalCapitalFromLedger = fundContracts.reduce((acc, c) => {
      const v = c.payload?.totalCapital;
      return acc + (typeof v === "string" || typeof v === "number" ? Number(v) : 0);
    }, 0);
    const base = buildAnalytics(localFunds, localProposals);
    return NextResponse.json({
      ...base,
      totalFunds: Math.max(base.totalFunds, fundContracts.length),
      totalCapital: totalCapitalFromLedger || base.totalCapital,
      proposals: Math.max(base.proposals, proposalContracts.length),
      ledgerConnected: true,
    });
  }

  return NextResponse.json({
    ...buildAnalytics(localFunds, localProposals),
    ledgerConnected: false,
  });
}
