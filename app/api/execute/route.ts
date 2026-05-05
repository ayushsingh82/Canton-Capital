import { NextResponse } from "next/server";
import { executeProposal } from "@/lib/canton-capital/store";

const FAILURE_MESSAGES: Record<string, { status: number; error: string }> = {
  "not-found": { status: 404, error: "Proposal or fund not found" },
  "already-executed": { status: 409, error: "Proposal already executed" },
  "not-passed": {
    status: 400,
    error: "Cannot execute: yes votes must strictly exceed no votes",
  },
  "insufficient-treasury": {
    status: 400,
    error: "Cannot execute: treasury balance below proposal amount",
  },
};

export async function POST(req: Request) {
  const body = await req.json();
  const proposalId = String(body.proposalId ?? "").trim();
  if (!proposalId) {
    return NextResponse.json({ error: "proposalId required" }, { status: 400 });
  }
  const result = executeProposal(proposalId);
  if (!result.ok) {
    const mapped = FAILURE_MESSAGES[result.reason];
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
  return NextResponse.json({ proposal: result.proposal, fund: result.fund });
}
