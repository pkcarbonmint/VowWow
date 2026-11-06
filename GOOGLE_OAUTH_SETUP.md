# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for WeddingWell.

## Prerequisites

- A Google Cloud account
- Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter project name (e.g., "WeddingWell") and click "Create"

## Step 2: Enable Google+ API

1. In your project, go to **APIs & Services** > **Library**
2. Search for "Google+ API"
3. Click on it and click "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose "External" user type (unless you have a Google Workspace)
3. Click "Create"
4. Fill in the required fields:
   - **App name**: WeddingWell
   - **User support email**: Your email
   - **Developer contact email**: Your email
5. Click "Save and Continue"
6. **Scopes**: Click "Add or Remove Scopes"
   - Add: `userinfo.email`
   - Add: `userinfo.profile`
   - Add: `openid`
7. Click "Save and Continue"
8. **Test users** (for development): Add your test email addresses
9. Click "Save and Continue"

## Step 4: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click "+ CREATE CREDENTIALS" > "OAuth client ID"
3. Choose "Web application"
4. **Name**: WeddingWell Web Client
5. **Authorized JavaScript origins**:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.vercel.app` (or your custom domain)
6. **Authorized redirect URIs**:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.vercel.app/api/auth/callback/google`
7. Click "Create"
8. **Copy your Client ID and Client Secret** - you'll need these!

## Step 5: Configure Environment Variables

### Local Development (`.env.local`)

Create a `.env.local` file in your project root:

```bash
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
AUTH_SECRET=your-random-secret-here
```

Generate `AUTH_SECRET` with:
```bash
openssl rand -base64 32
```

### Production (Vercel)

1. Go to your Vercel project dashboard
2. Click "Settings" > "Environment Variables"
3. Add the same three variables:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `AUTH_SECRET`
4. Make sure they're available for Production, Preview, and Development environments

## Step 6: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000`

3. Click "Sign in" in the header

4. You should see the "Continue with Google" button

5. Click it and authenticate with a Google account

6. After successful authentication, you should be redirected back to the homepage with your profile visible in the header

## Troubleshooting

### "Access blocked: Authorization Error"

- Make sure your OAuth consent screen is published (or your email is added as a test user)
- Verify your redirect URIs are exactly correct (including http/https)

### "Redirect URI mismatch"

- Check that your authorized redirect URIs in Google Console match exactly
- Format: `http://localhost:3000/api/auth/callback/google` (no trailing slash)

### "Error: [auth][cause]: MissingSecret"

- Make sure `AUTH_SECRET` is set in your environment variables
- Regenerate it with: `openssl rand -base64 32`

## Security Notes

- **Never commit** `.env.local` or `.env` to version control
- Keep your `GOOGLE_CLIENT_SECRET` secure
- Rotate your `AUTH_SECRET` periodically
- Use different credentials for development and production
- Review OAuth scopes - only request what you need

## User Data Stored

When a user signs in with Google OAuth, we store:

- **User ID**: Unique identifier from Google
- **Name**: Full name
- **Email**: Email address
- **Profile Picture**: Avatar URL

This data is stored in the session only and is not persisted to a database by default.

## Integration with Interest Form

Google OAuth is now integrated with the interest form:

### When User is NOT Signed In:
- Form displays a banner: "Sign in with Google to auto-fill"
- User can still fill the form manually
- Form submission is anonymous (no Google User ID linked)

### When User IS Signed In:
- Name and Email fields are **auto-filled** from Google account
- Fields are **disabled** (cannot be edited) with "✓ From your Google account" label
- Form submission includes the `google_user_id` in the spreadsheet
- This allows you to link form submissions to user accounts

### Data Flow:
1. User signs in with Google → Session created with user info
2. User visits homepage → Form auto-fills name/email from session
3. User submits form → Backend saves `google_user_id` to "Leads" sheet
4. Later you can identify which form submissions came from authenticated users

### Benefits:
- **Data accuracy**: Name/email match Google account (verified)
- **User tracking**: Link multiple interactions to same user
- **Anti-spam**: Authenticated users are more trustworthy
- **Better UX**: Less typing for signed-in users

## Next Steps

To persist user data to a database, you'll need to:

1. Set up a database (PostgreSQL, MySQL, etc.)
2. Configure NextAuth database adapter
3. Create user tables
4. Update `auth.ts` configuration

See [NextAuth.js documentation](https://authjs.dev/getting-started/adapters) for details.
