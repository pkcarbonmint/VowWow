import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export type SessionData = {
  email: string;
  verified: boolean;
  name?: string;
  weddingMonth?: string;
  tier?: string;
  area?: string;
  whatsapp?: string;
  questionsToday: number;
  lastQuestionDate: string; // YYYY-MM-DD in IST
  iat: number;
};

const SESSION_COOKIE = 'ww_session';
const MAX_AGE = 30 * 24 * 60 * 60; // 30 days

function getSecret() {
  const secret = process.env.TOKEN_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('TOKEN_SECRET must be at least 16 characters');
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(data: Omit<SessionData, 'iat'>): Promise<string> {
  const secret = getSecret();
  
  const token = await new SignJWT(data as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  });

  return token;
}

export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    
    if (!token) return null;
    
    const secret = getSecret();
    const { payload } = await jwtVerify(token, secret);
    
    return payload as unknown as SessionData;
  } catch (error) {
    return null;
  }
}

export async function updateSession(updates: Partial<SessionData>): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error('No session found');
  
  await createSession({
    ...session,
    ...updates,
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export function getTodayIST(): string {
  const now = new Date();
  return new Intl.DateTimeFormat('en-CA', { 
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(now);
}

export async function checkAndResetDailyLimit(session: SessionData, dailyLimit = 10): Promise<SessionData> {
  const today = getTodayIST();
  
  if (session.lastQuestionDate !== today) {
    // New day, reset counter
    const updated = {
      ...session,
      questionsToday: 0,
      lastQuestionDate: today,
    };
    await updateSession(updated);
    return updated;
  }
  
  return session;
}
