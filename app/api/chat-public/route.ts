import { getAIResponse, type ChatMessage } from '@/lib/server/ai';

const MAX_MESSAGE_LENGTH = 300;
const MAX_LINES = 3;

/**
 * Public chat endpoint - no authentication required
 * Used while email verification is disabled
 */
export async function POST(req: Request) {
  try {
    const { message, conversationHistory, context } = await req.json();

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

    // Get AI response with context from request
    const aiResponse = await getAIResponse({
      message: trimmedMessage,
      name: context?.name,
      weddingMonth: context?.weddingMonth,
      tier: context?.tier,
      conversationHistory: validHistory,
    });

    return Response.json({ 
      response: aiResponse,
    });
  } catch (error: any) {
    console.error('[chat-public] Error:', error);
    
    // Handle specific errors
    if (error.message?.includes('AI service')) {
      return Response.json({ error: error.message }, { status: 503 });
    }
    
    return Response.json({ 
      error: 'Failed to process your question. Please try again.' 
    }, { status: 500 });
  }
}
