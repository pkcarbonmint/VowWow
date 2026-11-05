export async function sendEmailOTP(email: string, otp: string) {
  const token = process.env.ZEPTOMAIL_TOKEN;
  const bounceAddress = process.env.ZEPTOMAIL_BOUNCE_ADDRESS || 'noreply@bounce.zeptomail.in';
  
  if (!token) {
    console.warn('[email] ZeptoMail not configured, OTP for', email, ':', otp);
    return { success: true, dev: true };
  }

  try {
    const response = await fetch('https://api.zeptomail.in/v1.1/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({
        from: {
          address: bounceAddress,
          name: 'WeddingWell'
        },
        to: [
          {
            email_address: {
              address: email,
              name: ''
            }
          }
        ],
        subject: 'Your WeddingWell login code',
        htmlbody: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2d5a3d; margin-bottom: 20px;">Your login code</h2>
            <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2d5a3d; margin: 30px 0; text-align: center;">
              ${otp}
            </p>
            <p style="color: #666; margin-bottom: 10px;">This code is valid for 5 minutes.</p>
            <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
              If you didn't request this code, please ignore this email.
            </p>
          </div>
        `
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[email] ZeptoMail failed:', error);
      throw new Error(`ZeptoMail failed: ${response.status}`);
    }

    return { success: true, dev: false };
  } catch (error) {
    console.error('[email] Send failed:', error);
    throw error;
  }
}
