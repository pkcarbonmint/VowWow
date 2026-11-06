import { areas, launchAreas, roles, tierIds, type TierId } from "./config";

export function normalizeIndianMobile(input: string): string | null {
  let digits = input.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? `+91${digits}` : null;
}

/** Whole calendar months from `now` (India time) to the wedding month. */
export function monthsUntil(weddingMonth: string, now = new Date()): number {
  const [y, m] = weddingMonth.split("-").map(Number);
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit" })
    .format(now)
    .split("-")
    .map(Number);
  return (y - parts[0]) * 12 + (m - parts[1]);
}

export type LeadInput = {
  name: string;
  email: string;
  whatsapp: string;
  weddingMonth: string;
  area: string;
  tier: TierId;
  role: string;
  referral: string;
  googleUserId?: string;
};

export type ParseResult = { ok: true; lead: LeadInput } | { ok: false; field: string; error: string };

export function parseLead(body: Record<string, unknown>, now = new Date()): ParseResult {
  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim() : "");

  const name = str("name");
  if (name.length < 2 || name.length > 80) return { ok: false, field: "name", error: "Please enter your name." };

  const email = str("email").toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { ok: false, field: "email", error: "Please enter a valid email address." };
  }

  const whatsapp = normalizeIndianMobile(str("whatsapp"));
  if (!whatsapp) return { ok: false, field: "whatsapp", error: "Please enter a valid 10-digit Indian mobile number." };

  const weddingMonth = str("weddingMonth");
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(weddingMonth)) {
    return { ok: false, field: "weddingMonth", error: "Please choose your wedding month and year." };
  }
  const months = monthsUntil(weddingMonth, now);
  if (months < 0 || months > 36) {
    return { ok: false, field: "weddingMonth", error: "Please choose a month within the next three years." };
  }

  const area = str("area");
  if (!areas.some((a) => a.value === area)) return { ok: false, field: "area", error: "Please choose your city and area." };

  const tier = str("tier") as TierId;
  if (!tierIds.includes(tier)) return { ok: false, field: "tier", error: "Please choose a tier, or 'Not sure'." };

  const role = str("role");
  if (role && !(roles as readonly string[]).includes(role)) return { ok: false, field: "role", error: "Please choose an option." };

  if (body.consent !== true && body.consent !== "on") {
    return { ok: false, field: "consent", error: "Please tick the box so we can contact you on WhatsApp." };
  }

  const googleUserId = typeof body.googleUserId === "string" ? body.googleUserId : undefined;
  
  return { ok: true, lead: { name, email, whatsapp, weddingMonth, area, tier, role, referral: str("referral").slice(0, 40), googleUserId } };
}

/** Qualified = wedding 3+ months away, inside the launch area, WhatsApp consent given. */
export function isQualified(lead: Pick<LeadInput, "weddingMonth" | "area">, now = new Date()) {
  return monthsUntil(lead.weddingMonth, now) >= 3 && launchAreas.has(lead.area);
}
