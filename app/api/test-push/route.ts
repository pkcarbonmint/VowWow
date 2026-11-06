import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { getTipForDaysUntil } from "@/lib/daily-tips";

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
    const { subscription, daysUntil = 100, userName } = body;

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription required" },
        { status: 400 }
      );
    }

    // Generate a tip
    const tip = getTipForDaysUntil(daysUntil, userName);

    // Send push notification
    const result = await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: tip.title,
        body: tip.body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        data: {
          url: tip.url,
        },
      })
    );

    return NextResponse.json({ 
      success: true,
      tip,
      statusCode: result.statusCode 
    });
  } catch (error) {
    console.error("Test push error:", error);
    return NextResponse.json(
      { 
        error: "Failed to send test notification",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
