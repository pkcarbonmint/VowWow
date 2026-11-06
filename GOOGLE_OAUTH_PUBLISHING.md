# Publishing Google OAuth App

This guide helps you publish your WeddingWell OAuth app so anyone can sign in (not just test users).

## Required Assets Checklist

### ✅ 1. Logo (App Icon)
You need a **square image, minimum 120x120 pixels** (recommended: 512x512 PNG).

**Option A: Convert your existing icon.svg to PNG**

Use an online converter:
1. Go to https://cloudconvert.com/svg-to-png
2. Upload `app/icon.svg` from your repo
3. Set width/height to 512x512
4. Download the PNG
5. Save as `logo.png`

**Option B: Use Figma/Photoshop/Canva**
- Open `app/icon.svg`
- Export as PNG at 512x512
- Save as `logo.png`

**Your current logo:**
- Location: `app/icon.svg`
- Colors: Sage green (#3f5f4f) background with cream (#f6f1ea) rings and leaf
- Style: Minimalist, elegant

### ✅ 2. Privacy Policy
**Status:** ✅ Already created!
- URL: https://weddingwell.vercel.app/privacy
- Updated with Google Sign-In data usage
- Compliant with India's Digital Personal Data Protection Act, 2023

### ✅ 3. Terms of Service
**Status:** ✅ Created in this PR!
- URL: https://weddingwell.vercel.app/terms
- Covers: Account registration, deposits, refunds, disclaimers, liability
- Links from footer

## Publishing Steps

### Step 1: Prepare Your Logo

1. **Convert icon.svg to PNG:**
   ```bash
   # Visit: https://cloudconvert.com/svg-to-png
   # Upload: app/icon.svg
   # Download as: logo.png (512x512)
   ```

2. **Or use command line** (if you have tools installed):
   ```bash
   # Using ImageMagick
   convert app/icon.svg -resize 512x512 logo.png
   
   # Using Inkscape
   inkscape app/icon.svg --export-type=png --export-width=512 --export-filename=logo.png
   ```

### Step 2: Complete OAuth Consent Screen

1. Go to [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)

2. Make sure **User type** is set to "External"

3. Fill in **App information:**
   - **App name:** WeddingWell
   - **User support email:** Your email
   - **App logo:** Upload the `logo.png` you created (120x120 minimum)

4. Fill in **App domain:**
   - **Application home page:** `https://weddingwell.vercel.app`
   - **Application privacy policy link:** `https://weddingwell.vercel.app/privacy`
   - **Application terms of service link:** `https://weddingwell.vercel.app/terms`

5. Fill in **Authorized domains:**
   - Add: `weddingwell.vercel.app`
   - Add: `vercel.app` (if using preview deployments)

6. **Developer contact information:**
   - Your email address(es)

7. Click **"SAVE AND CONTINUE"**

### Step 3: Configure Scopes

On the "Scopes" screen:

1. Click **"ADD OR REMOVE SCOPES"**

2. Select these scopes:
   - ✅ `.../auth/userinfo.email` - See your email address
   - ✅ `.../auth/userinfo.profile` - See your personal info
   - ✅ `openid` - Associate you with your personal info on Google

3. **Optional:** If you want phone numbers (not recommended for first publish):
   - `.../auth/user.phonenumbers.read` - Requires verification

4. Click **"UPDATE"**

5. Click **"SAVE AND CONTINUE"**

### Step 4: Review Test Users

- **Optional:** Keep your test users for testing
- They can continue signing in during verification
- Click **"SAVE AND CONTINUE"**

### Step 5: Review Summary

- Review all information
- Click **"BACK TO DASHBOARD"**

### Step 6: Publish App

1. On the OAuth consent screen dashboard, you should see:
   ```
   Publishing status: Testing
   ```

2. Click **"PUBLISH APP"**

3. Read the confirmation dialog carefully

4. Click **"CONFIRM"**

## What Happens Next?

### If Using Basic Scopes (email, profile, openid):
- ✅ **App is immediately available to everyone!**
- No Google verification needed
- Users will see an "unverified app" warning (this is normal)
- The warning says: "Google hasn't verified this app"
- Users can click "Continue" to sign in

### If Using Sensitive/Restricted Scopes (phone numbers, etc.):
- ⏳ **Google verification required** (1-7 days)
- You'll receive an email to submit for verification
- Must fill out verification questionnaire
- Google reviews your app
- Once approved, the "unverified" warning disappears

## Unverified App Warning

When users sign in, they'll see:

```
Google hasn't verified this app
[!] This app hasn't been verified by Google yet.

WeddingWell
weddingwell.vercel.app wants to access your Google Account

This will allow WeddingWell to:
• See your email address
• See your personal info
• Associate you with your personal info on Google

[Cancel] [Continue]
```

**This is normal and safe!** Users can click "Continue" and sign in.

## To Remove the Warning (Optional)

To remove the "unverified" warning completely:

1. Go to [OAuth Verification](https://console.cloud.google.com/apis/credentials/consent)

2. If you see "Submit for Verification" - click it

3. Fill out the verification form:
   - Why you need user data
   - What you do with it
   - Privacy policy and ToS links (already done!)
   - Screen recording or screenshots of your app
   - Logo (already prepared!)

4. Submit and wait 1-7 days for review

**Note:** Verification is optional for personal/internal apps but recommended for public-facing apps.

## Testing After Publishing

1. **Sign out** from any test account

2. Try signing in with a **new Google account** (not in test users list)

3. Should see the consent screen with "Continue" option

4. Click "Continue" → Should successfully sign in

5. Check form auto-fill works

6. Check Google Sheets gets `google_user_id`

## Troubleshooting

### "Access blocked" error still appears
- Make sure you clicked "PUBLISH APP" (not just saved)
- Wait 5-10 minutes for changes to propagate
- Try in incognito/private window
- Clear browser cache

### Users see "This app is blocked"
- Check Authorized domains include `weddingwell.vercel.app`
- Check Application home page URL is correct
- Make sure Privacy Policy and ToS URLs are publicly accessible

### "Invalid redirect URI" error
- Check OAuth credentials have correct redirect URIs:
  - `https://weddingwell.vercel.app/api/auth/callback/google`
  - `http://localhost:3000/api/auth/callback/google` (for dev)

## Links

- [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)
- [OAuth Credentials](https://console.cloud.google.com/apis/credentials)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Verification Guidelines](https://support.google.com/cloud/answer/9110914)

## Summary Checklist

Before publishing:
- [ ] Convert `app/icon.svg` to `logo.png` (512x512)
- [ ] Upload logo to OAuth consent screen
- [ ] Add privacy policy URL: `https://weddingwell.vercel.app/privacy`
- [ ] Add terms of service URL: `https://weddingwell.vercel.app/terms`
- [ ] Add authorized domain: `weddingwell.vercel.app`
- [ ] Review scopes (only email, profile, openid for no verification)
- [ ] Click "PUBLISH APP"
- [ ] Wait 5-10 minutes
- [ ] Test with non-test user account
- [ ] (Optional) Submit for verification to remove warning
