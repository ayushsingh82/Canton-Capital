"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CcBox } from "@/components/canton-capital/CcBox";
import type { FundRow } from "@/lib/canton-capital/types";
import {
  polkaBtnPrimary,
  polkaContainer,
  polkaH1,
  polkaPage,
} from "@/lib/polka-ui";

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
    <div className={polkaPage}>
      <div className={polkaContainer}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className={polkaH1}>Funds</h1>
            <p className="text-sm text-neutral-400">From GET /api/funds</p>
          </div>
          <Link href="/create-fund" className={polkaBtnPrimary}>
            Create fund
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {funds.map((f) => (
            <Link key={f.id} href={`/funds/${f.id}`}>
              <CcBox strong className="h-full transition duration-300 hover:border-white/[0.1] hover:bg-white/[0.05]">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                  {f.id}
                </p>
                <p className="mt-2 text-lg font-medium text-white">
                  {f.manager}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-neutral-500">Capital</p>
                    <p className="bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-lg tabular-nums text-transparent">
                      ${f.totalCapital.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-500">Investors</p>
                    <p className="text-lg tabular-nums text-neutral-300">
                      {f.investorsCount}
                    </p>
                  </div>
                </div>
              </CcBox>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
