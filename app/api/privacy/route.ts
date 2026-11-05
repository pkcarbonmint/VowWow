import { site } from "@/lib/config";
import { allow, readBody, reply, sameOrigin } from "@/lib/server/guard";
import { writeRow } from "@/lib/server/sink";
import { normalizeIndianMobile } from "@/lib/validate";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return reply({ error: "Please send this from the WeddingWell site." }, 403);
  if (!allow(request, "privacy", 5, 10 * 60_000)) return reply({ error: "Please wait a few minutes and try again." }, 429);

  const body = await readBody(request);
  const whatsapp = normalizeIndianMobile(typeof body?.whatsapp === "string" ? body.whatsapp : "");
  if (!whatsapp) return reply({ error: "Please enter the WhatsApp number you signed up with.", field: "whatsapp" }, 400);
  const request_type = body?.type === "delete" ? "delete_data" : "withdraw_consent";

  try {
    await writeRow("Privacy", { whatsapp, request_type, due_by_days: site.deletionDays });
  } catch {
    return reply({ error: `We couldn't record that. Please email ${site.email}.` }, 503);
  }
  return reply({ ok: true });
}
