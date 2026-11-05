"use client";

import { useState } from "react";

export function PrivacyRequest() {
  const [whatsapp, setWhatsapp] = useState("");
  const [type, setType] = useState<"withdraw" | "delete">("delete");
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/privacy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsapp, type }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      setStatus(res.ok ? { ok: true, message: "Request received. We'll confirm on WhatsApp once it's done." } : { ok: false, message: json.error ?? "Please try again." });
    } catch {
      setStatus({ ok: false, message: "You seem to be offline. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-4 rounded-3xl bg-paper p-5">
      <div>
        <label htmlFor="p-whatsapp" className="text-sm font-semibold">WhatsApp number you signed up with</label>
        <input id="p-whatsapp" type="tel" inputMode="numeric" autoComplete="tel-national" required value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="mt-1.5 block min-h-12 w-full rounded-2xl border border-line bg-white px-4" />
      </div>
      <fieldset className="space-y-2 text-sm">
        <legend className="font-semibold">Request</legend>
        <label className="flex items-center gap-2"><input type="radio" name="type" checked={type === "delete"} onChange={() => setType("delete")} className="accent-sage" /> Delete my data</label>
        <label className="flex items-center gap-2"><input type="radio" name="type" checked={type === "withdraw"} onChange={() => setType("withdraw")} className="accent-sage" /> Withdraw WhatsApp consent only</label>
      </fieldset>
      {status ? <p role="status" className={status.ok ? "text-sage" : "text-red-800"}>{status.message}</p> : null}
      <button disabled={busy} className="min-h-12 rounded-full bg-sage px-6 font-semibold text-white disabled:opacity-60">{busy ? "Sending…" : "Send request"}</button>
    </form>
  );
}
