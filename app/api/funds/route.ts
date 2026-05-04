import { NextResponse } from "next/server";
import { createFund, listFunds } from "@/lib/canton-capital/store";

export async function GET() {
  return NextResponse.json({ funds: listFunds() });
}

export async function POST(req: Request) {
  const body = await req.json();
  const manager = String(body.manager ?? "").trim();
  const initialCapital = Number(body.initialCapital ?? body.capital ?? 0);
  if (!manager || !Number.isFinite(initialCapital) || initialCapital < 0) {
    return NextResponse.json(
      { error: "Invalid manager or initialCapital" },
      { status: 400 },
    );
  }
  const fund = createFund({ manager, initialCapital });
  return NextResponse.json(fund);
}
