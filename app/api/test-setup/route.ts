import { sendEmailOTP } from '@/lib/server/email';
import { getAIResponse } from '@/lib/server/ai';

/**
 * Test route to verify ZeptoMail and Groq configuration
 * 
 * Usage:
 *   Development: GET http://localhost:3000/api/test-setup?secret=test123&email=your@email.com
 *   Production: Protect with SECRET_TEST_KEY environment variable
 * 
 * Tests:
 *   1. Environment variables are set
 *   2. ZeptoMail can send emails
 *   3. Groq AI responds correctly
 */
export async function GET(req: Request) {
  // Basic protection - require secret in production
  const url = new URL(req.url);
  const secret = url.searchParams.get('secret');
  const testEmail = url.searchParams.get('email');
  
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
        example: 'http://localhost:3000/api/test-setup?secret=test123&email=test@example.com'
      }, { status: 400 });
    }
  }

  const results: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    tests: {},
  };

  // Test 1: Check environment variables
  console.log('[test-setup] Checking environment variables...');
  results.tests.env_vars = {
    TOKEN_SECRET: process.env.TOKEN_SECRET ? '✅ Set' : '❌ Missing',
    AWS_SES_SMTP_USERNAME: process.env.AWS_SES_SMTP_USERNAME ? '✅ Set' : '❌ Missing',
    AWS_SES_SMTP_PASSWORD: process.env.AWS_SES_SMTP_PASSWORD ? '✅ Set' : '❌ Missing',
    AWS_SES_SMTP_HOST: process.env.AWS_SES_SMTP_HOST ? '✅ Set' : '❌ Missing',
    AWS_SES_FROM_EMAIL: process.env.AWS_SES_FROM_EMAIL ? '✅ Set' : '❌ Missing',
    GROQ_API_KEY: process.env.GROQ_API_KEY ? '✅ Set' : '❌ Missing',
  };

  // Test 2: AWS SES email sending
  console.log('[test-setup] Testing AWS SES...');
  try {
    if (!process.env.AWS_SES_SMTP_USERNAME || !process.env.AWS_SES_SMTP_PASSWORD) {
      results.tests.aws_ses = {
        status: '⚠️ Skipped',
        reason: 'AWS SES not configured',
        note: 'In dev mode, OTP will be logged to console instead',
        missing: {
          username: !process.env.AWS_SES_SMTP_USERNAME,
          password: !process.env.AWS_SES_SMTP_PASSWORD,
          host: !process.env.AWS_SES_SMTP_HOST,
          from: !process.env.AWS_SES_FROM_EMAIL,
        }
      };
    } else if (!testEmail) {
      results.tests.aws_ses = {
        status: '⚠️ Skipped',
        reason: 'No email provided',
        note: 'Add &email=your@email.com to URL to test email sending'
      };
    } else {
      const testOTP = '123456';
      const emailResult = await sendEmailOTP(testEmail, testOTP);
      
      results.tests.aws_ses = {
        status: '✅ Success',
        email_sent_to: testEmail,
        test_otp: testOTP,
        dev_mode: emailResult.dev || false,
        note: emailResult.dev 
          ? 'Email sending skipped (dev mode), check console logs' 
          : 'Check your email for OTP: 123456'
      };
      console.log('[test-setup] ✅ AWS SES test email sent');
    }
  } catch (error: any) {
    results.tests.aws_ses = {
      status: '❌ Failed',
      error: error.message,
      details: error.toString(),
    };
    console.error('[test-setup] ❌ AWS SES failed:', error);
  }

  // Test 3: Groq AI
  console.log('[test-setup] Testing Groq AI...');
  try {
    if (!process.env.GROQ_API_KEY) {
      results.tests.groq = {
        status: '❌ Failed',
        reason: 'GROQ_API_KEY not configured',
        setup_url: 'https://console.groq.com/'
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
        model: 'gemma2-9b-it',
      };
      console.log('[test-setup] ✅ Groq AI responded in', duration, 'ms');
    }
  } catch (error: any) {
    results.tests.groq = {
      status: '❌ Failed',
      error: error.message,
      details: error.toString(),
      check: 'Verify GROQ_API_KEY is correct at https://console.groq.com/',
    };
    console.error('[test-setup] ❌ Groq failed:', error);
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
      ? '⚠️ Some services not configured (check dev mode)'
      : '❌ Setup incomplete';

  // Instructions
  results.next_steps = [];
  
  if (!process.env.AWS_SES_SMTP_USERNAME || !process.env.AWS_SES_SMTP_PASSWORD) {
    results.next_steps.push({
      service: 'AWS SES',
      action: 'Set up SMTP credentials from AWS SES Console',
      env_vars: ['AWS_SES_SMTP_USERNAME', 'AWS_SES_SMTP_PASSWORD', 'AWS_SES_SMTP_HOST', 'AWS_SES_FROM_EMAIL']
    });
  }
  
  if (!process.env.GROQ_API_KEY) {
    results.next_steps.push({
      service: 'Groq',
      action: 'Get API key from https://console.groq.com/',
      env_var: 'GROQ_API_KEY'
    });
  }

  if (results.next_steps.length === 0) {
    results.next_steps = ['✅ No action needed - all services configured!'];
  }

  console.log('[test-setup] Test complete:', results.overall);
  
  return Response.json(results, { 
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    }
  });
}
