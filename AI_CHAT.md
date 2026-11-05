# AI Chat Feature Documentation

## Overview

An AI-powered wedding glow planner that provides personalized health, skincare, and wellness advice to engaged couples. The chat uses email-based authentication, rate limiting, and contextual AI responses powered by Groq's Llama 3.1 model.

## Features

### ✅ What's Included

1. **Email OTP Authentication**
   - Secure email verification via ZeptoMail
   - Session management with httpOnly cookies (30-day expiry)
   - Automatic session resumption for returning users

2. **Smart Context Collection**
   - Gathers: name, wedding month, tier interest
   - Pulls data from signup form if available
   - Stores in localStorage + secure session cookie

3. **AI-Powered Responses**
   - Uses Groq (Llama 3.1 70B) - blazing fast (0.5-1s)
   - Completely FREE tier (14,400 requests/day)
   - Wedding timeline-aware advice
   - Indian wedding-specific knowledge

4. **Rate Limiting**
   - 10 questions per day per user
   - Resets at midnight IST
   - Soft conversion CTA when limit reached

5. **Input Validation**
   - Max 300 characters per message
   - Max 3 lines of text
   - Prevents spam and misuse

6. **Topic Filtering**
   - ONLY answers health, skincare, wellness questions
   - Politely refuses wedding planning, relationship advice
   - Never diagnoses medical conditions

## Architecture

```
User Flow:
1. Click "Chat with AI" → Enter email → Receive OTP
2. Verify OTP → Collect context (name, wedding, tier)
3. Create session (httpOnly cookie, 30 days)
4. Chat unlocked (10 questions/day)

Returning User:
1. Page load → Check session cookie
2. If valid → Load context → Resume chat
3. If expired → Re-authenticate
```

## API Routes

### `POST /api/auth/send-otp`
Send 6-digit OTP to email via ZeptoMail.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true
}
```

**Rate limit:** 1 OTP per minute per email

---

### `POST /api/auth/verify-otp`
Verify OTP and create session.

**Request:**
```json
{
  "email": "user@example.com",
  "code": "123456",
  "context": {
    "name": "Priya",
    "weddingMonth": "2027-03",
    "tier": "gold"
  }
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "email": "user@example.com",
    "name": "Priya",
    "weddingMonth": "2027-03",
    "tier": "gold"
  }
}
```

---

### `GET /api/auth/session`
Check authentication status.

**Response:**
```json
{
  "authenticated": true,
  "user": {
    "email": "user@example.com",
    "name": "Priya",
    "weddingMonth": "2027-03",
    "tier": "gold",
    "questionsToday": 3,
    "questionsRemaining": 7,
    "dailyLimit": 10
  }
}
```

---

### `POST /api/chat`
Send message to AI and get response.

**Request:**
```json
{
  "message": "I have oily skin. What should I do?",
  "conversationHistory": [
    { "role": "user", "content": "Previous question" },
    { "role": "assistant", "content": "Previous answer" }
  ]
}
```

**Response:**
```json
{
  "response": "For oily skin 130 days before your wedding...",
  "questionsRemaining": 6,
  "questionsToday": 4,
  "dailyLimit": 10
}
```

**Error (daily limit):**
```json
{
  "error": "Daily limit reached",
  "message": "You've used all 10 questions today. Resets at midnight IST.",
  "limitReached": true
}
```

## Setup Instructions

### 1. Install Dependencies

Already included in your project:
```bash
npm install groq-sdk jose
```

### 2. Get ZeptoMail Token

1. Go to https://www.zoho.com/zeptomail/
2. Sign up (free - 10,000 emails/month)
3. Go to **Mail Agents** → Create mail agent
4. Copy the **token**
5. Note your **bounce address**: `noreply@yourbounce.zeptomail.in`

### 3. Get Groq API Key

1. Go to https://console.groq.com/
2. Sign up (completely free)
3. Click **Create API Key**
4. Copy the key (starts with `gsk_`)

### 4. Update Environment Variables

Add to `.env.local`:

```bash
# Required: Token secret (16+ characters)
TOKEN_SECRET=your-super-secret-token-here-minimum-16-chars

# ZeptoMail (for email OTP)
ZEPTOMAIL_TOKEN=your_zeptomail_token
ZEPTOMAIL_BOUNCE_ADDRESS=noreply@yourbounce.zeptomail.in

# Groq AI (for chat responses)
GROQ_API_KEY=gsk_your_groq_api_key_here
```

### 5. Update Google Sheets

Add an `email` column to your **Leads** tab in Google Sheets (after `name` column):

| lead_id | name | email | whatsapp | wedding_month | ... |
|---------|------|-------|----------|---------------|-----|

No other changes needed to your Google Apps Script.

### 6. Test Setup

**Quick verification (recommended):**

```bash
npm run dev
```

Visit test route:
```
http://localhost:3000/api/test-setup?secret=test123&email=your@email.com
```

This checks:
- ✅ Environment variables set
- ✅ ZeptoMail can send emails
- ✅ Groq AI responds correctly

**Full UI test:**

Visit http://localhost:3000

1. Scroll to "Get personalized advice" section
2. Click "Send verification code"
3. Check terminal for OTP (if ZEPTOMAIL_TOKEN not set, it logs the OTP)
4. Enter OTP → Fill context → Start chatting

## Production Deployment

### Vercel Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```
TOKEN_SECRET=your-super-secret-token-here-minimum-16-chars
ZEPTOMAIL_TOKEN=your_zeptomail_token
ZEPTOMAIL_BOUNCE_ADDRESS=noreply@yourbounce.zeptomail.in
GROQ_API_KEY=gsk_your_groq_api_key_here
```

Deploy:
```bash
git add .
git commit -m "Add AI chat feature"
git push
```

Vercel auto-deploys!

## Usage Examples

### Example Conversations

**User:** "I have dark circles and my wedding is in 4 months"

**AI:** "With 120 days until your wedding, you're in the perfect Reset phase to address dark circles! Here's your timeline plan:

**Immediate (This week):**
- Get blood work done (check for anemia, Vitamin D, B12)
- Start using a caffeine eye serum daily
- Sleep 7-8 hours (crucial for dark circles)

**Weeks 1-8 (Build):**
- Your doctor may prescribe iron/B12 if deficient
- Consider retinol eye cream (needs time to work)
- Hydrate: 2-3 liters water daily

**Weeks 8-12 (Refine):**
- Book under-eye treatment if budget allows
- No new products after Week 14 (safety buffer)

Want to explore this with a doctor? Our Gold package (₹45k) includes 3 doctor consults and a dermatology plan."

---

**User:** "Can you help me plan my sangeet?"

**AI:** "I specialize in health and skincare for weddings, not event planning! 

For sangeet planning (choreography, venues, outfits), check out:
- WedMeGood
- TheKnot India
- Your wedding planner

But I CAN help with:
- Energy levels for sangeet rehearsals
- Makeup-proof skincare for the big day
- Managing pre-event stress
- Looking camera-ready

Want advice on any of those?"

## Customization

### Adjust Daily Limit

In `/app/api/chat/route.ts`:

```typescript
const DAILY_LIMIT = 15; // Change from 10 to 15
```

### Adjust Input Limits

In `/app/api/chat/route.ts`:

```typescript
const MAX_MESSAGE_LENGTH = 500; // Change from 300
const MAX_LINES = 5; // Change from 3
```

### Change AI Model

In `/lib/server/ai.ts`:

```typescript
model: 'llama-3.1-8b-instant' // Faster, slightly lower quality
// or
model: 'llama-3.3-70b-versatile' // Current (best quality, still fast)
// or
model: 'mixtral-8x7b-32768' // Alternative
```

### Customize AI Personality

Edit the `systemPrompt` in `/lib/server/ai.ts`:

```typescript
const systemPrompt = `You are WeddingWell's AI advisor...

TONE:
- More casual/formal
- Use more emojis
- Shorter/longer responses
...
`;
```

## Monitoring & Analytics

### Track Usage

Add tracking in `/app/api/chat/route.ts`:

```typescript
// After successful AI response
await writeRowQuietly("Events", {
  event: "ai_question_asked",
  user_email: updatedSession.email,
  questions_today: updatedSession.questionsToday + 1,
  tier_interest: updatedSession.tier,
});
```

### Monitor Errors

Check logs in Vercel Dashboard → Deployments → View Function Logs

Look for:
- `[ai] Groq error:` - AI service issues
- `[email] ZeptoMail failed:` - Email delivery issues
- `[auth] Verify OTP error:` - Auth problems

## Cost Breakdown

| Service | Free Tier | Cost After |
|---------|-----------|------------|
| **Groq** | 14,400 req/day | Still free |
| **ZeptoMail** | 10,000 emails/month | ₹300/10k emails |
| **Vercel** | Hobby plan | $20/month Pro |

**For 1,000 users × 10 questions/day:**
- 10,000 AI requests/day = **FREE** (Groq)
- ~500 OTP emails/day = **FREE** (ZeptoMail)
- Hosting = **FREE** (Vercel Hobby)

**Total monthly cost: ₹0** 🎉

Scale to 10,000 users before paying anything!

## Troubleshooting

### Use the Test Route First!

Before debugging, run the test route to identify the issue:

**Development:**
```
http://localhost:3000/api/test-setup?secret=test123&email=test@example.com
```

**Production:**
```
https://yourdomain.com/api/test-setup?secret=YOUR_SECRET_TEST_KEY&email=test@example.com
```

Set `SECRET_TEST_KEY` in environment variables for production access.

The test route will show you exactly what's missing or misconfigured.

### "Failed to send verification code"

1. Run test route with `&email=your@email.com` parameter
2. Check `ZEPTOMAIL_TOKEN` is set correctly
3. Check bounce address is correct
4. Check ZeptoMail dashboard for delivery logs

### "AI service temporarily unavailable"

1. Run test route to check Groq status
2. Check `GROQ_API_KEY` is set correctly
3. Check Groq dashboard for rate limit status
4. Try switching to 8B model (faster, lower usage)

### "Session not found" / Users logged out

1. Check `TOKEN_SECRET` is set (16+ chars)
2. Check it's the same across deployments
3. Sessions expire after 30 days (normal)

### Daily limit not resetting

1. Check server timezone (should auto-detect IST)
2. Check `getTodayIST()` function in `/lib/server/session.ts`
3. Sessions automatically reset at midnight IST

## Security Considerations

✅ **Session Security:**
- HttpOnly cookies (immune to XSS)
- 30-day expiry
- Signed with TOKEN_SECRET

✅ **Rate Limiting:**
- 10 questions/day (prevents abuse)
- 1 OTP per minute (prevents spam)
- Input length limits (prevents large requests)

✅ **Data Privacy:**
- No health data stored
- Email + context only
- Google Sheets for lead data (existing)

✅ **AI Safety:**
- System prompt filters dangerous advice
- Never diagnoses medical conditions
- Refuses off-topic questions

## Future Enhancements

### Phase 2 Ideas:

1. **Pull actual signup data from Sheets**
   - Add Google Sheets read API
   - Auto-populate context if they submitted form

2. **WhatsApp integration**
   - Send AI responses via WhatsApp
   - "Ask via WhatsApp" button

3. **Conversation history**
   - Store in database
   - Resume across devices

4. **Premium unlimited tier**
   - Remove daily limit for paying customers
   - Track via Razorpay subscription

5. **Voice input**
   - Speech-to-text for questions
   - Better mobile UX

## Support

For issues or questions:
1. Check logs in Vercel dashboard
2. Review this documentation
3. Check Groq/ZeptoMail service status
4. Contact: [Your support email]

---

Built with ❤️ for WeddingWell
