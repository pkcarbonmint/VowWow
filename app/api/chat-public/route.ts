import { getAIResponse, type ChatMessage } from '@/lib/server/ai';

const MAX_MESSAGE_LENGTH = 300;
const MAX_LINES = 3;
const MAX_HISTORY = 10;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, context, history } = body;

    // Validate message
    if (!message || typeof message !== 'string') {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    const trimmedMessage = message.trim();
    
    if (trimmedMessage.length === 0) {
      return Response.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      return Response.json({ 
        error: `Message too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.` 
      }, { status: 400 });
    }

    const lineCount = trimmedMessage.split('\n').length;
    if (lineCount > MAX_LINES) {
      return Response.json({ 
        error: `Message has too many lines. Please keep it to ${MAX_LINES} lines or less.` 
      }, { status: 400 });
    }

    // Prepare conversation history (keep last 10 messages)
    const conversationHistory: ChatMessage[] = Array.isArray(history) 
      ? history.slice(-MAX_HISTORY)
      : [];

    // Get AI response
    const response = await getAIResponse({
      message: trimmedMessage,
      name: context?.name,
      weddingMonth: context?.weddingMonth,
      tier: context?.tier,
      daysUntil: context?.daysUntil,
      phase: context?.phase,
      conversationHistory,
    });

    return Response.json({ response });
  } catch (error: any) {
    console.error('[chat-public] Error:', error);
    
    const errorMessage = error.message || 'AI service temporarily unavailable. Please try again.';
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
