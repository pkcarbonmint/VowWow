import { sendEmailOTP } from '@/lib/server/email';

// In-memory OTP store (5-minute TTL)
// In production, consider Redis or database for multi-instance deployments
const otpStore = new Map<string, { code: string; expiresAt: number }>();

// Clean up expired OTPs periodically
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of otpStore.entries()) {
    if (data.expiresAt < now) {
      otpStore.delete(email);
    }
  }
}, 60 * 1000); // Every minute

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    // Validate email
    if (!email || typeof email !== 'string') {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Rate limiting: Check if OTP was sent recently (prevent spam)
    const existing = otpStore.get(email.toLowerCase());
    if (existing && existing.expiresAt > Date.now() + 4 * 60 * 1000) {
      // OTP was sent less than 1 minute ago (5 min expiry - 4 min = 1 min)
      return Response.json({ 
        error: 'Please wait a minute before requesting another code' 
      }, { status: 429 });
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store with 5-minute expiry
    otpStore.set(email.toLowerCase(), {
      code,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    // Send via email
    await sendEmailOTP(email, code);

    return Response.json({ success: true });
  } catch (error) {
    console.error('[auth] Send OTP error:', error);
    return Response.json({ 
      error: 'Failed to send verification code. Please try again.' 
    }, { status: 500 });
  }
}

// Export the OTP store for verification route
export { otpStore };
