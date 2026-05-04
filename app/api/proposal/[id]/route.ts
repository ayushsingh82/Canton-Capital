import { NextResponse } from "next/server";
import { getFund, getProposal } from "@/lib/canton-capital/store";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const proposal = getProposal(id);
  if (!proposal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const fund = getFund(proposal.fundId);
  return NextResponse.json({ proposal, fund });
}
