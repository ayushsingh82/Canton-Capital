"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CcBox } from "@/components/canton-capital/CcBox";
import type { FundRow, ProposalRow } from "@/lib/canton-capital/types";
import {
  polkaBtnSm,
  polkaContainerTight,
  polkaH1,
  polkaLink,
  polkaPage,
} from "@/lib/polka-ui";

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
      <div className={polkaPage}>
        <div className={`${polkaContainerTight} py-12`}>
          <p className="text-sm text-neutral-400">Loading…</p>
        </div>
      </div>
    );
  }

  if (status === "missing" || !fund) {
    return (
      <div className={polkaPage}>
        <div className={`${polkaContainerTight} py-12`}>
          <p className="text-sm text-neutral-400">Fund not found.</p>
          <Link href="/funds" className={`${polkaLink} mt-4 inline-block`}>
            ← Funds
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={polkaPage}>
      <div className={`${polkaContainerTight} space-y-8`}>
        <Link href="/funds" className={polkaLink}>
          ← All funds
        </Link>

        <div>
          <h1 className={polkaH1}>{fund.id}</h1>
          <p className="text-sm text-neutral-400">Manager · treasury · proposals</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <CcBox strong>
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
              Fund info
            </h2>
            <p className="mt-3 text-sm text-neutral-500">Manager</p>
            <p className="font-mono text-sm text-neutral-200">{fund.manager}</p>
            <p className="mt-4 text-sm text-neutral-500">Total capital</p>
            <p className="bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-xl tabular-nums text-transparent">
              ${fund.totalCapital.toLocaleString()}
            </p>
          </CcBox>
          <CcBox strong>
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
              Treasury
            </h2>
            <p className="mt-6 text-3xl font-semibold tabular-nums text-white">
              $
              {(fund.treasuryBalance ?? fund.totalCapital).toLocaleString()}
            </p>
            <p className="mt-2 text-xs text-neutral-500">Demo balance from seed / create</p>
          </CcBox>
        </div>

        <CcBox strong>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
              Proposals
            </h2>
            <Link
              href={`/proposal/create?fundId=${encodeURIComponent(fund.id)}`}
              className={polkaBtnSm}
            >
              New proposal
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {proposals.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/[0.06] bg-black/40 px-3 py-2"
              >
                <Link href={`/proposal/${p.id}`} className={polkaLink}>
                  {p.description.slice(0, 72)}
                  {p.description.length > 72 ? "…" : ""}
                </Link>
                <span className="text-xs text-neutral-500">
                  {p.executed ? "Executed" : "Open"} · ${p.amount.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </CcBox>

        <CcBox>
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
            Investors
          </h2>
          <p className="mt-2 text-sm text-neutral-300">
            Count: {fund.investorsCount}
          </p>
          {fund.investors.length > 0 ? (
            <ul className="mt-3 space-y-1 font-mono text-xs text-neutral-400">
              {fund.investors.map((inv) => (
                <li key={inv}>{inv}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-neutral-500">No investors on this demo fund yet.</p>
          )}
        </CcBox>
      </div>
    </div>
  );
}
