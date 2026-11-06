# AI Chatbot Testing Guide

This guide helps you test the Groq AI integration locally before deploying.

## Setup

The test script is ready: `test-groq-ai.js`

### Install Dependencies

```bash
npm install groq-sdk
```

## Testing Steps

### Step 1: Set Your API Key

When you receive the Groq API key, test it with:

```bash
GROQ_API_KEY="your-key-here" node test-groq-ai.js
```

### Step 2: Review Test Results

The script will test:
1. ✅ **Basic skincare question** - Should provide helpful advice
2. ✅ **Off-topic question** (wedding planning) - Should politely refuse
3. ✅ **Timing warning** - Should warn about treatments too close to wedding

### Expected Output

```
🧪 Testing Groq AI Integration
═══════════════════════════════════════════════════════════
✓ API Key found: gsk_xxxxxx...

📡 Initializing Groq client...
✓ Client initialized

📋 Test Context:
   Name: Priya
   Wedding: 2027-03 (120 days away)
   Phase: Reset
   Tier: gold
   Question: "I have oily skin and acne..."

🤖 Calling Groq AI...
   Model: llama-3.1-8b-instant
✓ Response received in XXXms

═══════════════════════════════════════════════════════════
AI RESPONSE:
═══════════════════════════════════════════════════════════
[AI response appears here]
═══════════════════════════════════════════════════════════

📊 Stats:
   Response time: XXXms
   Response length: XXX characters
   Model: llama-3.1-8b-instant
   Tokens used: XXX

✅ TEST PASSED!
```

## Test Scenarios Included

### Test 1: Skincare Advice (Should Work)
- **Question:** "I have oily skin and acne. What should I start with 4 months before my wedding?"
- **Expected:** Helpful, specific advice for Indian context
- **Should include:** Timeline-appropriate suggestions, Indian product recommendations

### Test 2: Off-Topic (Should Refuse)
- **Question:** "What color should my lehenga be?"
- **Expected:** Polite refusal, redirects to relevant topics
- **Should NOT:** Give wedding planning advice

### Test 3: Timing Warning (Should Warn)
- **Question:** "I want to start retinol for my skin" (asked 10 days before wedding)
- **Expected:** Warning about timing, alternatives
- **Should NOT:** Recommend risky new treatments

## Troubleshooting

### Error: API key not set
```
❌ ERROR: GROQ_API_KEY not set
```
**Fix:** Make sure you're setting the environment variable:
```bash
GROQ_API_KEY="gsk_xxxxx" node test-groq-ai.js
```

### Error: 401 Unauthorized
```
❌ ERROR: 401 Unauthorized
```
**Fix:** Check that your API key is correct and active

### Error: 404 Model not found
```
❌ ERROR: 404 The model `llama-3.1-8b-instant` does not exist
```
**Fix:** The model might be decommissioned. Check Groq docs for available models:
- https://console.groq.com/docs/models

Available alternatives:
- `llama-3.3-70b-versatile`
- `llama-3.1-70b-versatile`
- `mixtral-8x7b-32768`

Update the `MODEL` constant in `test-groq-ai.js`:
```javascript
const MODEL = 'llama-3.3-70b-versatile'; // or another available model
```

### Error: Rate limit exceeded
```
❌ ERROR: 429 Rate limit exceeded
```
**Fix:** Wait a few seconds and try again. Groq has rate limits on free tier.

## Model Selection

The script uses `llama-3.1-8b-instant` by default (fast, good for testing).

**Available models (as of Nov 2026):**
- `llama-3.1-8b-instant` - Fastest, good for quick responses
- `llama-3.3-70b-versatile` - Larger, more capable
- `mixtral-8x7b-32768` - Large context window

**For production, consider:**
- Balance between speed and quality
- Cost per token
- Response time requirements

## What to Check

When reviewing AI responses, verify:

✅ **Accuracy:**
- Advice is medically sound (general wellness, not diagnosis)
- Specific to Indian context (climate, available products)
- Timeline-appropriate (warns about timing)

✅ **Scope:**
- Stays within allowed topics (health, skincare, wellness)
- Refuses off-topic questions politely
- Redirects to appropriate resources

✅ **Tone:**
- Friendly and supportive
- Uses user's name
- Actionable and specific
- Not pushy about WeddingWell packages

✅ **Safety:**
- Never diagnoses medical conditions
- Advises consulting doctors when appropriate
- Warns about risky timing (e.g., new products close to wedding)

## Next Steps

Once testing is successful:

1. ✅ Verify all test cases pass
2. ✅ Check response quality and accuracy
3. ✅ Confirm model availability and pricing
4. 📝 Update environment variables in Vercel
5. 🚀 Integrate back into the app:
   - Restore `lib/server/ai.ts`
   - Restore `components/ai-chat.tsx`
   - Restore `/api/chat` routes
   - Update UI to show AI chat section

## Files to Restore

When ready to integrate:
- `lib/server/ai.ts` - AI service layer
- `components/ai-chat.tsx` - Chat UI component
- `app/api/chat-public/route.ts` - Public chat endpoint
- `app/page.tsx` - Add AI chat section back

We'll create these in a follow-up PR after testing is complete.
