# AWS SES Setup Guide for WeddingWell

Complete guide to setting up Amazon Simple Email Service (SES) for sending OTP emails.

## Why AWS SES?

✅ **Reliable** - Industry-standard email service  
✅ **Free tier** - 62,000 emails/month (if sending from EC2, otherwise 3,000/month free)  
✅ **Scalable** - Grows with your needs  
✅ **Fast** - Low latency  
✅ **Professional** - Better deliverability than free services  

## Setup Steps

### Step 1: Create AWS Account

1. Go to https://aws.amazon.com/
2. Click **"Create an AWS Account"**
3. Follow signup process (requires credit card for verification)
4. No charges for free tier usage

### Step 2: Access SES Console

1. Login to AWS Console: https://console.aws.amazon.com/
2. Search for **"SES"** in the top search bar
3. Click **"Amazon Simple Email Service"**
4. **Select Region** (top-right dropdown):
   - Recommended: **Asia Pacific (Mumbai)** `ap-south-1`
   - Alternative: **Asia Pacific (Singapore)** `ap-southeast-1`

### Step 3: Verify Email Identity

Since you don't have a domain yet, verify your email address:

1. In SES Console, click **"Verified identities"** (left sidebar)
2. Click **"Create identity"**
3. Select **"Email address"**
4. Enter your email (can use Gmail, Outlook, etc.)
5. Click **"Create identity"**
6. **Check your email inbox**
7. Click the verification link from Amazon
8. Wait for status to change to **"Verified"** ✅

**Note:** In Sandbox mode, you can only send emails FROM and TO this verified address.

### Step 4: Request Production Access

This allows you to send to any email address (required for your users):

1. In SES Console, click **"Account dashboard"** (left sidebar)
2. Look for banner: **"Your account is in the Amazon SES sandbox"**
3. Click **"Request production access"** button
4. Fill out the form:

**Mail Type:** Transactional

**Website URL:** `https://weddingwell.vercel.app`

**Use case description:**
```
WeddingWell is a health and wellness platform for engaged couples in India. 
We send transactional emails only:

1. Email OTP codes for user authentication (6-digit verification codes)
2. Estimated volume: 500-1,000 emails per day
3. Users explicitly provide their email address and expect these messages

Email compliance:
- Only sending to users who provided consent
- We monitor bounce rates and remove invalid addresses
- Unsubscribe not applicable (OTP codes are essential for login)
- We comply with CAN-SPAM and applicable laws
```

**Process for handling bounces:**
```
We monitor AWS SES bounce notifications and automatically:
1. Remove hard-bounce addresses from our system
2. Retry soft bounces once
3. Track bounce rates and investigate if >5%
```

**Process for handling complaints:**
```
We monitor AWS SES complaint notifications and:
1. Immediately remove complainants from email list
2. Investigate complaint causes
3. Track complaint rates (target <0.1%)
```

5. Click **"Submit request"**

**Approval Time:** Usually 24 hours, can be as quick as 1-2 hours during business days.

### Step 5: Create SMTP Credentials

1. In SES Console, click **"SMTP settings"** (left sidebar)
2. Note the **SMTP endpoint** for your region:
   - Mumbai: `email-smtp.ap-south-1.amazonaws.com`
   - Singapore: `email-smtp.ap-southeast-1.amazonaws.com`
3. Click **"Create SMTP credentials"**
4. IAM User Name: `weddingwell-smtp-user` (or keep default)
5. Click **"Create user"**
6. **⚠️ CRITICAL:** Click **"Show"** and save credentials:

```
SMTP Username: AKIAXXXXXXXXXX
SMTP Password: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Server Name: email-smtp.ap-south-1.amazonaws.com
Port: 587 (TLS)
```

**You CANNOT retrieve the password later!** Save it now.

## Add to Vercel Environment Variables

1. Go to Vercel Dashboard → Your Project
2. Click **Settings** → **Environment Variables**
3. Add the following (click "Add" after each):

```bash
AWS_SES_SMTP_USERNAME=AKIAXXXXXXXXXX
AWS_SES_SMTP_PASSWORD=your_long_smtp_password_here
AWS_SES_SMTP_HOST=email-smtp.ap-south-1.amazonaws.com
AWS_SES_SMTP_PORT=587
AWS_SES_FROM_EMAIL=your-verified@email.com
AWS_SES_FROM_NAME=WeddingWell
```

4. For each variable, select environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. Click **"Save"**

## Testing

### Option 1: Test in Sandbox Mode (Before Production Access)

You can only send to your verified email:

```
https://weddingwell.vercel.app/api/test-setup?secret=YOUR_SECRET&email=your-verified@email.com
```

Should see:
```json
{
  "tests": {
    "aws_ses": {
      "status": "✅ Success",
      "email_sent_to": "your-verified@email.com"
    }
  }
}
```

### Option 2: Test After Production Access

Send to any email:

```
https://weddingwell.vercel.app/api/test-setup?secret=YOUR_SECRET&email=anyone@gmail.com
```

## Troubleshooting

### "Email address is not verified"

**In Sandbox Mode:**
- You can ONLY send to verified email addresses
- Verify your test email: SES Console → Verified identities → Create identity

**Solution:** Request production access (Step 4 above)

### "Invalid SMTP credentials"

1. Check username/password have no extra spaces
2. Recreate SMTP credentials in SES Console
3. Update Vercel environment variables
4. Redeploy

### "MessageRejected: Email address is not verified"

Still in sandbox mode. Wait for production access approval (usually 24hrs).

### Emails going to spam

**After getting production access:**
1. Set up **SPF record** in your DNS (when you get a domain)
2. Set up **DKIM** in SES Console → Verified identities → Your email → DKIM
3. Warm up your sending (start with low volume, increase gradually)

## Cost

### Free Tier (Always Free)
- **3,000 emails/month** sent from SES directly
- **62,000 emails/month** if sending from EC2 instance

After free tier:
- **$0.10 per 1,000 emails**

### Your Expected Cost

For 1,000 users × 10 questions/day:
- ~500 OTP emails/day
- ~15,000 emails/month
- **Cost:** $1.20/month (after free tier)

**Much cheaper than alternatives!**

## Monitoring

### Check SES Dashboard

1. SES Console → **Account dashboard**
2. View:
   - Emails sent today
   - Bounce rate
   - Complaint rate
   - Reputation status

### Set Up CloudWatch Alarms (Optional)

Monitor bounce/complaint rates:
1. AWS Console → **CloudWatch**
2. Create alarms for:
   - Bounce rate > 5%
   - Complaint rate > 0.1%

## Upgrading Later

### When You Get a Domain

1. Verify domain in SES (instead of just email)
2. Set up DKIM authentication
3. Set up SPF record
4. Update `AWS_SES_FROM_EMAIL` to `noreply@yourdomain.com`

Benefits:
- Better deliverability
- Professional appearance
- Higher sending limits

## Summary Checklist

- [ ] AWS account created
- [ ] SES region selected (Mumbai recommended)
- [ ] Email address verified
- [ ] Production access requested
- [ ] SMTP credentials created and saved
- [ ] Environment variables added to Vercel
- [ ] Application redeployed
- [ ] Test email sent successfully
- [ ] Production access approved (wait 24hrs)
- [ ] Tested with non-verified email

## Support

- **AWS SES Documentation:** https://docs.aws.amazon.com/ses/
- **AWS Support:** Available in AWS Console
- **Production Access Issues:** Open ticket in AWS Console → Support Center

---

**Estimated Setup Time:** 15 minutes + 24 hours for production approval
