import { getSession, checkAndResetDailyLimit } from '@/lib/server/session';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return Response.json({ authenticated: false }, { status: 401 });
    }

    // Check and reset daily limit if needed
    const updatedSession = await checkAndResetDailyLimit(session);

    return Response.json({ 
      authenticated: true,
      user: {
        email: updatedSession.email,
        name: updatedSession.name,
        weddingMonth: updatedSession.weddingMonth,
        tier: updatedSession.tier,
        area: updatedSession.area,
        questionsToday: updatedSession.questionsToday,
        questionsRemaining: 10 - updatedSession.questionsToday,
        dailyLimit: 10,
      }
    });
  } catch (error) {
    console.error('[auth] Session check error:', error);
    return Response.json({ authenticated: false }, { status: 500 });
  }
}
