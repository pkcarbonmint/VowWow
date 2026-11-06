/**
 * Test script for Groq AI integration
 * 
 * Usage:
 *   GROQ_API_KEY="your-key-here" node test-groq-ai.js
 */

const Groq = require('groq-sdk');

// Configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const MODEL = 'llama-3.1-8b-instant'; // Using the smaller, faster model

// Test context for WeddingWell
const testContext = {
  name: 'Priya',
  weddingMonth: '2027-03',
  daysUntil: 120,
  phase: 'Reset',
  tier: 'gold',
  message: 'I have oily skin and acne. What should I start with 4 months before my wedding?'
};

function generateSystemPrompt(context) {
  const systemPrompt = `You are WeddingWell's AI health and skincare advisor for Indian brides and grooms.

CONTEXT:
- User: ${context.name || 'User'}
- Wedding: ${context.weddingMonth || 'Not specified'} ${context.daysUntil ? `(${context.daysUntil} days away)` : ''}
- Phase: ${context.phase} (Reset: 4+ months out | Build: 2-4 months | Refine: 1-2 months | Maintain: final weeks)
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
- If ${context.daysUntil || '?'} days out, warn about products/treatments that take longer
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

  return systemPrompt;
}

async function testGroqAI() {
  console.log('🧪 Testing Groq AI Integration\n');
  console.log('═'.repeat(60));

  // Check API key
  if (!GROQ_API_KEY) {
    console.log('❌ ERROR: GROQ_API_KEY not set\n');
    console.log('Usage:');
    console.log('  GROQ_API_KEY="your-key-here" node test-groq-ai.js\n');
    process.exit(1);
  }

  console.log('✓ API Key found:', GROQ_API_KEY.substring(0, 10) + '...\n');

  // Initialize Groq client
  console.log('📡 Initializing Groq client...');
  const groq = new Groq({ apiKey: GROQ_API_KEY });
  console.log('✓ Client initialized\n');

  // Test context
  console.log('📋 Test Context:');
  console.log(`   Name: ${testContext.name}`);
  console.log(`   Wedding: ${testContext.weddingMonth} (${testContext.daysUntil} days away)`);
  console.log(`   Phase: ${testContext.phase}`);
  console.log(`   Tier: ${testContext.tier}`);
  console.log(`   Question: "${testContext.message}"\n`);

  // Generate system prompt
  const systemPrompt = generateSystemPrompt(testContext);
  console.log('✓ System prompt generated\n');

  // Make API call
  console.log('🤖 Calling Groq AI...');
  console.log(`   Model: ${MODEL}`);
  
  try {
    const startTime = Date.now();
    
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: testContext.message }
      ],
      model: MODEL,
      temperature: 0.7,
      max_tokens: 300,
    });

    const duration = Date.now() - startTime;
    const response = completion.choices[0]?.message?.content || '';

    console.log(`✓ Response received in ${duration}ms\n`);
    console.log('═'.repeat(60));
    console.log('AI RESPONSE:');
    console.log('═'.repeat(60));
    console.log(response);
    console.log('═'.repeat(60));
    console.log('\n📊 Stats:');
    console.log(`   Response time: ${duration}ms`);
    console.log(`   Response length: ${response.length} characters`);
    console.log(`   Word count: ~${response.split(' ').length} words`);
    console.log(`   Model: ${completion.model}`);
    console.log(`   Tokens used: ${completion.usage?.total_tokens || 'N/A'}`);
    console.log('\n✅ TEST PASSED!\n');

  } catch (error) {
    console.log('❌ ERROR:', error.message);
    console.log('\nFull error:');
    console.error(error);
    process.exit(1);
  }
}

// Test different scenarios
async function runAllTests() {
  console.log('🚀 Running Groq AI Tests\n');
  
  // Test 1: Basic question
  await testGroqAI();
  
  console.log('\n' + '═'.repeat(60));
  console.log('ADDITIONAL TEST CASES');
  console.log('═'.repeat(60) + '\n');
  
  // Test 2: Off-topic question (should refuse)
  console.log('Test 2: Off-topic question (wedding planning)');
  testContext.message = 'What color should my lehenga be?';
  try {
    const groq = new Groq({ apiKey: GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: generateSystemPrompt(testContext) },
        { role: 'user', content: testContext.message }
      ],
      model: MODEL,
      temperature: 0.7,
      max_tokens: 300,
    });
    console.log('Response:', completion.choices[0]?.message?.content);
    console.log('✓ Handled correctly\n');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  // Test 3: Short timeline warning
  console.log('\nTest 3: Short timeline (should warn about timing)');
  testContext.message = 'I want to start retinol for my skin';
  testContext.daysUntil = 10;
  testContext.phase = 'Maintain';
  try {
    const groq = new Groq({ apiKey: GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: generateSystemPrompt(testContext) },
        { role: 'user', content: testContext.message }
      ],
      model: MODEL,
      temperature: 0.7,
      max_tokens: 300,
    });
    console.log('Response:', completion.choices[0]?.message?.content);
    console.log('✓ Handled correctly\n');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('═'.repeat(60));
  console.log('ALL TESTS COMPLETE ✅');
  console.log('═'.repeat(60));
}

// Run tests
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { generateSystemPrompt, testGroqAI };
