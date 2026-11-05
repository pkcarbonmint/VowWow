import assert from "node:assert/strict";
import test from "node:test";
import { applyActive, decodeExperiments, encodeExperiments, newExperiments } from "../lib/experiments";
import { isBookableSlot, upcomingSlots } from "../lib/slots";
import { decodeSource, encodeSource, sourceFromParams } from "../lib/source";
import { signLead, verifyLead } from "../lib/server/token";
import { isQualified, monthsUntil, normalizeIndianMobile, parseLead } from "../lib/validate";

const now = new Date("2026-11-05T10:00:00+05:30");

test("normalises Indian mobile numbers", () => {
  assert.equal(normalizeIndianMobile("98765 43210"), "+919876543210");
  assert.equal(normalizeIndianMobile("+91-98765-43210"), "+919876543210");
  assert.equal(normalizeIndianMobile("098765 43210"), "+919876543210");
  assert.equal(normalizeIndianMobile("12345 67890"), null);
  assert.equal(normalizeIndianMobile("98765"), null);
});

test("qualification needs 3+ months and a launch area", () => {
  assert.equal(monthsUntil("2027-02", now), 3);
  assert.equal(isQualified({ weddingMonth: "2027-02", area: "south-delhi" }, now), true);
  assert.equal(isQualified({ weddingMonth: "2027-01", area: "south-delhi" }, now), false);
  assert.equal(isQualified({ weddingMonth: "2027-06", area: "outside" }, now), false);
});

test("lead form requires consent and valid fields", () => {
  const base = { name: "Asha", whatsapp: "9876543210", weddingMonth: "2027-05", area: "noida", tier: "gold", consent: true };
  assert.equal(parseLead(base, now).ok, true);
  const noConsent = parseLead({ ...base, consent: false }, now);
  assert.equal(noConsent.ok, false);
  assert.equal(!noConsent.ok && noConsent.field, "consent");
  const past = parseLead({ ...base, weddingMonth: "2026-01" }, now);
  assert.equal(!past.ok && past.field, "weddingMonth");
  assert.equal(parseLead({ ...base, tier: "diamond" }, now).ok, false);
});

test("experiment cookie round-trips and inactive tests fall back to A", () => {
  const e = newExperiments(() => 0.9);
  assert.deepEqual(decodeExperiments(encodeExperiments(e)), e);
  assert.equal(decodeExperiments("garbage"), null);
  const applied = applyActive(e, "message");
  assert.equal(applied.message, "B");
  assert.equal(applied.price, "A");
  assert.equal(applied.commitment, "A");
});

test("source captures UTMs, ad id and referral code", () => {
  const s = sourceFromParams(new URLSearchParams("utm_source=instagram&utm_campaign=nov&fbclid=abc123&code=RIYA10"));
  assert.equal(s.utm_source, "instagram");
  assert.equal(s.ad_id, "abc123");
  assert.equal(s.ref, "RIYA10");
  assert.deepEqual(decodeSource(encodeSource(s)), s);
});

test("lead token rejects tampering and expiry", () => {
  const token = signLead({ id: "x", name: "Asha", whatsapp: "+919876543210", tier: "gold", qualified: true, exp: newExperiments(), iat: Date.now() });
  assert.equal(verifyLead(token)?.name, "Asha");
  assert.equal(verifyLead(token.slice(0, -2) + "xx"), null);
  assert.equal(verifyLead(token, Date.now() + 8 * 86_400_000), null);
});

test("call slots skip Sundays and stay 3+ hours ahead", () => {
  const slots = upcomingSlots(now);
  assert.ok(slots.length > 20);
  assert.ok(slots.every((s) => new Date(s).getTime() >= now.getTime() + 3 * 3_600_000));
  assert.ok(slots.every((s) => new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", weekday: "short" }).format(new Date(s)) !== "Sun"));
  assert.equal(isBookableSlot(slots[0], now), true);
  assert.equal(isBookableSlot("2020-01-01T11:00:00+05:30", now), false);
});
