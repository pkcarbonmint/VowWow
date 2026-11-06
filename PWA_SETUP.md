# PWA and Push Notifications Setup

This document explains how to complete the PWA and push notification setup for VowWow.

## What's Been Implemented

✅ PWA manifest (`/public/manifest.json`)  
✅ Service Worker (`/public/sw.js`)  
✅ Push notification subscription flow  
✅ Resources hub with AI chat, timeline, and guides  
✅ Welcome/onboarding page after signup  
✅ Notification permission prompts  
✅ PWA install prompts  

## What's Still Needed

### 1. Generate VAPID Keys

VAPID keys are required for web push notifications. Generate them using:

```bash
npx web-push generate-vapid-keys
```

This will output:
```
Public Key: BH...
Private Key: ...
```

Add these to your `.env.local` and Vercel environment variables:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BH...
VAPID_PUBLIC_KEY=BH...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:your-email@example.com
```

### 2. Create Proper App Icons

Currently using placeholder icons. Create proper PNG icons:

- `public/icon-192.png` - 192x192px
- `public/icon-512.png` - 512x512px

Icons should:
- Use the VowWow brand colors (sage #7C9082, cream #FDFCFB)
- Be simple and recognizable at small sizes
- Work well as a rounded square (iOS) and circle (Android)

You can use the SVG in `/app/icon.svg` as a starting point and convert it to PNG using a tool like:
- Figma / Adobe Illustrator
- ImageMagick: `convert -density 192 -background none icon.svg icon-192.png`

### 3. Set Up Push Notification Scheduler

To send daily notifications at 7am, set up a Vercel Cron Job:

Create `/app/api/cron/daily-tips/route.ts`:

```typescript
import { NextResponse } from "next/server";
// Import push sending logic

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Fetch all active push subscriptions from Events sheet
  // 2. For each subscription, calculate days until wedding
  // 3. Generate personalized tip based on phase
  // 4. Send push notification using /api/push/send

  return NextResponse.json({ success: true, sent: 0 });
}
```

Then add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/daily-tips",
      "schedule": "0 1 * * *"
    }
  ]
}
```

(1:30 UTC = 7:00 AM IST)

### 4. Testing Push Notifications Locally

1. Run `npm run dev`
2. Visit `http://localhost:3000`
3. Complete signup flow
4. Install PWA when prompted
5. Grant notification permission
6. Test sending a notification:

```bash
curl -X POST http://localhost:3000/api/push/send \
  -H "Authorization: Bearer YOUR_SECRET_TEST_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "subscription": {...},
    "notification": {
      "title": "Test Notification",
      "body": "This is a test!",
      "data": { "url": "/resources" }
    }
  }'
```

## User Flow

1. **Home Page** → User fills out signup form
2. **Welcome Page** → Shows success, prompts for PWA install
3. **PWA Installed** → App icon added to home screen
4. **Notification Prompt** → User grants permission
5. **Daily Notifications** → 7am push with personalized tip
6. **Resources Hub** → User can access anytime from home screen

## Browser Support

- **Chrome/Edge (Android)**: Full support ✅
- **Safari (iOS 16.4+)**: Full support ✅
- **Firefox (Android)**: Full support ✅
- **Desktop browsers**: PWA works, notifications supported

## Next Steps for Production

1. Generate and add VAPID keys
2. Create proper app icons
3. Implement daily cron job for push notifications
4. Set up analytics to track:
   - PWA install rate
   - Notification permission rate
   - Daily notification open rate
   - Resources hub engagement
5. Add WhatsApp integration once validated

## Files Added/Modified

### New Files:
- `/public/manifest.json` - PWA manifest
- `/public/sw.js` - Service worker
- `/lib/pwa.ts` - PWA utilities
- `/components/pwa-install-prompt.tsx` - Install prompt UI
- `/components/pwa-provider.tsx` - Service worker registration
- `/components/notification-prompt.tsx` - Permission prompt UI
- `/components/resources-hub.tsx` - Main hub component
- `/components/wedding-timeline.tsx` - Phase timeline
- `/components/guides-library.tsx` - Video guides (placeholder)
- `/app/resources/page.tsx` - Resources page
- `/app/welcome/page.tsx` - Post-signup welcome
- `/app/api/push/subscribe/route.ts` - Save subscriptions
- `/app/api/push/send/route.ts` - Send notifications

### Modified Files:
- `/app/layout.tsx` - Added manifest link, PWA provider
- `/components/signup-flow.tsx` - Added "Continue to Hub" button
- `/components/ai-chat.tsx` - Already exists, integrated into hub

## Resources

- [Web Push Protocol](https://web.dev/push-notifications-overview/)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [PWA on iOS](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/)
