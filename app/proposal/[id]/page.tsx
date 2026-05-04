"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CcBox } from "@/components/canton-capital/CcBox";
import type { FundRow, ProposalRow } from "@/lib/canton-capital/types";

export default function ProposalDetailPage() {
  const params = useParams();
  const id = String(params.id ?? "");
  const [proposal, setProposal] = useState<ProposalRow | null>(null);
  const [fund, setFund] = useState<FundRow | null>(null);
  const [note, setNote] = useState<string | null>(null);

  async function reload() {
    const res = await fetch(`/api/proposal/${id}`);
    if (!res.ok) return;
    const j = await res.json();
    setProposal(j.proposal);
    setFund(j.fund ?? null);
  }

  useEffect(() => {
    reload();
  }, [id]);

  async function vote(choice: "yes" | "no") {
    setNote(null);
    const res = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposalId: id, choice }),
    });
    const j = await res.json();
    if (!res.ok) setNote(j.error ?? "Vote failed");
    else setProposal(j);
  }

  async function execute() {
    setNote(null);
    const res = await fetch("/api/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposalId: id }),
    });
    const j = await res.json();
    if (!res.ok) setNote(j.error ?? "Execute failed");
    else setProposal(j);
  }

  if (!proposal) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm text-white/50">Loading…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <Link href={fund ? `/funds/${fund.id}` : "/funds"} className="cc-link text-sm">
        ← Back to fund
      </Link>

      <div>
        <h1 className="text-2xl font-semibold cc-gradient">Proposal</h1>
        <p className="font-mono text-xs text-white/40">{proposal.id}</p>
      </div>

      <CcBox strong>
        <p className="text-sm leading-relaxed text-white/80">
          {proposal.description}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-white/40">Amount</p>
            <p className="cc-gradient text-xl tabular-nums">
              ${proposal.amount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-white/40">Status</p>
            <p className="text-white/85">
              {proposal.executed ? "Executed" : "Open"}
            </p>
          </div>
        </div>
      </CcBox>

      <CcBox>
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
          Votes
        </h2>
        <div className="mt-4 flex gap-8 text-lg tabular-nums">
          <div>
            <span className="text-white/40">YES</span>{" "}
            <span className="text-white/90">{proposal.yesVotes}</span>
          </div>
          <div>
            <span className="text-white/40">NO</span>{" "}
            <span className="text-white/90">{proposal.noVotes}</span>
          </div>
        </div>
      </CcBox>

      {note ? <p className="text-sm text-amber-400/90">{note}</p> : null}

      {!proposal.executed ? (
        <div className="flex flex-wrap gap-3">
          <button type="button" className="cc-btn cc-btn--primary" onClick={() => vote("yes")}>
            Vote YES
          </button>
          <button type="button" className="cc-btn" onClick={() => vote("no")}>
            Vote NO
          </button>
          <button type="button" className="cc-btn" onClick={() => execute()}>
            Execute (if passed)
          </button>
        </div>
      ) : null}
    </div>
  );
}
