/**
 * Sends an opt-in WhatsApp template through your provider (Interakt, WATI, AiSensy, Gupshup...).
 * Most providers can receive a generic JSON webhook; map the fields in their dashboard or a small Zap.
 */
export async function sendWhatsApp(input: {
  to: string;
  template: "signup_confirmed" | "deposit_link" | "call_booked" | "waitlist";
  params: Record<string, string>;
}): Promise<"sent" | "skipped" | "failed"> {
  const url = process.env.WHATSAPP_WEBHOOK_URL;
  if (!url) return "skipped";
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.WHATSAPP_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.WHATSAPP_WEBHOOK_TOKEN}` } : {}),
      },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(8_000),
    });
    return res.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}
