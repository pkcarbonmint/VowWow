import { verifyWebhook } from "@/lib/server/razorpay";
import { writeRow } from "@/lib/server/sink";

type Payload = {
  event?: string;
  payload?: {
    payment_link?: { entity?: { id?: string; reference_id?: string; amount_paid?: number } };
    payment?: { entity?: { id?: string } };
  };
};

export async function POST(request: Request) {
  const raw = await request.text();
  if (!verifyWebhook(raw, request.headers.get("x-razorpay-signature"))) {
    return new Response("invalid signature", { status: 401 });
  }

  const data = JSON.parse(raw) as Payload;
  if (data.event === "payment_link.paid") {
    const link = data.payload?.payment_link?.entity;
    await writeRow("Commitments", {
      lead_id: link?.reference_id,
      choice: "deposit",
      status: "paid",
      amount_inr: (link?.amount_paid ?? 0) / 100,
      payment_link_id: link?.id,
      payment_id: data.payload?.payment?.entity?.id,
    });
    await writeRow("Events", { event: "deposit_paid", lead_id: link?.reference_id });
  }
  return Response.json({ ok: true });
}
