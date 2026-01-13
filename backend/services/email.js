// KYWARD EMAIL SERVICE
// Handles sending emails via SMTP

const nodemailer = require('nodemailer');

// Create transporter based on environment
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  // Check if SMTP is configured
  if (!process.env.SMTP_HOST) {
    console.warn('SMTP not configured - emails will be logged to console');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  return transporter;
}

/**
 * Send payment confirmation email
 */
async function sendPaymentConfirmation(toEmail, plan, pdfPassword) {
  const planName = plan === 'complete' ? 'Complete Plan' : 'Consultation';

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
  const transport = getTransporter();

  // If no SMTP configured, log to console
  if (!transport) {
    console.log('\n========== EMAIL (not sent - SMTP not configured) ==========');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('=============================================================\n');
    return { success: true, demo: true };
  }

  try {
    const result = await transport.sendMail({
      from: process.env.SMTP_FROM || 'Kyward <noreply@kyward.io>',
      to,
      subject,
      html
    });

    console.log('Email sent:', result.messageId);
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendPaymentConfirmation,
  sendSecurityPlan,
  sendEmail
};
