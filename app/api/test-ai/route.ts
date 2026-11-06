import { getAIResponse } from '@/lib/server/ai';

/**
 * Test route to verify Groq AI configuration
 * 
 * Usage:
 *   Development: GET http://localhost:3000/api/test-ai?secret=test123
 *   Production: Protect with SECRET_TEST_KEY environment variable
 * 
 * Tests:
 *   1. Environment variable is set
 *   2. Groq AI responds correctly
 */
export async function GET(req: Request) {
  // Basic protection - require secret in production
  const url = new URL(req.url);
  const secret = url.searchParams.get('secret');
  
  // In production, require SECRET_TEST_KEY environment variable
  if (process.env.NODE_ENV === 'production') {
    const expectedSecret = process.env.SECRET_TEST_KEY;
    if (!expectedSecret || secret !== expectedSecret) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } else {
    // In development, just require any secret param
    if (!secret) {
      return Response.json({ 
        error: 'Add ?secret=test123 to URL',
        example: 'http://localhost:3000/api/test-ai?secret=test123'
      }, { status: 400 });
    }
  }

  const results: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    tests: {},
  };

  // Test 1: Check environment variable
  console.log('[test-ai] Checking environment variables...');
  results.tests.env_vars = {
    GROQ_API_KEY: process.env.GROQ_API_KEY ? '✅ Set' : '❌ Missing',
  };

  // Test 2: Test Groq AI
  console.log('[test-ai] Testing Groq AI...');
  try {
    if (!process.env.GROQ_API_KEY) {
      results.tests.groq = {
        status: '❌ Failed',
        reason: 'GROQ_API_KEY not configured',
        setup_url: 'https://console.groq.com'
      };
    } else {
      const startTime = Date.now();
      const aiResponse = await getAIResponse({
        message: 'I have oily skin. Give me one tip in 10 words or less.',
        name: 'Test User',
        weddingMonth: '2027-03',
        tier: 'gold',
        daysUntil: 120,
        phase: 'Reset',
      });
      const duration = Date.now() - startTime;

      results.tests.groq = {
        status: '✅ Success',
        response_time_ms: duration,
        response_preview: aiResponse.substring(0, 100) + (aiResponse.length > 100 ? '...' : ''),
        full_response: aiResponse,
        model: 'openai/gpt-oss-120b',
      };
      console.log('[test-ai] ✅ Groq AI responded in', duration, 'ms');
    }
  } catch (error: any) {
    results.tests.groq = {
      status: '❌ Failed',
      error: error.message,
      details: error.toString(),
      check: 'Verify GROQ_API_KEY is correct at https://console.groq.com',
    };
    console.error('[test-ai] ❌ Groq failed:', error);
  }

  // Test 3: Test off-topic refusal
  console.log('[test-ai] Testing off-topic handling...');
  try {
    if (process.env.GROQ_API_KEY) {
      const startTime = Date.now();
      const aiResponse = await getAIResponse({
        message: 'What color should my wedding dress be?',
        name: 'Test User',
        weddingMonth: '2027-03',
        tier: 'gold',
      });
      const duration = Date.now() - startTime;

      const refusedCorrectly = aiResponse.toLowerCase().includes('can\'t') || 
                               aiResponse.toLowerCase().includes('cannot') ||
                               aiResponse.toLowerCase().includes('don\'t') ||
                               aiResponse.toLowerCase().includes('sorry');

      results.tests.off_topic_refusal = {
        status: refusedCorrectly ? '✅ Success' : '⚠️ Warning',
        response_time_ms: duration,
        response_preview: aiResponse.substring(0, 100) + (aiResponse.length > 100 ? '...' : ''),
        refused_correctly: refusedCorrectly,
        note: refusedCorrectly ? 'AI correctly refused wedding planning question' : 'AI may not be refusing correctly'
      };
      console.log('[test-ai] ✅ Off-topic test completed in', duration, 'ms');
    }
  } catch (error: any) {
    results.tests.off_topic_refusal = {
      status: '❌ Failed',
      error: error.message,
    };
    console.error('[test-ai] ❌ Off-topic test failed:', error);
  }

  // Test 4: Test timing warning
  console.log('[test-ai] Testing timing warnings...');
  try {
    if (process.env.GROQ_API_KEY) {
      const startTime = Date.now();
      const aiResponse = await getAIResponse({
        message: 'Should I start using retinol?',
        name: 'Test User',
        daysUntil: 7,
        phase: 'Maintain',
      });
      const duration = Date.now() - startTime;

      const warnedCorrectly = aiResponse.toLowerCase().includes('warning') || 
                              aiResponse.toLowerCase().includes('avoid') ||
                              aiResponse.toLowerCase().includes('not recommend') ||
                              aiResponse.toLowerCase().includes('too close') ||
                              aiResponse.toLowerCase().includes('risky');

      results.tests.timing_warning = {
        status: warnedCorrectly ? '✅ Success' : '⚠️ Warning',
        response_time_ms: duration,
        response_preview: aiResponse.substring(0, 100) + (aiResponse.length > 100 ? '...' : ''),
        warned_correctly: warnedCorrectly,
        note: warnedCorrectly ? 'AI correctly warned about timing' : 'AI may not be warning about timing'
      };
      console.log('[test-ai] ✅ Timing test completed in', duration, 'ms');
    }
  } catch (error: any) {
    results.tests.timing_warning = {
      status: '❌ Failed',
      error: error.message,
    };
    console.error('[test-ai] ❌ Timing test failed:', error);
  }

  // Overall status
  const allPassed = Object.values(results.tests).every((test: any) => 
    test.status?.startsWith('✅')
  );
  const someWarnings = Object.values(results.tests).some((test: any) => 
    test.status?.startsWith('⚠️')
  );

  results.overall = allPassed 
    ? '✅ All systems operational' 
    : someWarnings 
      ? '⚠️ Some tests have warnings (check details)'
      : '❌ Setup incomplete';

  // Instructions
  results.next_steps = [];
  
  if (!process.env.GROQ_API_KEY) {
    results.next_steps.push({
      service: 'Groq AI',
      action: 'Get API key from https://console.groq.com',
      env_var: 'GROQ_API_KEY'
    });
  }

  if (results.next_steps.length === 0) {
    results.next_steps = ['✅ No action needed - all services configured!'];
  }

  console.log('[test-ai] Test complete:', results.overall);
  
  return Response.json(results, { 
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    }
  });
}
