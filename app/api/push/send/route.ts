import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

// Set VAPID details
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY && process.env.VAPID_SUBJECT) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function POST(request: NextRequest) {
  try {
    // Verify secret key for security
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.SECRET_TEST_KEY}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { subscription, notification } = body;

    if (!subscription || !notification) {
      return NextResponse.json(
        { error: "Subscription and notification data required" },
        { status: 400 }
      );
    }

    // Send push notification
    await webpush.sendNotification(subscription, JSON.stringify(notification));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Push send error:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
