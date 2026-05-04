import { NextResponse } from "next/server";
import { createProposal, getFund } from "@/lib/canton-capital/store";

export async function POST(req: Request) {
  const body = await req.json();
  const fundId = String(body.fundId ?? "").trim();
  const description = String(body.description ?? "").trim();
  const amount = Number(body.amount ?? 0);
  if (!fundId || !description || !Number.isFinite(amount) || amount < 0) {
    return NextResponse.json(
      { error: "Invalid fundId, description, or amount" },
      { status: 400 },
    );
  }
  if (!getFund(fundId)) {
    return NextResponse.json({ error: "Fund not found" }, { status: 404 });
  }
  const proposer = body.proposer
    ? String(body.proposer).trim()
    : undefined;
  const proposal = createProposal({ fundId, description, amount, proposer });
  return NextResponse.json(proposal);
}
