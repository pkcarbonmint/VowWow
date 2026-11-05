import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type AIContext = {
  message: string;
  name?: string;
  weddingMonth?: string;
  tier?: string;
  daysUntil?: number;
  phase?: string;
  conversationHistory?: ChatMessage[];
};

function calculateDaysUntil(weddingMonth?: string): number | undefined {
  if (!weddingMonth) return undefined;
  
  try {
    const [year, month] = weddingMonth.split('-').map(Number);
    // Assume mid-month (15th)
    const weddingDate = new Date(year, month - 1, 15);
    const now = new Date();
    const diff = weddingDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  } catch {
    return undefined;
  }
}

function getPhase(days?: number): string {
  if (!days || days < 0) return 'Planning';
  if (days >= 120) return 'Reset';      // 4+ months
  if (days >= 60) return 'Build';       // 2-4 months
  if (days >= 30) return 'Refine';      // 1-2 months
  return 'Maintain';                     // <1 month
}

export async function getAIResponse(context: AIContext): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const daysUntil = context.daysUntil ?? calculateDaysUntil(context.weddingMonth);
  const phase = context.phase ?? getPhase(daysUntil);

  const systemPrompt = `You are WeddingWell's AI health and skincare advisor for Indian brides and grooms.

CONTEXT:
- User: ${context.name || 'User'}
- Wedding: ${context.weddingMonth || 'Not specified'} ${daysUntil ? `(${daysUntil} days away)` : ''}
- Phase: ${phase} (Reset: 4+ months out | Build: 2-4 months | Refine: 1-2 months | Maintain: final weeks)
- Interest: ${context.tier || 'Not specified'} tier (Silver ₹18k / Gold ₹45k / Platinum ₹90k)

YOU ONLY HELP WITH:
- Skincare (acne, pigmentation, dullness, dark circles, dermatology treatments)
- Health & wellness (nutrition, energy, sleep, stress management, hormones)
- Fitness (exercise routines, weight management)
- Hair care for weddings
- Pre-wedding beauty timeline planning
- Indian wedding-specific advice (climate, multi-day functions, traditional makeup)

YOU REFUSE (politely redirect):
- Wedding planning (venues, decorators, outfits, invitations)
- Relationship or family advice
- Medical diagnosis (always say "consult your doctor for diagnosis")
- General chitchat or off-topic questions

TIMING AWARENESS:
- If ${daysUntil ? daysUntil : '?'} days out, warn about products/treatments that take longer
- NEVER recommend new skincare within 2 weeks of wedding (risk of reactions)
- Consider Indian climate (humidity, summer heat) in advice

TONE:
- Friendly, supportive, knowledgeable (like a helpful friend)
- Use their name (${context.name || 'User'}) occasionally
- Be specific and actionable (not generic advice)
- Mention WeddingWell packages when truly relevant (soft CTA, not pushy)

IMPORTANT RULES:
- Keep responses under 150 words (concise and scannable)
- Be specific to Indian context (products available, skin types, climate)
- Always consider timeline safety
- Never diagnose medical conditions`;

  const messages: Array<{role: 'system' | 'user' | 'assistant', content: string}> = [
    { role: 'system', content: systemPrompt },
    ...(context.conversationHistory || []),
    { role: 'user', content: context.message }
  ];

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 300,
      },
    });

    // Convert messages to Gemini format
    const chat = model.startChat({
      history: messages.slice(0, -1).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage(messages[messages.length - 1].content);
    const response = result.response.text();
    
    return response.trim();
  } catch (error: any) {
    console.error('[ai] Gemini error:', error);
    
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      throw new Error('AI service is busy. Please try again in a moment.');
    }
    
    throw new Error('AI service temporarily unavailable. Please try again.');
  }
}
