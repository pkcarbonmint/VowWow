# WeddingWell – coming-soon validation page

A mobile-first Next.js 16 page that tests whether engaged couples will commit money (a refundable deposit) or time (a free 15-minute call) to a 4–6 month health and glow program before it is built.

## What's in it

- **Single scrolling page**: hero, the idea, a four-step journey (Reset, Build, Refine, Maintain), three tiers with a "Most chosen" tag on Gold, who is behind it ("clinical partners announced soon"), privacy, FAQ and the sign-up form. A sticky **Reserve your spot** button stays on screen on phones.
- **Two-step form**: name, WhatsApp number (Indian mobile check), wedding month, area, tier, optional role and referral code, and an unticked consent box. The second step offers a refundable deposit, a call slot picker, or "Not now". No health data is collected.
- **A/B tests**: headline, Gold price (₹35,000 or ₹45,000) and deposit-first versus call-first. Each visitor is split 50/50 and keeps the same versions on return visits. Choose the live tests with `ACTIVE_TESTS`.
- **Tracking**: page view with UTMs and ad id, packages viewed, tier click, form start and submit, deposit click and paid, call booked, and referral code used. Every row carries the visitor id and test versions.
- **Storage with no database**: rows go to a shared Google Sheet with Leads, Commitments, Events and Privacy tabs, as the brief suggests. Build the weekly report with a pivot table on Events and Leads.
- **Payments**: Razorpay payment links plus a signed webhook. Without keys, deposit requests are still saved and you can send the link manually.
- **WhatsApp**: an optional opt-in confirmation through your provider's webhook.
- **Compliance**: DPDP privacy notice with deletion and withdrawal requests, a refund policy, business details in the footer, no fabricated claims, plus honeypot, timing and rate-limit spam protection.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000 – rows are written to ./data/*.jsonl
npm test
```

## Deploy on Vercel

1. Import this repo into Vercel (framework: Next.js; no build settings needed).
2. Set the environment variables from `.env.example`. You need at least `TOKEN_SECRET`, `SHEETS_WEBHOOK_URL` and `SHEETS_WEBHOOK_SECRET`.
3. Set up the Google Sheet with `scripts/google-apps-script.js` (instructions at the top of the file).
4. Razorpay: add the keys, then create a webhook for `payment_link.paid` pointing to `https://<domain>/api/razorpay/webhook`.

Tag every ad and referral link, for example `?utm_source=instagram&utm_campaign=nov_launch&utm_content=ad12` or `?code=PLANNER-RIYA`.

## Before going live

Fill in the registered business name, address and grievance contact. Confirm the deposit amount and refund window, and get the healthcare lawyer review the brief requires.

Hero photo: Sabesh Photography LTD on Unsplash (Unsplash License).
