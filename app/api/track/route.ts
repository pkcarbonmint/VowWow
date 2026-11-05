import { visitorContext } from "@/lib/server/context";
import { allow, readBody, reply, sameOrigin } from "@/lib/server/guard";
import { writeRowQuietly } from "@/lib/server/sink";

const EVENTS = new Set(["page_view", "packages_viewed", "tier_clicked", "form_started"]);

export async function POST(request: Request) {
  if (!sameOrigin(request) || !allow(request, "track", 60, 60_000)) return reply({ ok: false }, 202);
  const body = await readBody(request);
  const event = typeof body?.event === "string" ? body.event : "";
  if (!EVENTS.has(event)) return reply({ ok: false }, 400);

  const { experiments, source } = await visitorContext();
  const tier = typeof body?.tier === "string" ? body.tier.slice(0, 20) : undefined;
  await writeRowQuietly("Events", {
    event,
    tier,
    visitor_id: experiments.vid,
    test_message: experiments.message,
    test_price: experiments.price,
    test_commitment: experiments.commitment,
    utm_source: source.utm_source,
    utm_medium: source.utm_medium,
    utm_campaign: source.utm_campaign,
    utm_content: source.utm_content,
    ad_id: source.ad_id,
    referral: source.ref,
  });
  return reply({ ok: true });
}
