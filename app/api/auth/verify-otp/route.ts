import { createSession, getTodayIST } from '@/lib/server/session';

// Import the OTP store from send-otp route
// Note: In production with multiple instances, use Redis or database
const otpStore = new Map<string, { code: string; expiresAt: number }>();

export async function POST(req: Request) {
  try {
    const { email, code, context } = await req.json();
    
    if (!email || !code) {
      return Response.json({ error: 'Email and code are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const stored = otpStore.get(normalizedEmail);
    
    // Verify OTP
    if (!stored) {
      return Response.json({ error: 'No verification code found. Please request a new one.' }, { status: 401 });
    }
    
    if (stored.expiresAt < Date.now()) {
      otpStore.delete(normalizedEmail);
      return Response.json({ error: 'Verification code expired. Please request a new one.' }, { status: 401 });
    }
    
    if (stored.code !== code.trim()) {
      return Response.json({ error: 'Invalid verification code' }, { status: 401 });
    }
    
    // Clear OTP after successful verification
    otpStore.delete(normalizedEmail);

    // Create session
    await createSession({
      email: normalizedEmail,
      verified: true,
      name: context?.name,
      weddingMonth: context?.weddingMonth,
      tier: context?.tier,
      area: context?.area,
      whatsapp: context?.whatsapp,
      questionsToday: 0,
      lastQuestionDate: getTodayIST(),
    });

    return Response.json({ 
      success: true,
      user: {
        email: normalizedEmail,
        name: context?.name,
        weddingMonth: context?.weddingMonth,
        tier: context?.tier,
      }
    });
  } catch (error) {
    console.error('[auth] Verify OTP error:', error);
    return Response.json({ 
      error: 'Verification failed. Please try again.' 
    }, { status: 500 });
  }
}
