# AI Chat - Quick Setup Guide

Get the AI chat feature running in **10 minutes**.

⚠️ **Email verification is currently DISABLED** - Users can chat immediately without email/OTP. 
Context is stored in browser localStorage only. Email auth will be re-enabled once AWS SES gets production access.

## Step 1: Get API Keys

### Groq (AI Chat) - 2 minutes (REQUIRED)
1. Visit https://console.groq.com/
2. Sign up with email
3. Click **Create API Key**
4. Copy key (starts with `gsk_`)

## Step 2: Update Environment Variables (2 minutes)

Create/update `.env.local`:

```bash
# Required: Groq AI
GROQ_API_KEY=gsk_paste_your_key_here

# Optional: For testing (AWS SES - not needed right now)
# AWS_SES_SMTP_USERNAME=AKIAXXXXXXXXXX
# AWS_SES_SMTP_PASSWORD=your_smtp_password
# AWS_SES_SMTP_HOST=email-smtp.ap-south-1.amazonaws.com
# AWS_SES_SMTP_PORT=587
# AWS_SES_FROM_EMAIL=your-verified@email.com
# AWS_SES_FROM_NAME=WeddingWell
```

## Step 3: Update Google Sheets (SKIP for now)

~~Open your Google Sheet → **Leads** tab → Add column after `name`:~~

~~| lead_id | name | **email** | whatsapp | wedding_month | ... |~~

**Not needed right now** - email collection is disabled.

## Step 4: Test Setup (2 minutes)

### Option A: Quick Setup Test (Recommended)

Visit the test route to verify everything is configured:

```bash
npm run dev
```

Then visit:
```
http://localhost:3000/api/test-setup?secret=test123&email=your@email.com
```

You'll see:
```json
{
  "overall": "✅ All systems operational",
  "tests": {
    "env_vars": {
      "TOKEN_SECRET": "✅ Set",
      "ZEPTOMAIL_TOKEN": "✅ Set",
      "GROQ_API_KEY": "✅ Set"
    },
    "zeptomail": {
      "status": "✅ Success",
      "email_sent_to": "your@email.com",
      "note": "Check your email for OTP: 123456"
    },
    "groq": {
      "status": "✅ Success",
      "response_time_ms": 847,
      "response_preview": "Use blotting papers throughout the day..."
    }
  }
}
```

### Option B: Full UI Test

1. Go to http://localhost:3000
2. Scroll to **"Get personalized advice"** section
3. Enter email → Check terminal for OTP (or your email if ZeptoMail is configured)
4. Enter OTP → Fill context → Ask: "I have oily skin, help!"

## Deploy to Production

Add environment variables in Vercel:

1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add (required):
   - `GROQ_API_KEY` (required for AI)
   - `SECRET_TEST_KEY` (for testing endpoint)
3. Optional (for when email is re-enabled):
   - `AWS_SES_SMTP_USERNAME`
   - `AWS_SES_SMTP_PASSWORD`
   - `AWS_SES_SMTP_HOST`
   - `AWS_SES_SMTP_PORT`
   - `AWS_SES_FROM_EMAIL`
   - `AWS_SES_FROM_NAME`
3. Deploy:

```bash
git add .
git commit -m "Add AI chat feature"
git push
```

Done! 🎉

## What Users See

1. **New section on homepage:** "Get personalized advice"
2. **Simple flow:** Name → Wedding date → Tier → Chat starts immediately
3. **Chat interface:** Unlimited questions about health/skincare (no rate limiting)
4. **Smart responses:** Timeline-aware, Indian wedding-specific advice
5. **No signup required:** Works immediately, data saved in browser

## What You Get

- **Free tier:** 1,000+ users before any costs
- **10 questions/day** per user (soft conversion opportunity)
- **Email collection** (valuable for marketing)
- **Engagement metric** (track what people ask)

## Troubleshooting

### Use the Test Route First!

```
http://localhost:3000/api/test-setup?secret=test123&email=your@email.com
```

This will tell you exactly what's missing or misconfigured.

### "OTP not received"
- Run test route to check AWS SES config
- Check terminal logs (it prints OTP if AWS SES not configured)
- **In Sandbox mode:** Can only send to verified email
- Check AWS SES Console → Account dashboard → Sending statistics

### "AI error"
- Run test route to check Groq config
- Check `GROQ_API_KEY` is correct
- Visit https://console.groq.com/ → Check rate limits

### "Build error"
- Run `npm install` (jose and groq-sdk should be installed)
- Run `npm run build` to see TypeScript errors

## Need Help?

Read full docs: `AI_CHAT.md`

---

**Estimated setup time:** 10 minutes  
**Monthly cost:** ₹0 (free tiers for everything)  
**Scales to:** 1,000+ users before paying
