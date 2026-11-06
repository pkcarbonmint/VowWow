# Testing Push Notifications

Quick guide to test push notifications locally and in production.

## Prerequisites

Make sure you have these environment variables set (locally in `.env.local` or on Vercel):

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BH_your_public_key
VAPID_PUBLIC_KEY=BH_your_public_key
VAPID_PRIVATE_KEY=your_private_key
VAPID_SUBJECT=mailto:your-email@example.com
SECRET_TEST_KEY=your_secret_test_key
CRON_SECRET=your_cron_secret
```

## Test Flow

### 1. Start Local Dev Server

```bash
npm run dev
```

### 2. Open in Browser

Visit `http://localhost:3000` (or your deployed URL)

### 3. Complete Signup

1. Fill out the signup form with a test wedding date
2. Complete the flow
3. You'll be redirected to `/welcome`

### 4. Install PWA

On the welcome page:
- Click "Install App" when prompted
- Or use browser menu: Chrome → Install App / Safari → Add to Home Screen

### 5. Grant Notification Permission

After installing:
- The notification prompt will appear
- Click "Enable Notifications"
- Grant permission in the browser dialog

### 6. Test Sending a Notification

Once you've subscribed, your subscription is saved. To send a test push:

#### Option A: Use the Test API

Create a test script `test-push.js`:

```javascript
// Get your subscription from browser console:
// 1. Open DevTools → Application → Service Workers
// 2. Run in console: 
//    registration.pushManager.getSubscription().then(s => console.log(JSON.stringify(s)))

const subscription = {
  // Paste your subscription object here
  endpoint: "https://fcm.googleapis.com/...",
  keys: {
    p256dh: "...",
    auth: "..."
  }
};

fetch('http://localhost:3000/api/test-push', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_SECRET_TEST_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    subscription,
    daysUntil: 100,
    userName: 'Priya'
  })
})
.then(r => r.json())
.then(console.log);
```

Run it:
```bash
node test-push.js
```

#### Option B: Trigger Daily Cron Manually

```bash
curl -X POST http://localhost:3000/api/cron/daily-tips \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

(Note: The cron currently logs but doesn't send actual notifications until you implement subscription fetching)

### 7. Receive Notification

You should see a notification pop up on your device:

**Title:** "Day 100: Start Your Morning Right ☀️"  
**Body:** "Drink a glass of warm water with lemon..."

Click it → Opens `/resources?tip=morning-routine`

## Debugging

### Check Service Worker

Chrome DevTools → Application → Service Workers

- Should show `sw.js` as "activated and running"
- Check for errors in the console

### Check Subscription

In browser console:
```javascript
navigator.serviceWorker.ready.then(registration => {
  registration.pushManager.getSubscription().then(subscription => {
    console.log('Current subscription:', subscription);
  });
});
```

### Check Push Support

```javascript
console.log('Push supported:', 'PushManager' in window);
console.log('Notification permission:', Notification.permission);
```

### Common Issues

**"Service Worker registration failed"**
- Make sure you're on HTTPS (or localhost)
- Check browser console for specific errors

**"Notification permission denied"**
- Reset in browser settings: Site Settings → Notifications → Reset

**"Push subscription failed"**
- Check VAPID keys are set correctly
- Make sure NEXT_PUBLIC_VAPID_PUBLIC_KEY is actually public (starts with BH...)

**Notification doesn't show**
- Check browser settings allow notifications
- On iOS, make sure you "Add to Home Screen" first
- Check service worker console for errors

## Production Testing

Same steps, but use your production URL:

1. Visit `https://your-domain.vercel.app`
2. Complete signup → install PWA → enable notifications
3. Wait for 7am IST the next day, or manually trigger cron:

```bash
curl -X POST https://your-domain.vercel.app/api/cron/daily-tips \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Monitoring

Check Vercel logs to see:
- When cron job runs
- How many notifications sent
- Any errors

```
[VowWow Cron] Daily tips job executed at 2026-11-06T01:30:00.000Z
[VowWow Cron] Sent 42 notifications
```

## Next Steps After Testing

Once notifications work:

1. Implement subscription fetching in `/app/api/cron/daily-tips/route.ts`
2. Store wedding date and name with each subscription
3. Add analytics to track open rates
4. Monitor and iterate on tip content
5. Set up alerts for cron failures

Happy pushing! 🔔
