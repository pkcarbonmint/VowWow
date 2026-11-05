import { site } from "@/lib/config";
import { allow, readBody, reply, sameOrigin } from "@/lib/server/guard";
import { createDepositLink, paymentsEnabled } from "@/lib/server/razorpay";
import { writeRow, writeRowQuietly } from "@/lib/server/sink";
import { verifyLead } from "@/lib/server/token";
import { sendWhatsApp } from "@/lib/server/whatsapp";
import { isBookableSlot } from "@/lib/slots";

const formatSlot = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));

export async function POST(request: Request) {
  if (!sameOrigin(request)) return reply({ error: "Please continue from the WeddingWell page." }, 403);
  if (!allow(request, "commit", 10, 10 * 60_000)) return reply({ error: "Please wait a moment and try again." }, 429);

  const body = await readBody(request);
  const lead = verifyLead(body?.token);
  if (!body || !lead) return reply({ error: "Your session expired. Please fill in the form again." }, 401);

  const choice = body.choice;
  const base = {
    lead_id: lead.id,
    whatsapp: lead.whatsapp,
    tier: lead.tier,
    qualified: lead.qualified,
    visitor_id: lead.exp.vid,
    test_message: lead.exp.message,
    test_price: lead.exp.price,
    test_commitment: lead.exp.commitment,
  };
  const firstName = lead.name.split(" ")[0];

  try {
    if (choice === "deposit") {
      await writeRowQuietly("Events", { event: "deposit_clicked", ...base });
      let paymentUrl: string | null = null;
      if (paymentsEnabled()) {
        try {
          const link = await createDepositLink(lead);
          paymentUrl = link.url;
          await writeRow("Commitments", { ...base, choice: "deposit", status: "link_created", amount_inr: site.depositInr, payment_link_id: link.id });
        } catch (error) {
          console.error("[weddingwell] payment link failed", error);
          await writeRow("Commitments", { ...base, choice: "deposit", status: "link_failed", amount_inr: site.depositInr });
          return reply({ error: "The payment page didn't open. Your spot request is saved – please try again, or book a call instead." }, 502);
        }
      } else {
        await writeRow("Commitments", { ...base, choice: "deposit", status: "requested_link_pending", amount_inr: site.depositInr });
      }
      await sendWhatsApp({ to: lead.whatsapp, template: "deposit_link", params: { name: firstName, amount: String(site.depositInr), link: paymentUrl ?? "" } });
      return reply({ ok: true, paymentUrl });
    }

    if (choice === "call") {
      const slot = typeof body.slot === "string" ? body.slot : "";
      if (!isBookableSlot(slot)) return reply({ error: "That time is no longer available. Please pick another.", field: "slot" }, 400);
      const label = formatSlot(slot);
      await writeRow("Commitments", { ...base, choice: "call", status: "booked", call_slot: slot, call_label: label });
      await writeRowQuietly("Events", { event: "call_booked", ...base });
      await sendWhatsApp({ to: lead.whatsapp, template: "call_booked", params: { name: firstName, slot: label } });
      return reply({ ok: true, slotLabel: label });
    }

    if (choice === "waitlist") {
      await writeRow("Commitments", { ...base, choice: "waitlist", status: "waitlist" });
      await sendWhatsApp({ to: lead.whatsapp, template: "waitlist", params: { name: firstName } });
      return reply({ ok: true });
    }
  } catch (error) {
    console.error("[weddingwell] commitment not saved", error);
    return reply({ error: "We couldn't save that just now. Please try again." }, 503);
  }

  return reply({ error: "Please choose one of the options." }, 400);
}
