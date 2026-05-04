"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CcBox } from "@/components/canton-capital/CcBox";
import type { FundRow, ProposalRow } from "@/lib/canton-capital/types";

export default function FundDetailPage() {
  const params = useParams();
  const id = String(params.id ?? "");
  const [fund, setFund] = useState<FundRow | null>(null);
  const [proposals, setProposals] = useState<ProposalRow[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "missing">("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setStatus("loading");
      const res = await fetch(`/api/fund/${id}`);
      if (!res.ok) {
        if (!cancelled) {
          setFund(null);
          setStatus("missing");
        }
        return;
      }
      const j = await res.json();
      if (!cancelled) {
        setFund(j.fund);
        setProposals(j.proposals ?? []);
        setStatus("ok");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-sm text-white/50">Loading…</p>
      </div>
    );
  }

  if (status === "missing" || !fund) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-sm text-white/50">Fund not found.</p>
        <Link href="/funds" className="cc-link mt-4 inline-block text-sm">
          ← Funds
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <Link href="/funds" className="cc-link text-sm">
        ← All funds
      </Link>

      <div>
        <h1 className="text-2xl font-semibold cc-gradient">{fund.id}</h1>
        <p className="text-sm text-white/45">Manager · treasury · proposals</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <CcBox strong>
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
            Fund info
          </h2>
          <p className="mt-3 text-sm text-white/40">Manager</p>
          <p className="font-mono text-sm text-white/85">{fund.manager}</p>
          <p className="mt-4 text-sm text-white/40">Total capital</p>
          <p className="cc-gradient text-xl tabular-nums">
            ${fund.totalCapital.toLocaleString()}
          </p>
        </CcBox>
        <CcBox strong>
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
            Treasury
          </h2>
          <p className="mt-6 text-3xl font-semibold tabular-nums text-white/90">
            $
            {(fund.treasuryBalance ?? fund.totalCapital).toLocaleString()}
          </p>
          <p className="mt-2 text-xs text-white/35">Demo balance from seed / create</p>
        </CcBox>
      </div>

      <CcBox strong>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
            Proposals
          </h2>
          <Link href="/proposal/create" className="cc-btn text-xs">
            New proposal
          </Link>
        </div>
        <ul className="mt-4 space-y-3">
          {proposals.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-2 border border-white/10 bg-black/40 px-3 py-2"
            >
              <Link href={`/proposal/${p.id}`} className="cc-link text-sm">
                {p.description.slice(0, 72)}
                {p.description.length > 72 ? "…" : ""}
              </Link>
              <span className="text-xs text-white/40">
                {p.executed ? "Executed" : "Open"} · ${p.amount.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </CcBox>

      <CcBox>
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
          Investors
        </h2>
        <p className="mt-2 text-sm text-white/70">
          Count: {fund.investorsCount}
        </p>
        {fund.investors.length > 0 ? (
          <ul className="mt-3 space-y-1 font-mono text-xs text-white/55">
            {fund.investors.map((inv) => (
              <li key={inv}>{inv}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-white/35">No investors on this demo fund yet.</p>
        )}
      </CcBox>
    </div>
  );
}
