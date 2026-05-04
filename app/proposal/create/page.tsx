"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CcBox } from "@/components/canton-capital/CcBox";
import type { FundRow } from "@/lib/canton-capital/types";

export default function CreateProposalPage() {
  const router = useRouter();
  const [funds, setFunds] = useState<FundRow[]>([]);
  const [fundId, setFundId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("50000");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/funds");
      const j = await res.json();
      const list = j.funds ?? [];
      setFunds(list);
      if (list[0]) setFundId(list[0].id);
    })();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
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
      setMsg("Invalid input or fund missing");
      return;
    }
    const prop = await res.json();
    router.push(`/proposal/${prop.id}`);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="text-2xl font-semibold cc-gradient">Create proposal</h1>
      <p className="mt-1 text-sm text-white/45">POST /api/proposal/create</p>

      <CcBox strong className="mt-8">
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="cc-label" htmlFor="fundId">
              Fund
            </label>
            <select
              id="fundId"
              className="cc-input"
              value={fundId}
              onChange={(e) => setFundId(e.target.value)}
            >
              {funds.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.id} — ${f.totalCapital.toLocaleString()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="cc-label" htmlFor="desc">
              Description
            </label>
            <textarea
              id="desc"
              className="cc-input min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="cc-label" htmlFor="amount">
              Amount (USD)
            </label>
            <input
              id="amount"
              type="number"
              min={0}
              className="cc-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          {msg ? <p className="text-sm text-red-400/90">{msg}</p> : null}
          <button type="submit" className="cc-btn cc-btn--primary w-full">
            Submit proposal
          </button>
        </form>
      </CcBox>
    </div>
  );
}
