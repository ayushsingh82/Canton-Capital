"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CcBox } from "@/components/canton-capital/CcBox";
import type { FundRow } from "@/lib/canton-capital/types";

export default function FundsPage() {
  const [funds, setFunds] = useState<FundRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/funds");
      const j = await res.json();
      if (!cancelled) setFunds(j.funds ?? []);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold cc-gradient">Funds</h1>
          <p className="text-sm text-white/45">From GET /api/funds</p>
        </div>
        <Link href="/create-fund" className="cc-btn cc-btn--primary">
          Create fund
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {funds.map((f) => (
          <Link key={f.id} href={`/funds/${f.id}`}>
            <CcBox strong className="h-full transition-colors hover:border-white/30">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/45">
                {f.id}
              </p>
              <p className="mt-2 text-lg font-medium text-white/90">
                {f.manager}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-white/40">Capital</p>
                  <p className="cc-gradient text-lg tabular-nums">
                    ${f.totalCapital.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-white/40">Investors</p>
                  <p className="text-lg tabular-nums text-white/80">
                    {f.investorsCount}
                  </p>
                </div>
              </div>
            </CcBox>
          </Link>
        ))}
      </div>
    </div>
  );
}
