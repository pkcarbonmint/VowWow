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

interface Subscription {
  subscription: PushSubscription;
  weddingDate?: string;
  userName?: string;
}

export async function GET(request: NextRequest) {
  try {
    // Verify this is from Vercel Cron or authorized source
    const authHeader = request.headers.get("authorization");
    
    // Vercel Cron sends a Bearer token, also allow our secret for manual testing
    const isVercelCron = authHeader?.startsWith("Bearer ");
    const isAuthorized = authHeader === `Bearer ${process.env.CRON_SECRET}`;
    
    if (!isVercelCron && !isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For MVP, we'll fetch subscriptions from localStorage context
    // In production, you'd query your database/sheets for all active subscriptions
    
    // TODO: Implement subscription fetching from your sheets/database
    // For now, return a success message indicating the cron is set up
    
    const sentCount = 0;
    const errors: string[] = [];

    // Example of how it would work with real subscriptions:
    /*
    const subscriptions: Subscription[] = await fetchSubscriptionsFromDatabase();
    
    for (const sub of subscriptions) {
      try {
        // Calculate days until wedding
        const daysUntil = sub.weddingDate 
          ? Math.ceil((new Date(sub.weddingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          : 100; // Default fallback
        
        // Generate personalized tip
        const tip = getTipForDaysUntil(daysUntil, sub.userName);
        
        // Send push notification
        await webpush.sendNotification(
          sub.subscription,
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
        
        sentCount++;
      } catch (error) {
        console.error('Failed to send notification:', error);
        errors.push(`Failed for subscription ${sub.subscription.endpoint.slice(-20)}`);
      }
    }
    */

    console.log(`[VowWow Cron] Daily tips job executed at ${new Date().toISOString()}`);
    console.log(`[VowWow Cron] Sent ${sentCount} notifications`);
    if (errors.length > 0) {
      console.error(`[VowWow Cron] ${errors.length} errors:`, errors);
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      sent: sentCount,
      errors: errors.length,
      message: "Cron job executed. Implement subscription fetching to send actual notifications.",
    });
  } catch (error) {
    console.error("[VowWow Cron] Daily tips job failed:", error);
    return NextResponse.json(
      { 
        error: "Cron job failed", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}

// Also support POST for manual testing
export async function POST(request: NextRequest) {
  return GET(request);
}
