import { visitorContext } from "@/lib/server/context";
import { allow, readBody, reply, sameOrigin } from "@/lib/server/guard";
import { writeRow, writeRowQuietly } from "@/lib/server/sink";
import { signLead } from "@/lib/server/token";
import { sendWhatsApp } from "@/lib/server/whatsapp";
import { isQualified, parseLead } from "@/lib/validate";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return reply({ error: "Please submit the form from the WeddingWell page." }, 403);
  if (!allow(request, "lead", 6, 10 * 60_000)) {
    return reply({ error: "Too many attempts. Please wait a few minutes and try again." }, 429);
  }

  const body = await readBody(request);
  if (!body) return reply({ error: "Something went wrong reading the form. Please try again." }, 400);

  // Bots fill the hidden field or submit instantly.
  const elapsed = Date.now() - Number(body.startedAt);
  if ((typeof body.website === "string" && body.website) || !(elapsed > 1500)) {
    return reply({ error: "Please take a moment to check your details, then submit again." }, 400);
  }

  const parsed = parseLead(body);
  if (!parsed.ok) return reply({ error: parsed.error, field: parsed.field }, 400);

  const { experiments, source } = await visitorContext();
  const lead = parsed.lead;
  const id = crypto.randomUUID();
  const qualified = isQualified(lead);
  const referral = lead.referral || source.ref || "";

  const leadRow = {
    lead_id: id,
    name: lead.name,
    email: lead.email,
    whatsapp: lead.whatsapp,
    wedding_month: lead.weddingMonth,
    area: lead.area,
    tier: lead.tier,
    role: lead.role,
    referral,
    qualified,
    google_user_id: lead.googleUserId || "",
    consent_whatsapp_privacy: true,
    consent_at: new Date().toISOString(),
    visitor_id: experiments.vid,
    test_message: experiments.message,
    test_price: experiments.price,
    test_commitment: experiments.commitment,
    utm_source: source.utm_source,
    utm_medium: source.utm_medium,
    utm_campaign: source.utm_campaign,
    utm_content: source.utm_content,
    ad_id: source.ad_id,
    landed_at: source.landed_at,
  };
  try {
    await writeRow("Leads", leadRow);
  } catch (error) {
    // Keep the visitor moving; the full row in the log lets us re-enter it by hand.
    console.error("[weddingwell] LEAD NOT SAVED TO SHEET", error, JSON.stringify(leadRow));
  }

  const shared = { lead_id: id, visitor_id: experiments.vid, test_message: experiments.message, test_price: experiments.price, test_commitment: experiments.commitment, utm_source: source.utm_source, utm_campaign: source.utm_campaign };
  await Promise.all([
    writeRowQuietly("Events", { event: "form_submitted", tier: lead.tier, qualified, ...shared }),
    referral ? writeRowQuietly("Events", { event: "referral_code_used", referral, ...shared }) : null,
    sendWhatsApp({ to: lead.whatsapp, template: "signup_confirmed", params: { name: lead.name.split(" ")[0] } }),
  ]);

  const token = signLead({ id, name: lead.name, whatsapp: lead.whatsapp, tier: lead.tier, qualified, exp: experiments, iat: Date.now() });
  return reply({ ok: true, token });
}
