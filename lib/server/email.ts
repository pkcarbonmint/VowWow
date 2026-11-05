import nodemailer from 'nodemailer';

export async function sendEmailOTP(email: string, otp: string) {
  // Check if AWS SES is configured
  const smtpUsername = process.env.AWS_SES_SMTP_USERNAME;
  const smtpPassword = process.env.AWS_SES_SMTP_PASSWORD;
  const smtpHost = process.env.AWS_SES_SMTP_HOST;
  const smtpPort = process.env.AWS_SES_SMTP_PORT || '587';
  const fromEmail = process.env.AWS_SES_FROM_EMAIL;
  const fromName = process.env.AWS_SES_FROM_NAME || 'WeddingWell';
  
  if (!smtpUsername || !smtpPassword || !smtpHost || !fromEmail) {
    console.warn('[email] AWS SES not configured, OTP for', email, ':', otp);
    console.warn('[email] Missing:', {
      username: !smtpUsername ? 'AWS_SES_SMTP_USERNAME' : '✓',
      password: !smtpPassword ? 'AWS_SES_SMTP_PASSWORD' : '✓',
      host: !smtpHost ? 'AWS_SES_SMTP_HOST' : '✓',
      from: !fromEmail ? 'AWS_SES_FROM_EMAIL' : '✓',
    });
    return { success: true, dev: true };
  }

  try {
    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: false, // Use TLS
      auth: {
        user: smtpUsername,
        pass: smtpPassword,
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: email,
      subject: 'Your WeddingWell login code',
      html: `
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
      `,
    });

    console.log('[email] AWS SES sent:', info.messageId);
    return { success: true, dev: false };
  } catch (error) {
    console.error('[email] AWS SES send failed:', error);
    throw error;
  }
}
