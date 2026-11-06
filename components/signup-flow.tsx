"use client";

import { useEffect, useRef, useState } from "react";
import { upcomingSlots } from "@/lib/slots";
import { track, trackConversion } from "@/lib/track";
import { TIER_EVENT } from "./tier-cards";

type Variant = "A" | "B";
type Stage = "interest" | "commit" | "done";
type Done = { kind: "deposit" | "call" | "waitlist"; detail?: string; pendingLink?: boolean };

type Draft = {
  name: string;
  email: string;
  whatsapp: string;
  weddingMonth: string;
  area: string;
  tier: string;
  role: string;
  referral: string;
  consent: boolean;
};

const DRAFT_KEY = "ww:draft";
const FLOW_KEY = "ww:flow";
const empty: Draft = { name: "", email: "", whatsapp: "", weddingMonth: "", area: "", tier: "", role: "", referral: "", consent: false };

const tierOptions = [
  { value: "silver", label: "Silver" },
  { value: "gold", label: "Gold" },
  { value: "platinum", label: "Platinum" },
  { value: "unsure", label: "Not sure" },
];

const fieldClass =
  "mt-1.5 block min-h-12 w-full rounded-2xl border border-line bg-white px-4 text-base text-ink placeholder:text-muted/70 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/25 aria-[invalid=true]:border-red-700";

export function SignupFlow(props: {
  areas: { value: string; label: string }[];
  monthMin: string;
  monthMax: string;
  referral: string;
  commitmentVariant: Variant;
  deposit: string;
  refundDays: number;
  paymentsLive: boolean;
  depositReturned: boolean;
  userEmail?: string;
  userName?: string;
  userId?: string;
}) {
  const [draft, setDraft] = useState<Draft>({ 
    ...empty, 
    referral: props.referral,
    email: props.userEmail || "",
    name: props.userName || "",
  });
  const [stage, setStage] = useState<Stage>("interest");
  const [token, setToken] = useState("");
  const [done, setDone] = useState<Done | null>(null);
  const [error, setError] = useState<{ message: string; field?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [slots, setSlots] = useState<string[]>([]);
  const [slot, setSlot] = useState("");
  const startedAt = useRef(0);
  const started = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const depositFirst = props.commitmentVariant === "A";

  // Restore after hydration so a reload or failed payment never loses what was typed.
  useEffect(() => {
    const id = window.setTimeout(() => {
      startedAt.current = Date.now();
      try {
        const saved = sessionStorage.getItem(DRAFT_KEY);
        if (saved) setDraft((d) => ({ ...d, ...(JSON.parse(saved) as Partial<Draft>) }));
        const flow = sessionStorage.getItem(FLOW_KEY);
        if (flow) {
          const parsed = JSON.parse(flow) as { stage: Stage; token: string; done?: Done };
          setToken(parsed.token);
          setStage(parsed.stage);
          if (parsed.done) setDone(parsed.done);
          if (parsed.stage === "commit") setSlots(upcomingSlots());
        }
      } catch {
        /* storage unavailable: start fresh */
      }
    }, 0);
    const onTier = (e: Event) => {
      const tier = (e as CustomEvent<string>).detail;
      setDraft((d) => ({ ...d, tier }));
    };
    window.addEventListener(TIER_EVENT, onTier);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener(TIER_EVENT, onTier);
    };
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {}
  }, [draft]);

  useEffect(() => {
    if (stage !== "interest") heading.current?.focus();
  }, [stage]);

  const saveFlow = (next: { stage: Stage; token: string; done?: Done }) => {
    try {
      sessionStorage.setItem(FLOW_KEY, JSON.stringify(next));
    } catch {}
  };

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    if (!started.current) {
      started.current = true;
      track("form_started");
    }
    setDraft((d) => ({ ...d, [key]: value }));
    if (error?.field === key) setError(null);
  };

  async function submitInterest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const website = (new FormData(e.currentTarget).get("website") as string) || "";
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...draft, 
          website, 
          startedAt: startedAt.current || Date.now() - 5000,
          googleUserId: props.userId,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { token?: string; error?: string; field?: string };
      if (!res.ok || !json.token) {
        setError({ message: json.error ?? "We couldn't complete that just now. Your answers are saved here – please try again in a moment.", field: json.field });
        if (json.field) document.getElementById(`f-${json.field}`)?.focus();
        return;
      }
      trackConversion("Lead");
      setToken(json.token);
      setSlots(upcomingSlots());
      setStage("commit");
      saveFlow({ stage: "commit", token: json.token });
    } catch {
      setError({ message: "You seem to be offline. Your answers are saved here – please try again." });
    } finally {
      setBusy(false);
    }
  }

  async function commit(choice: Done["kind"]) {
    if (busy) return;
    if (choice === "call" && !slot) {
      setError({ message: "Please pick a time for your call.", field: "slot" });
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, choice, slot }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string; paymentUrl?: string | null; slotLabel?: string };
      if (res.status === 401) {
        sessionStorage.removeItem(FLOW_KEY);
        setStage("interest");
      }
      if (!res.ok) {
        setError({ message: json.error ?? "We couldn't complete that just now. Your answers are saved here – please try again in a moment." });
        return;
      }
      const result: Done =
        choice === "call"
          ? { kind: "call", detail: json.slotLabel }
          : choice === "deposit"
            ? { kind: "deposit", pendingLink: !json.paymentUrl }
            : { kind: "waitlist" };
      trackConversion(choice === "call" ? "Schedule" : choice === "deposit" ? "InitiateCheckout" : "Lead");
      setDone(result);
      setStage("done");
      saveFlow({ stage: "done", token, done: result });
      sessionStorage.removeItem(DRAFT_KEY);
      if (json.paymentUrl) window.location.assign(json.paymentUrl);
    } catch {
      setError({ message: "You seem to be offline. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  const invalid = (field: string) => (error?.field === field ? true : undefined);
  const describedBy = (field: string) => (error?.field === field ? "form-error" : undefined);

  const errorBox = error ? (
    <p id="form-error" role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
      {error.message}
    </p>
  ) : null;

  if (stage === "done" && done) {
    return (
      <div className="rounded-3xl bg-paper p-6 md:p-8">
        <h3 ref={heading} tabIndex={-1} className="font-serif text-3xl outline-none">
          {done.kind === "waitlist" ? "You're on the list." : "Thank you – you're in."}
        </h3>
        <p className="mt-3 leading-relaxed text-muted">
          {props.depositReturned && done.kind === "deposit"
            ? "If your payment went through, Razorpay will email a receipt and we'll confirm on WhatsApp."
            : done.kind === "deposit" && done.pendingLink
              ? `We've saved your founding spot request. Your secure ${props.deposit} deposit link will arrive on WhatsApp shortly.`
              : done.kind === "call"
                ? `Your free 15-minute call is booked for ${done.detail}. We'll send a reminder on WhatsApp.`
                : "We'll message you on WhatsApp when founding spots open. No spam, and you can opt out any time."}
        </p>
        <p className="mt-3 text-sm text-muted">A WhatsApp confirmation usually arrives within 5 minutes.</p>
      </div>
    );
  }

  if (stage === "commit") {
    const depositBlock = (
      <div className={`rounded-3xl border p-5 ${depositFirst ? "border-sage bg-paper" : "border-line bg-paper/60"}`}>
        <p className="text-xs font-semibold tracking-widest text-sage uppercase">{depositFirst ? "Recommended" : "Or"}</p>
        <h4 className="mt-1 font-serif text-2xl">Reserve a founding spot</h4>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          A {props.deposit} deposit holds your place and founding-member pricing. It is not a purchase of the program.
        </p>
        <button
          type="button"
          disabled={busy}
          onClick={() => commit("deposit")}
          className={`mt-4 min-h-12 w-full rounded-full px-5 font-semibold disabled:opacity-60 ${
            depositFirst ? "bg-sage text-white hover:bg-sage-dark" : "border border-sage text-sage"
          }`}
        >
          {props.paymentsLive ? `Pay ${props.deposit} refundable deposit` : `Reserve with ${props.deposit} deposit`}
        </button>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          Fully refundable, no questions asked, within {props.refundDays} days of your request.{" "}
          <a href="/refund" className="underline">Refund policy</a>
        </p>
      </div>
    );

    const callBlock = (
      <div className={`rounded-3xl border p-5 ${!depositFirst ? "border-sage bg-paper" : "border-line bg-paper/60"}`}>
        <p className="text-xs font-semibold tracking-widest text-sage uppercase">{!depositFirst ? "Recommended" : "Or"}</p>
        <h4 className="mt-1 font-serif text-2xl">Book a free 15-minute call</h4>
        <p className="mt-2 text-sm text-muted">Pick a time (India time). We&apos;ll call your WhatsApp number.</p>
        <div role="radiogroup" aria-label="Call time" className="mt-3 flex max-h-56 flex-wrap gap-2 overflow-y-auto">
          {slots.slice(0, 24).map((s) => {
            const label = new Intl.DateTimeFormat("en-IN", {
              timeZone: "Asia/Kolkata",
              weekday: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            }).format(new Date(s));
            return (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={slot === s}
                onClick={() => {
                  setSlot(s);
                  setError(null);
                }}
                className={`min-h-11 rounded-full border px-3 text-sm ${
                  slot === s ? "border-sage bg-sage text-white" : "border-line bg-white text-ink"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => commit("call")}
          className={`mt-4 min-h-12 w-full rounded-full px-5 font-semibold disabled:opacity-60 ${
            !depositFirst ? "bg-sage text-white hover:bg-sage-dark" : "border border-sage text-sage"
          }`}
        >
          Book my call
        </button>
      </div>
    );

    return (
      <div className="space-y-4">
        <h3 ref={heading} tabIndex={-1} className="font-serif text-3xl outline-none">
          Thank you, {draft.name.split(" ")[0] || "you're signed up"}. One last step.
        </h3>
        <p className="text-muted">Founding spots are limited to what our clinical partners can take on well.</p>
        {errorBox}
        {depositFirst ? depositBlock : callBlock}
        {depositFirst ? callBlock : depositBlock}
        <button
          type="button"
          disabled={busy}
          onClick={() => commit("waitlist")}
          className="min-h-12 w-full rounded-full text-sm font-semibold text-muted underline underline-offset-4"
        >
          Not now – keep me on the waitlist
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submitInterest} noValidate className="space-y-5" aria-describedby={error ? "form-error" : undefined}>
      {errorBox}
      {!props.userId && (
        <div className="rounded-2xl bg-sage-soft border border-sage/20 p-4">
          <p className="text-sm font-semibold text-sage-dark">💡 Sign in with Google to auto-fill</p>
          <p className="mt-1 text-sm text-muted">
            Your name and email will be filled automatically from your Google account.
          </p>
          <a 
            href="/auth/signin" 
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-sage hover:text-sage-dark"
          >
            Sign in with Google →
          </a>
        </div>
      )}
      <div>
        <label htmlFor="f-name" className="text-sm font-semibold">Your name</label>
        <input 
          id="f-name" 
          name="name" 
          autoComplete="name" 
          required 
          value={draft.name} 
          onChange={(e) => update("name", e.target.value)} 
          aria-invalid={invalid("name")} 
          aria-describedby={describedBy("name")} 
          className={fieldClass}
          disabled={!!props.userId}
        />
        {props.userId && (
          <p className="mt-1 text-xs text-muted">✓ From your Google account</p>
        )}
      </div>
      <div>
        <label htmlFor="f-email" className="text-sm font-semibold">Email address</label>
        <input 
          id="f-email" 
          name="email" 
          type="email" 
          autoComplete="email" 
          required 
          value={draft.email} 
          onChange={(e) => update("email", e.target.value)} 
          aria-invalid={invalid("email")} 
          aria-describedby={describedBy("email")} 
          placeholder="you@example.com" 
          className={fieldClass}
          disabled={!!props.userId}
        />
        {props.userId && (
          <p className="mt-1 text-xs text-muted">✓ From your Google account</p>
        )}
      </div>
      <div>
        <label htmlFor="f-whatsapp" className="text-sm font-semibold">WhatsApp number</label>
        <div className="relative">
          <span className="pointer-events-none absolute top-1/2 left-4 mt-0.75 -translate-y-1/2 text-muted">+91</span>
          <input id="f-whatsapp" name="whatsapp" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="98765 43210" required value={draft.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} aria-invalid={invalid("whatsapp")} aria-describedby={describedBy("whatsapp")} className={`${fieldClass} pl-14`} />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="f-weddingMonth" className="text-sm font-semibold">Wedding month</label>
          <input id="f-weddingMonth" name="weddingMonth" type="month" min={props.monthMin} max={props.monthMax} required value={draft.weddingMonth} onChange={(e) => update("weddingMonth", e.target.value)} aria-invalid={invalid("weddingMonth")} aria-describedby={describedBy("weddingMonth")} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="f-area" className="text-sm font-semibold">City and area</label>
          <select id="f-area" name="area" required value={draft.area} onChange={(e) => update("area", e.target.value)} aria-invalid={invalid("area")} aria-describedby={describedBy("area")} className={fieldClass}>
            <option value="">Choose…</option>
            {props.areas.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>
      </div>
      <fieldset aria-invalid={invalid("tier")}>
        <legend className="text-sm font-semibold">Which tier interests you?</legend>
        <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {tierOptions.map((t) => (
            <label key={t.value} className={`flex min-h-12 cursor-pointer items-center justify-center rounded-2xl border text-sm font-semibold has-focus-visible:ring-2 has-focus-visible:ring-sage ${draft.tier === t.value ? "border-sage bg-sage text-white" : "border-line bg-white"}`}>
              <input id={t.value === "silver" ? "f-tier" : undefined} type="radio" name="tier" value={t.value} checked={draft.tier === t.value} onChange={() => update("tier", t.value)} className="sr-only" />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="f-role" className="text-sm font-semibold">Who is getting married? <span className="font-normal text-muted">(optional)</span></label>
          <select id="f-role" name="role" value={draft.role} onChange={(e) => update("role", e.target.value)} className={fieldClass}>
            <option value="">Prefer not to say</option>
            <option value="bride">I&apos;m the bride</option>
            <option value="groom">I&apos;m the groom</option>
            <option value="family">Family member</option>
          </select>
        </div>
        <div>
          <label htmlFor="f-referral" className="text-sm font-semibold">Referral code <span className="font-normal text-muted">(optional)</span></label>
          <input id="f-referral" name="referral" autoComplete="off" value={draft.referral} onChange={(e) => update("referral", e.target.value)} className={fieldClass} />
        </div>
      </div>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <label className="flex gap-3 text-sm leading-relaxed">
        <input id="f-consent" type="checkbox" checked={draft.consent} onChange={(e) => update("consent", e.target.checked)} aria-invalid={invalid("consent")} aria-describedby={describedBy("consent")} className="mt-0.5 size-5 shrink-0 accent-sage" />
        <span>
          I agree that WeddingWell may contact me on WhatsApp about this program, and I have read the{" "}
          <a href="/privacy" className="underline">privacy notice</a>. I can opt out any time.
        </span>
      </label>
      <button type="submit" disabled={busy} className="min-h-13 w-full rounded-full bg-sage px-6 text-base font-semibold text-white hover:bg-sage-dark disabled:opacity-60">
        {busy ? "Saving…" : "Continue"}
      </button>
      <p className="text-center text-xs text-muted">We never ask for health details on this page.</p>
    </form>
  );
}
