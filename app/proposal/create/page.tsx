"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CcBox } from "@/components/canton-capital/CcBox";
import type { FundRow } from "@/lib/canton-capital/types";
import {
  polkaBtnPrimary,
  polkaContainerSm,
  polkaH1,
  polkaInput,
  polkaLabel,
  polkaPage,
} from "@/lib/polka-ui";

function CreateProposalForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetFundId = searchParams.get("fundId") ?? "";
  const [funds, setFunds] = useState<FundRow[]>([]);
  const [fundId, setFundId] = useState(presetFundId);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("50000");
  const [msg, setMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/funds");
      const j = await res.json();
      const list: FundRow[] = j.funds ?? [];
      setFunds(list);
      // Honor ?fundId= if it points at a real fund; otherwise fall back to first.
      const exists = presetFundId && list.some((f) => f.id === presetFundId);
      if (exists) {
        setFundId(presetFundId);
      } else if (!fundId && list[0]) {
        setFundId(list[0].id);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetFundId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/proposal/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fundId,
          description,
          amount: Number(amount),
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setMsg(j.error ?? "Invalid input or fund missing");
        return;
      }
      const prop = await res.json();
      router.push(`/proposal/${prop.id}`);
    } finally {
      setSubmitting(false);
    }
  }

  const selectedFund = funds.find((f) => f.id === fundId);

  return (
    <div className={polkaPage}>
      <div className={polkaContainerSm}>
        <h1 className={polkaH1}>Create proposal</h1>
        <p className="mt-1 text-sm text-neutral-400">POST /api/proposal/create</p>

        <CcBox strong className="mt-8">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className={polkaLabel} htmlFor="fundId">
                Fund
              </label>
              <select
                id="fundId"
                className={polkaInput}
                value={fundId}
                onChange={(e) => setFundId(e.target.value)}
              >
                {funds.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.id} — ${f.totalCapital.toLocaleString()}
                  </option>
                ))}
              </select>
              {selectedFund ? (
                <p className="mt-2 text-xs text-neutral-500">
                  Manager: <span className="font-mono">{selectedFund.manager}</span>
                  {" · "}Treasury:{" "}
                  ${(selectedFund.treasuryBalance ?? selectedFund.totalCapital).toLocaleString()}
                </p>
              ) : null}
            </div>
            <div>
              <label className={polkaLabel} htmlFor="desc">
                Description
              </label>
              <textarea
                id="desc"
                className={`${polkaInput} min-h-[100px]`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={polkaLabel} htmlFor="amount">
                Amount (USD)
              </label>
              <input
                id="amount"
                type="number"
                min={0}
                className={polkaInput}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            {msg ? <p className="text-sm text-red-400/90">{msg}</p> : null}
            <button
              type="submit"
              disabled={submitting || !fundId}
              className={`${polkaBtnPrimary} w-full disabled:opacity-50`}
            >
              {submitting ? "Submitting…" : "Submit proposal"}
            </button>
          </form>
        </CcBox>
      </div>
    </div>
  );
}

export default function CreateProposalPage() {
  return (
    <Suspense
      fallback={
        <div className={polkaPage}>
          <div className={polkaContainerSm}>
            <p className="text-sm text-neutral-400">Loading…</p>
          </div>
        </div>
      }
    >
      <CreateProposalForm />
    </Suspense>
  );
}
