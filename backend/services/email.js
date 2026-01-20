// KYWARD EMAIL SERVICE
// Handles sending emails via SMTP or Resend API

const nodemailer = require('nodemailer');

// Create transporter based on environment
let transporter = null;

// Detect which email provider to use
const EMAIL_PROVIDER = process.env.RESEND_API_KEY ? 'resend' :
                       process.env.SMTP_HOST ? 'smtp' : 'none';

// Log email configuration status at startup
function logSmtpConfig() {
  console.log('\n📧 Email Configuration:');
  console.log('  Provider:', EMAIL_PROVIDER.toUpperCase());

  if (EMAIL_PROVIDER === 'resend') {
    console.log('  RESEND_API_KEY:', process.env.RESEND_API_KEY ? `${process.env.RESEND_API_KEY.substring(0, 8)}... (set)` : '(not set)');
    console.log('  EMAIL_FROM:', process.env.EMAIL_FROM || process.env.SMTP_FROM || 'Kyward <noreply@kyward.io> (default)');
  } else if (EMAIL_PROVIDER === 'smtp') {
    console.log('  SMTP_HOST:', process.env.SMTP_HOST || '(not set)');
    console.log('  SMTP_PORT:', process.env.SMTP_PORT || '587 (default)');
    console.log('  SMTP_USER:', process.env.SMTP_USER ? `${process.env.SMTP_USER.substring(0, 3)}...` : '(not set)');
    console.log('  SMTP_PASS:', process.env.SMTP_PASS ? '****** (set)' : '(not set)');
    console.log('  SMTP_FROM:', process.env.SMTP_FROM || 'Kyward <noreply@kyward.io> (default)');
    console.log('  SMTP_SECURE:', process.env.SMTP_SECURE || 'false (default)');
  } else {
    console.log('  ⚠️ No email provider configured - emails will be logged to console');
  }
}

// Call on module load
logSmtpConfig();

// ============================================
// RESEND API (HTTP-based, more reliable on cloud)
// ============================================
async function sendViaResend(to, subject, html) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || process.env.SMTP_FROM || 'Kyward <noreply@kyward.io>';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Resend API error:', data);
      return { success: false, error: data.message || 'Resend API error' };
    }

    console.log('✅ Email sent via Resend:', data.id);
    return { success: true, messageId: data.id };

  } catch (error) {
    console.error('❌ Resend error:', error.message);
    return { success: false, error: error.message };
  }
}

// ============================================
// SMTP (traditional)
// ============================================
function getTransporter() {
  if (transporter) return transporter;

  // Check if SMTP is configured
  if (!process.env.SMTP_HOST) {
    return null;
  }

  console.log('📧 Creating SMTP transporter...');

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    // Add timeout and debug options
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
  });

  return transporter;
}

// Verify connection (SMTP or Resend)
async function verifySmtpConnection() {
  if (EMAIL_PROVIDER === 'resend') {
    // Test Resend by checking API key validity
    try {
      const response = await fetch('https://api.resend.com/domains', {
        headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}` }
      });
      if (response.ok) {
        console.log('✅ Resend API connection verified');
        return { success: true, message: 'Resend API verified' };
      }
      return { success: false, error: 'Invalid Resend API key' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  if (EMAIL_PROVIDER === 'smtp') {
    const transport = getTransporter();
    if (!transport) {
      return { success: false, error: 'SMTP not configured' };
    }

    try {
      await transport.verify();
      console.log('✅ SMTP connection verified successfully');
      return { success: true, message: 'SMTP connection verified' };
    } catch (error) {
      console.error('❌ SMTP verification failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  return { success: false, error: 'No email provider configured' };
}

/**
 * Send payment confirmation email
 */
async function sendPaymentConfirmation(toEmail, plan, pdfPassword) {
  const planNames = {
    essential: 'Essential Plan',
    sentinel: 'Sentinel Plan',
    consultation: 'Consultation'
  };
  const planName = planNames[plan] || 'Premium Plan';

  const subject = `Kyward - Your ${planName} is Ready!`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 40px; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; }
    .header { background: #F7931A; padding: 30px; text-align: center; }
    .header h1 { color: #000; margin: 0; font-size: 28px; }
    .body { padding: 40px; }
    .body h2 { color: #333; margin-top: 0; }
    .body p { color: #666; line-height: 1.6; }
    .password-box { background: #fff7ed; border: 2px solid #F7931A; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
    .password { font-family: monospace; font-size: 28px; color: #F7931A; font-weight: bold; letter-spacing: 3px; }
    .warning { background: #fee; border: 1px solid #fcc; border-radius: 8px; padding: 16px; margin: 24px 0; }
    .warning p { color: #c00; margin: 0; font-size: 14px; }
    .button { display: inline-block; background: #F7931A; color: #000; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px; }
    .footer { background: #f8f8f8; padding: 24px; text-align: center; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>KYWARD</h1>
    </div>
    <div class="body">
      <h2>Payment Confirmed!</h2>
      <p>Thank you for upgrading to the <strong>${planName}</strong>.</p>
      <p>Your personalized Bitcoin Security & Inheritance Plan is now ready.</p>

      <div class="password-box">
        <p style="margin: 0 0 12px 0; color: #666;">Your PDF Password:</p>
        <div class="password">${pdfPassword}</div>
        <p style="margin: 12px 0 0 0; color: #888; font-size: 13px;">Save this password securely</p>
      </div>

      <div class="warning">
        <p><strong>Important:</strong> This password is required to open your security plan PDF. Store it separately from the PDF itself.</p>
      </div>

      <p>What's included in your plan:</p>
      <ul style="color: #666;">
        <li>Complete security score breakdown</li>
        <li>All personalized recommendations</li>
        <li>Sparrow Wallet setup guide</li>
        <li>Multi-signature configuration</li>
        <li>Liana inheritance strategy</li>
        <li>Step-by-step action plan</li>
      </ul>

      <p>Log in to your account to download your PDF report:</p>
      <a href="${process.env.FRONTEND_URL || 'https://kyward.io'}" class="button">Go to Kyward</a>
    </div>
    <div class="footer">
      <p>KYWARD - Bitcoin Security Made Simple</p>
      <p>This email was sent to ${toEmail}</p>
      <p>Never share your seed phrase or this password with anyone.</p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail(toEmail, subject, html);
}

/**
 * Send security plan email with PDF
 */
async function sendSecurityPlan(toEmail, pdfPassword, htmlContent) {
  const subject = 'Your Kyward Security & Inheritance Plan';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 40px; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; }
    .header { background: #F7931A; padding: 30px; text-align: center; }
    .header h1 { color: #000; margin: 0; }
    .body { padding: 40px; }
    .password-box { background: #fff7ed; border: 2px solid #F7931A; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
    .password { font-family: monospace; font-size: 28px; color: #F7931A; font-weight: bold; }
    .footer { background: #f8f8f8; padding: 24px; text-align: center; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>KYWARD</h1>
    </div>
    <div class="body">
      <h2>Your Security Plan is Attached</h2>
      <p>Your complete Bitcoin Security & Inheritance Plan is attached to this email.</p>

      <div class="password-box">
        <p style="margin: 0 0 12px 0; color: #666;">PDF Password:</p>
        <div class="password">${pdfPassword}</div>
      </div>

      <p><strong>Important:</strong> Store this password securely. You'll need it to open the PDF.</p>
    </div>
    <div class="footer">
      <p>KYWARD - Bitcoin Security Made Simple</p>
      <p>Never share your seed phrase with anyone.</p>
    </div>
  </div>
</body>
</html>
  `;

  // Note: In production, attach the PDF file
  return sendEmail(toEmail, subject, html);
}

/**
 * Core email sending function
 */
async function sendEmail(to, subject, html) {
  console.log('📧 Attempting to send email to:', to);
  console.log('📧 Email provider:', EMAIL_PROVIDER);

  // Use Resend if configured (preferred for cloud platforms)
  if (EMAIL_PROVIDER === 'resend') {
    return await sendViaResend(to, subject, html);
  }

  // Use SMTP if configured
  if (EMAIL_PROVIDER === 'smtp') {
    const transport = getTransporter();

    try {
      console.log('📧 Sending via SMTP:', process.env.SMTP_HOST);
      const result = await transport.sendMail({
        from: process.env.SMTP_FROM || 'Kyward <noreply@kyward.io>',
        to,
        subject,
        html
      });

      console.log('✅ Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };

    } catch (error) {
      console.error('❌ SMTP error:', error.message);
      console.error('Full error:', error);
      return { success: false, error: error.message };
    }
  }

  // No provider configured - log to console
  console.log('\n========== EMAIL (not sent - no provider configured) ==========');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('Configure RESEND_API_KEY or SMTP_HOST in environment to enable emails');
  console.log('================================================================\n');
  return { success: true, demo: true, message: 'No email provider configured' };
}

module.exports = {
  sendPaymentConfirmation,
  sendSecurityPlan,
  sendEmail,
  verifySmtpConnection,
  logSmtpConfig
};
