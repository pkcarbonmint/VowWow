import { createHmac, timingSafeEqual } from "node:crypto";
import { site, siteUrl } from "../config";

export const paymentsEnabled = () => Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

export async function createDepositLink(lead: { id: string; name: string; whatsapp: string }) {
  const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/payment_links", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: site.depositInr * 100,
      currency: "INR",
      description: `WeddingWell founding-member deposit (fully refundable within ${site.refundDays} days)`,
      reference_id: lead.id,
      customer: { name: lead.name, contact: lead.whatsapp },
      notify: { sms: false, email: false },
      notes: { lead_id: lead.id, purpose: "refundable_founding_deposit" },
      callback_url: `${siteUrl()}/?deposit=done#reserve`,
      callback_method: "get",
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Razorpay responded ${res.status}`);
  const json = (await res.json()) as { id: string; short_url: string };
  return { id: json.id, url: json.short_url };
}

export function verifyWebhook(rawBody: string, signature: string | null) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = Buffer.from(createHmac("sha256", secret).update(rawBody).digest("hex"));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
