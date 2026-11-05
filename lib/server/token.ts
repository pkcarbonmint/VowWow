import { createHmac, timingSafeEqual } from "node:crypto";
import type { Experiments } from "../experiments";

/** What the commitment step needs. Signed so the browser cannot forge it, which avoids needing a database. */
export type LeadToken = {
  id: string;
  name: string;
  whatsapp: string;
  tier: string;
  qualified: boolean;
  exp: Experiments;
  iat: number;
};

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

let warned = false;

// A missing secret must never block sign-ups, so fall back to other server-only secrets, then a fixed value.
// The token only links step 2 to step 1; a forged one could add a junk commitment row, nothing more.
function secret() {
  for (const key of ["TOKEN_SECRET", "SHEETS_WEBHOOK_SECRET", "RAZORPAY_KEY_SECRET"]) {
    const value = process.env[key];
    if (value && value.length >= 16) return value;
  }
  if (process.env.VERCEL_ENV === "production" && !warned) {
    warned = true;
    console.error("[weddingwell] TOKEN_SECRET is not set (16+ characters). Using an insecure fallback.");
  }
  return "dev-only-token-secret-change-me";
}

const sign = (body: string) => createHmac("sha256", secret()).update(body).digest("base64url");

export function signLead(lead: LeadToken) {
  const body = Buffer.from(JSON.stringify(lead)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function verifyLead(token: unknown, now = Date.now()): LeadToken | null {
  if (typeof token !== "string" || token.length > 4000) return null;
  const [body, mac] = token.split(".");
  if (!body || !mac) return null;
  const expected = Buffer.from(sign(body));
  const given = Buffer.from(mac);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const lead = JSON.parse(Buffer.from(body, "base64url").toString()) as LeadToken;
    if (typeof lead.iat !== "number" || now - lead.iat > MAX_AGE_MS) return null;
    return lead;
  } catch {
    return null;
  }
}
