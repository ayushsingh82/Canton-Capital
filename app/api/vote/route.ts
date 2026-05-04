import { NextResponse } from "next/server";
import { getProposal, vote } from "@/lib/canton-capital/store";

export async function POST(req: Request) {
  const body = await req.json();
  const proposalId = String(body.proposalId ?? "").trim();
  const choice = body.choice === "no" ? "no" : "yes";
  if (!proposalId) {
    return NextResponse.json({ error: "proposalId required" }, { status: 400 });
  }
  if (!getProposal(proposalId)) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }
  const updated = vote({ proposalId, choice });
  if (!updated) {
    return NextResponse.json(
      { error: "Cannot vote (executed or invalid)" },
      { status: 400 },
    );
  }
  return NextResponse.json(updated);
}
