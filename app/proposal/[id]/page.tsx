"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CcBox } from "@/components/canton-capital/CcBox";
import type { FundRow, ProposalRow } from "@/lib/canton-capital/types";
import {
  polkaBtnGhost,
  polkaBtnPrimary,
  polkaContainerMd,
  polkaH1,
  polkaLink,
  polkaPage,
} from "@/lib/polka-ui";

type Status = "loading" | "ok" | "missing";

export default function ProposalDetailPage() {
  const params = useParams();
  const id = String(params.id ?? "");
  const [proposal, setProposal] = useState<ProposalRow | null>(null);
  const [fund, setFund] = useState<FundRow | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [note, setNote] = useState<string | null>(null);

  async function reload() {
    const res = await fetch(`/api/proposal/${id}`);
    if (!res.ok) {
      setStatus("missing");
      return;
    }
    const j = await res.json();
    setProposal(j.proposal);
    setFund(j.fund ?? null);
    setStatus("ok");
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function vote(choice: "yes" | "no") {
    setNote(null);
    const res = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposalId: id, choice }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setNote(j.error ?? "Vote failed");
      return;
    }
    setProposal(j);
  }

  async function execute() {
    setNote(null);
    const res = await fetch("/api/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposalId: id }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setNote(j.error ?? "Execute failed");
      return;
    }
    // /api/execute returns { proposal, fund } so we can refresh treasury too.
    if (j.proposal) setProposal(j.proposal);
    if (j.fund) setFund(j.fund);
  }

  if (status === "loading") {
    return (
      <div className={polkaPage}>
        <div className={`${polkaContainerMd} py-12`}>
          <p className="text-sm text-neutral-400">Loading…</p>
        </div>
      </div>
    );
  }

  if (status === "missing" || !proposal) {
    return (
      <div className={polkaPage}>
        <div className={`${polkaContainerMd} py-12`}>
          <p className="text-sm text-neutral-400">Proposal not found.</p>
          <Link href="/funds" className={`${polkaLink} mt-4 inline-block`}>
            ← Funds
          </Link>
        </div>
      </div>
    );
  }

  const passed = proposal.yesVotes > proposal.noVotes;
  const treasury = fund?.treasuryBalance ?? fund?.totalCapital ?? 0;

  return (
    <div className={polkaPage}>
      <div className={polkaContainerMd}>
        <Link
          href={fund ? `/funds/${fund.id}` : "/funds"}
          className={polkaLink}
        >
          ← Back to fund
        </Link>

        <div>
          <h1 className={polkaH1}>Proposal</h1>
          <p className="font-mono text-xs text-neutral-500">{proposal.id}</p>
        </div>

        <CcBox strong>
          <p className="text-sm leading-relaxed text-neutral-200">
            {proposal.description}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-neutral-500">Amount</p>
              <p className="bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-xl tabular-nums text-transparent">
                ${proposal.amount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-neutral-500">Status</p>
              <p
                className={
                  proposal.executed
                    ? "text-emerald-400"
                    : passed
                      ? "text-amber-300"
                      : "text-neutral-100"
                }
              >
                {proposal.executed
                  ? "Executed"
                  : passed
                    ? "Open · ready to execute"
                    : "Open"}
              </p>
            </div>
          </div>
        </CcBox>

        <CcBox>
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
            Votes
          </h2>
          <div className="mt-4 flex gap-8 text-lg tabular-nums">
            <div>
              <span className="text-neutral-500">YES</span>{" "}
              <span className="text-white">{proposal.yesVotes}</span>
            </div>
            <div>
              <span className="text-neutral-500">NO</span>{" "}
              <span className="text-white">{proposal.noVotes}</span>
            </div>
          </div>
          {fund ? (
            <p className="mt-4 text-xs text-neutral-500">
              Fund <span className="font-mono">{fund.id}</span> treasury:{" "}
              <span className="tabular-nums text-neutral-300">
                ${treasury.toLocaleString()}
              </span>
            </p>
          ) : null}
        </CcBox>

        {note ? <p className="text-sm text-amber-400/90">{note}</p> : null}

        {!proposal.executed ? (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className={polkaBtnPrimary}
              onClick={() => vote("yes")}
            >
              Vote YES
            </button>
            <button
              type="button"
              className={polkaBtnGhost}
              onClick={() => vote("no")}
            >
              Vote NO
            </button>
            <button
              type="button"
              className={polkaBtnGhost}
              onClick={() => execute()}
              disabled={!passed}
              title={
                passed
                  ? "Execute the proposal"
                  : "Yes votes must strictly exceed no votes"
              }
            >
              Execute (if passed)
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5 backdrop-blur-xl">
            <p className="text-sm text-emerald-300">
              ✓ Proposal executed. Treasury debited by $
              {proposal.amount.toLocaleString()}.
            </p>
            {fund ? (
              <Link
                href={`/funds/${fund.id}`}
                className={`${polkaLink} mt-3 inline-block`}
              >
                ← Back to fund
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
