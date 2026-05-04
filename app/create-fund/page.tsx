"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CcBox } from "@/components/canton-capital/CcBox";

export default function CreateFundPage() {
  const router = useRouter();
  const [manager, setManager] = useState("Manager::demo");
  const [initialCapital, setInitialCapital] = useState("250000");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch("/api/funds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        manager,
        initialCapital: Number(initialCapital),
      }),
    });
    if (!res.ok) {
      setMsg("Could not create fund");
      return;
    }
    const fund = await res.json();
    router.push(`/funds/${fund.id}`);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="text-2xl font-semibold cc-gradient">Create fund</h1>
      <p className="mt-1 text-sm text-white/45">POST /api/funds</p>

      <CcBox strong className="mt-8">
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="cc-label" htmlFor="manager">
              Manager
            </label>
            <input
              id="manager"
              className="cc-input"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="cc-label" htmlFor="cap">
              Initial capital (USD)
            </label>
            <input
              id="cap"
              type="number"
              min={0}
              step="1000"
              className="cc-input"
              value={initialCapital}
              onChange={(e) => setInitialCapital(e.target.value)}
              required
            />
          </div>
          {msg ? <p className="text-sm text-red-400/90">{msg}</p> : null}
          <button type="submit" className="cc-btn cc-btn--primary w-full">
            Create
          </button>
        </form>
      </CcBox>
    </div>
  );
}
