import { NextResponse } from "next/server";
import { executeProposal, getProposal } from "@/lib/canton-capital/store";

export async function POST(req: Request) {
  const body = await req.json();
  const proposalId = String(body.proposalId ?? "").trim();
  if (!proposalId) {
    return NextResponse.json({ error: "proposalId required" }, { status: 400 });
  }
  if (!getProposal(proposalId)) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }
  const updated = executeProposal(proposalId);
  if (!updated) {
    return NextResponse.json(
      { error: "Execute only when yes votes exceed no votes and not already executed" },
      { status: 400 },
    );
  }
  return NextResponse.json(updated);
}
