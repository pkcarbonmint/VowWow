# AI Chat - Quick Setup Guide

Get the AI chat feature running in **10 minutes**.

## Step 1: Get API Keys

### AWS SES (Email OTP) - 15 minutes

**See complete guide:** `AWS_SES_SETUP.md`

Quick version:
1. AWS Console → Search "SES" → Select Mumbai region
2. Verify email: Verified identities → Create → Email address
3. Create SMTP credentials: SMTP settings → Create credentials
4. Save: Username, Password, Host (`email-smtp.ap-south-1.amazonaws.com`)
5. Request production access (takes 24hrs approval)

### Groq (AI Chat) - 2 minutes
1. Visit https://console.groq.com/
2. Sign up with email
3. Click **Create API Key**
4. Copy key (starts with `gsk_`)

## Step 2: Update Environment Variables (2 minutes)

Create/update `.env.local`:

```bash
# Your existing TOKEN_SECRET (or add one, 16+ chars)
TOKEN_SECRET=my-super-secret-token-change-this-to-something-random

# AWS SES
AWS_SES_SMTP_USERNAME=AKIAXXXXXXXXXX
AWS_SES_SMTP_PASSWORD=your_smtp_password
AWS_SES_SMTP_HOST=email-smtp.ap-south-1.amazonaws.com
AWS_SES_SMTP_PORT=587
AWS_SES_FROM_EMAIL=your-verified@email.com
AWS_SES_FROM_NAME=WeddingWell

# Groq
GROQ_API_KEY=gsk_paste_your_key_here
```

## Step 3: Update Google Sheets (1 minute)

Open your Google Sheet → **Leads** tab → Add column after `name`:

| lead_id | name | **email** | whatsapp | wedding_month | ... |

That's it! Your existing Google Apps Script doesn't need changes.

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
2. Add:
   - `TOKEN_SECRET`
   - `AWS_SES_SMTP_USERNAME`
   - `AWS_SES_SMTP_PASSWORD`
   - `AWS_SES_SMTP_HOST`
   - `AWS_SES_SMTP_PORT`
   - `AWS_SES_FROM_EMAIL`
   - `AWS_SES_FROM_NAME`
   - `GROQ_API_KEY`
   - `SECRET_TEST_KEY`
3. Deploy:

```bash
git add .
git commit -m "Add AI chat feature"
git push
```

Done! 🎉

## What Users See

1. **New section on homepage:** "Get personalized advice"
2. **Auth flow:** Email → OTP → Context (name, wedding, tier)
3. **Chat interface:** 10 free questions/day about health/skincare
4. **Smart responses:** Timeline-aware, Indian wedding-specific advice

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
- Run test route to check ZeptoMail config
- Check terminal logs (it prints OTP if ZeptoMail not configured)
- Check ZeptoMail dashboard → Logs

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
