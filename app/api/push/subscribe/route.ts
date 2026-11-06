import { NextRequest, NextResponse } from "next/server";
import { writeRowQuietly } from "@/lib/server/sink";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscription, userId } = body;

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription data required" },
        { status: 400 }
      );
    }

    // Store subscription data
    const row = {
      subscription_id: crypto.randomUUID(),
      user_id: userId || "anonymous",
      endpoint: subscription.endpoint,
      keys_auth: subscription.keys?.auth || "",
      keys_p256dh: subscription.keys?.p256dh || "",
      subscription_json: JSON.stringify(subscription),
      created_at: new Date().toISOString(),
    };

    await writeRowQuietly("Events", row);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Push subscription error:", error);
    return NextResponse.json(
      { error: "Failed to save subscription" },
      { status: 500 }
    );
  }
}
