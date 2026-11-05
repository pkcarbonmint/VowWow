import { getSession, updateSession, checkAndResetDailyLimit } from '@/lib/server/session';
import { getAIResponse, type ChatMessage } from '@/lib/server/ai';

const DAILY_LIMIT = 10;
const MAX_MESSAGE_LENGTH = 300;
const MAX_LINES = 3;

export async function POST(req: Request) {
  try {
    const session = await getSession();
    
    if (!session || !session.verified) {
      return Response.json({ error: 'Please verify your email first' }, { status: 401 });
    }

    // Check and reset daily limit if new day
    const updatedSession = await checkAndResetDailyLimit(session, DAILY_LIMIT);

    // Check rate limit
    if (updatedSession.questionsToday >= DAILY_LIMIT) {
      return Response.json({ 
        error: 'Daily limit reached',
        message: `You've used all ${DAILY_LIMIT} questions today. Resets at midnight IST.`,
        resetTime: 'midnight IST',
        limitReached: true,
      }, { status: 429 });
    }

    const { message, conversationHistory } = await req.json();

    // Validate message
    if (!message || typeof message !== 'string') {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return Response.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    // Check length limits
    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      return Response.json({ 
        error: `Please keep questions brief (under ${MAX_MESSAGE_LENGTH} characters)` 
      }, { status: 400 });
    }

    const lines = trimmedMessage.split('\n').filter(line => line.trim());
    if (lines.length > MAX_LINES) {
      return Response.json({ 
        error: `Please keep questions to ${MAX_LINES} lines or less` 
      }, { status: 400 });
    }

    // Validate conversation history format
    let validHistory: ChatMessage[] = [];
    if (Array.isArray(conversationHistory)) {
      validHistory = conversationHistory
        .filter(msg => 
          msg && 
          typeof msg === 'object' && 
          (msg.role === 'user' || msg.role === 'assistant') &&
          typeof msg.content === 'string'
        )
        .slice(-10); // Keep last 10 messages for context
    }

    // Get AI response
    const aiResponse = await getAIResponse({
      message: trimmedMessage,
      name: updatedSession.name,
      weddingMonth: updatedSession.weddingMonth,
      tier: updatedSession.tier,
      conversationHistory: validHistory,
    });

    // Increment question count
    await updateSession({
      questionsToday: updatedSession.questionsToday + 1,
    });

    const questionsRemaining = DAILY_LIMIT - updatedSession.questionsToday - 1;

    return Response.json({ 
      response: aiResponse,
      questionsRemaining,
      questionsToday: updatedSession.questionsToday + 1,
      dailyLimit: DAILY_LIMIT,
    });
  } catch (error: any) {
    console.error('[chat] Error:', error);
    
    // Handle specific errors
    if (error.message?.includes('AI service')) {
      return Response.json({ error: error.message }, { status: 503 });
    }
    
    return Response.json({ 
      error: 'Failed to process your question. Please try again.' 
    }, { status: 500 });
  }
}
