import { NextResponse } from "next/server";
import { getFund, listProposalsForFund } from "@/lib/canton-capital/store";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const fund = getFund(id);
  if (!fund) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const proposals = listProposalsForFund(id);
  return NextResponse.json({ fund, proposals });
}
