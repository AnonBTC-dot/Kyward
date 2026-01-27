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
 * Send payment confirmation email - customized per plan type
 * @param {string} toEmail - Recipient email
 * @param {string} plan - Plan type: essential, sentinel, consultation, consultation_additional
 * @param {string} language - Language: 'en' or 'es' (default: 'en')
 */
async function sendPaymentConfirmation(toEmail, plan, language = 'en') {
  const frontendUrl = process.env.FRONTEND_URL || 'https://kyward.com';
  const calendarUrl = process.env.CALENDAR_URL || 'https://calendly.com/leomr20-proton/30min';

  // Import translations from external file
  const { getPlanContent, getCommonTranslations } = require('./emailTranslations');

  // Get translated content
  const content = getPlanContent(plan, language);
  const common = getCommonTranslations(language);

  // Set URLs based on plan type
  const ctaUrl = content.showCalendar ? calendarUrl : frontendUrl;

  const subject = `Kyward - ${content.subject}`;

  // Build features list HTML
  const featuresHtml = content.features.map(f => `<li>${f}</li>`).join('\n        ');

  // Build badge HTML if exists
  const badgeHtml = content.badge
    ? `<span style="display: inline-block; background: #22c55e; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-left: 12px;">${content.badge}</span>`
    : '';

  // Build calendar section for consultations (translated)
  const calendarSection = content.showCalendar ? `
      <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 1px solid #F7931A; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
        <p style="color: #F7931A; font-size: 18px; font-weight: 600; margin: 0 0 8px 0;">📅 ${common.scheduleSession}</p>
        <p style="color: #9ca3af; margin: 0 0 16px 0; font-size: 14px;">${common.scheduleSubtitle}</p>
        <a href="${calendarUrl}" style="display: inline-block; background: #F7931A; color: #000; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">${content.ctaText}</a>
      </div>
  ` : '';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; margin: 0; padding: 40px; }
    .container { max-width: 600px; margin: 0 auto; background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%); border-radius: 16px; overflow: hidden; border: 1px solid #2a2a2a; }
    .header { background: linear-gradient(135deg, #F7931A 0%, #f5a623 100%); padding: 40px; text-align: center; }
    .header h1 { color: #000; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: 2px; }
    .body { padding: 40px; }
    .body h2 { color: #fff; margin-top: 0; font-size: 28px; display: flex; align-items: center; flex-wrap: wrap; }
    .body p { color: #9ca3af; line-height: 1.7; font-size: 15px; }
    .features-box { background: rgba(247, 147, 26, 0.1); border: 1px solid rgba(247, 147, 26, 0.3); border-radius: 12px; padding: 24px; margin: 24px 0; }
    .features-box h3 { color: #F7931A; margin: 0 0 16px 0; font-size: 16px; }
    .features-box ul { margin: 0; padding-left: 20px; }
    .features-box li { color: #d1d5db; margin-bottom: 8px; font-size: 14px; }
    .button { display: inline-block; background: #F7931A; color: #000; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: 700; margin-top: 16px; font-size: 15px; }
    .button:hover { background: #f5a623; }
    .footer { background: #0a0a0a; padding: 24px; text-align: center; border-top: 1px solid #2a2a2a; }
    .footer p { color: #6b7280; font-size: 12px; margin: 4px 0; }
    .success-icon { font-size: 48px; margin-bottom: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>KYWARD</h1>
    </div>
    <div class="body">
      <div class="success-icon">✅</div>
      <h2>${content.headline}${badgeHtml}</h2>
      <p>${content.intro}</p>
      <p>${content.description}</p>

      <div class="features-box">
        <h3>${common.whatsIncluded}</h3>
        <ul>
        ${featuresHtml}
        </ul>
      </div>

      ${calendarSection}

      ${!content.showCalendar ? `
      <div style="text-align: center; margin-top: 32px;">
        <a href="${ctaUrl}" class="button">${content.ctaText}</a>
      </div>
      ` : ''}

      <p style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #2a2a2a; font-size: 13px; color: #6b7280;">
        ${common.questions} <a href="mailto:contact@kyward.com" style="color: #F7931A;">contact@kyward.com</a>
      </p>
    </div>
    <div class="footer">
      <p style="color: #F7931A; font-weight: 600;">KYWARD - ${common.footer}</p>
      <p>${common.footerEmail} ${toEmail}</p>
      <p>${common.footerWarning}</p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail(toEmail, subject, html);
}

/**
 * Send security plan email with PDF attachment
 */
async function sendSecurityPlanWithPdf(toEmail, pdfPassword, score, recommendations) {
  const pdfService = require('./pdf');

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
    .password { font-family: monospace; font-size: 28px; color: #F7931A; font-weight: bold; letter-spacing: 3px; }
    .warning { background: #fee; border: 1px solid #fcc; border-radius: 8px; padding: 16px; margin: 24px 0; }
    .warning p { color: #c00; margin: 0; font-size: 14px; }
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
      <p>Your complete Bitcoin Security & Inheritance Plan (Score: ${score}/100) is attached to this email as a password-protected PDF.</p>

      <div class="password-box">
        <p style="margin: 0 0 12px 0; color: #666;">PDF Password:</p>
        <div class="password">${pdfPassword}</div>
        <p style="margin: 12px 0 0 0; color: #888; font-size: 13px;">You need this password to open the PDF</p>
      </div>

      <div class="warning">
        <p><strong>Important:</strong> Store this password separately from the PDF. Never share your seed phrase with anyone.</p>
      </div>

      <p>The attached PDF includes:</p>
      <ul style="color: #666;">
        <li>Your security score and analysis</li>
        <li>Personalized recommendations</li>
        <li>Sparrow Wallet setup guide</li>
        <li>Multi-signature configuration</li>
        <li>Liana inheritance strategy</li>
        <li>Security checklist</li>
      </ul>
    </div>
    <div class="footer">
      <p>KYWARD - Bitcoin Security Made Simple</p>
      <p>This email was sent to ${toEmail}</p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    // Generate password-protected PDF
    console.log('📄 Generating PDF for', toEmail);
    const pdfBuffer = await pdfService.generateSecurityPlanPdf(
      { email: toEmail },
      score,
      recommendations,
      pdfPassword
    );
    console.log('📄 PDF generated, size:', pdfBuffer.length, 'bytes');

    // Send with attachment
    return await sendEmailWithAttachment(toEmail, subject, html, {
      filename: `kyward-security-plan-${new Date().toISOString().split('T')[0]}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf'
    });

  } catch (error) {
    console.error('❌ Failed to generate/send PDF:', error);
    // Fallback: send without PDF
    return await sendEmail(toEmail, subject, html);
  }
}

/**
 * Send security plan email without PDF (legacy)
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

/**
 * Send email with PDF attachment
 */
async function sendEmailWithAttachment(to, subject, html, attachment) {
  console.log('📧 Attempting to send email with attachment to:', to);
  console.log('📧 Email provider:', EMAIL_PROVIDER);
  console.log('📎 Attachment:', attachment.filename, '(', attachment.content.length, 'bytes)');

  // Use Resend if configured
  if (EMAIL_PROVIDER === 'resend') {
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
          html,
          attachments: [{
            filename: attachment.filename,
            content: attachment.content.toString('base64')
          }]
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Resend API error:', data);
        return { success: false, error: data.message || 'Resend API error' };
      }

      console.log('✅ Email with attachment sent via Resend:', data.id);
      return { success: true, messageId: data.id };

    } catch (error) {
      console.error('❌ Resend error:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Use SMTP if configured
  if (EMAIL_PROVIDER === 'smtp') {
    const transport = getTransporter();

    try {
      console.log('📧 Sending with attachment via SMTP:', process.env.SMTP_HOST);
      const result = await transport.sendMail({
        from: process.env.SMTP_FROM || 'Kyward <noreply@kyward.io>',
        to,
        subject,
        html,
        attachments: [{
          filename: attachment.filename,
          content: attachment.content,
          contentType: attachment.contentType || 'application/pdf'
        }]
      });

      console.log('✅ Email with attachment sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };

    } catch (error) {
      console.error('❌ SMTP error:', error.message);
      return { success: false, error: error.message };
    }
  }

  // No provider configured
  console.log('\n========== EMAIL WITH ATTACHMENT (not sent) ==========');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('Attachment:', attachment.filename);
  console.log('======================================================\n');
  return { success: true, demo: true, message: 'No email provider configured' };
}

/**
 * Send email with PDF attachment (PDF generated by frontend)
 * Note: PDF encryption removed due to native dependency issues on cloud platforms
 */
async function sendEmailWithPdfAttachment(toEmail, pdfPassword, score, pdfBuffer) {
  const subject = 'Your Kyward Security & Inheritance Plan';

  console.log('📧 Preparing email with PDF attachment for:', toEmail);
  console.log('📄 PDF size:', pdfBuffer.length, 'bytes');

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
    .password { font-family: monospace; font-size: 28px; color: #F7931A; font-weight: bold; letter-spacing: 3px; }
    .warning { background: #fee; border: 1px solid #fcc; border-radius: 8px; padding: 16px; margin: 24px 0; }
    .warning p { color: #c00; margin: 0; font-size: 14px; }
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
      <p>Your complete Bitcoin Security & Inheritance Plan (Score: ${score}/100) is attached to this email.</p>

      <div class="password-box">
        <p style="margin: 0 0 12px 0; color: #666;">Your Kyward Password:</p>
        <div class="password">${pdfPassword}</div>
        <p style="margin: 12px 0 0 0; color: #888; font-size: 13px;">Save this password securely for future reference</p>
      </div>

      <div class="warning">
        <p><strong>Important:</strong> Store this password in a secure location. Never share your seed phrase with anyone.</p>
      </div>

      <p>The attached PDF includes:</p>
      <ul style="color: #666;">
        <li>Your security score and analysis</li>
        <li>Personalized recommendations</li>
        <li>Sparrow Wallet setup guide</li>
        <li>Multi-signature configuration</li>
        <li>Liana inheritance strategy</li>
        <li>Security checklist</li>
      </ul>
    </div>
    <div class="footer">
      <p>KYWARD - Bitcoin Security Made Simple</p>
      <p>This email was sent to ${toEmail}</p>
    </div>
  </div>
</body>
</html>
  `;

  return await sendEmailWithAttachment(toEmail, subject, html, {
    filename: `kyward-security-plan-${new Date().toISOString().split('T')[0]}.pdf`,
    content: pdfBuffer,
    contentType: 'application/pdf'
  });
}

module.exports = {
  sendPaymentConfirmation,
  sendSecurityPlan,
  sendEmailWithPdfAttachment,
  sendEmail,
  sendEmailWithAttachment,
  verifySmtpConnection,
  logSmtpConfig
};
