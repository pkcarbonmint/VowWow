"use client";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** Sends an event to our sheet and, when configured, to GA4 / Meta. Never throws. */
export function track(event: string, data: Record<string, string> = {}) {
  try {
    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, ...data }),
      keepalive: true,
    }).catch(() => {});
    window.gtag?.("event", event, data);
    window.fbq?.("trackCustom", event, data);
  } catch {
    /* analytics is best-effort */
  }
}

export function trackConversion(kind: "Lead" | "Schedule" | "InitiateCheckout") {
  window.fbq?.("track", kind);
  window.gtag?.("event", kind === "Lead" ? "generate_lead" : kind === "Schedule" ? "book_call" : "begin_checkout");
}
