// KYWARD EMAIL SERVICE
// Handles sending PDF reports via email using backend API

import { generatePdfContent } from './PdfGenerator';
import { kywardDB } from './Database';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Send email via backend API
const sendViaBackend = async (toEmail, pdfPassword, htmlContent) => {
  try {
    const token = kywardDB.getToken();

    const response = await fetch(`${API_URL}/email/send-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify({
        email: toEmail,
        pdfPassword,
        htmlContent
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send email');
    }

    return { success: true };

  } catch (error) {
    console.error('Email send error:', error);

    // If backend not available, return demo mode
    if (error.message.includes('Failed to fetch')) {
      return {
        success: true,
        demo: true,
        message: 'Backend not available. Email would be sent in production.'
      };
    }

    return { success: false, error: error.message };
  }
};

// Main email sending function
export const sendSecurityPlanEmail = async (user, score, answers) => {
  const pdfPassword = user.pdfPassword;

  if (!pdfPassword) {
    return {
      success: false,
      error: 'No PDF password found. Please upgrade your account first.'
    };
  }

  // Generate the HTML content for the PDF
  const htmlContent = generatePdfContent(user, score, answers);

  // Send via backend
  return await sendViaBackend(user.email, pdfPassword, htmlContent);
};

// Simulated email preview (for development)
export const previewEmail = (user, score, answers) => {
  const pdfPassword = user.pdfPassword || 'DEMO_PASSWORD';

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 40px; }
    .email-container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .email-header { background: #F7931A; color: #000; padding: 30px; text-align: center; }
    .email-header h1 { margin: 0; font-size: 24px; }
    .email-body { padding: 30px; }
    .email-body h2 { color: #333; font-size: 20px; margin-bottom: 16px; }
    .email-body p { color: #666; line-height: 1.6; margin-bottom: 16px; }
    .password-box { background: #fff7ed; border: 2px solid #F7931A; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
    .password { font-family: monospace; font-size: 24px; color: #F7931A; font-weight: bold; letter-spacing: 2px; }
    .warning { background: #fee; border: 1px solid #fcc; border-radius: 8px; padding: 16px; color: #c00; font-size: 14px; }
    .email-footer { background: #f8f8f8; padding: 20px; text-align: center; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>KYWARD</h1>
      <p>Bitcoin Security Made Simple</p>
    </div>
    <div class="email-body">
      <h2>Your Security & Inheritance Plan is Ready</h2>
      <p>Hello,</p>
      <p>Your personalized Bitcoin Security & Inheritance Plan has been generated based on your assessment (Score: ${score}/100).</p>

      <div class="password-box">
        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">Your PDF Password:</p>
        <div class="password">${pdfPassword}</div>
      </div>

      <p>Use this password to open the attached PDF document. Store it securely.</p>

      <div class="warning">
        <strong>Important:</strong> This document contains sensitive information about your Bitcoin security setup. Never share this email or the PDF password with anyone.
      </div>

      <p style="margin-top: 24px;">
        The attached PDF includes:
      </p>
      <ul style="color: #666;">
        <li>Your security score breakdown</li>
        <li>Personalized recommendations</li>
        <li>Sparrow Wallet setup guide</li>
        <li>Multi-signature setup instructions</li>
        <li>Liana inheritance strategy</li>
        <li>Complete action plan</li>
      </ul>

      <p>If you have any questions, visit our website or contact support.</p>

      <p>Stay secure,<br><strong>The Kyward Team</strong></p>
    </div>
    <div class="email-footer">
      <p>KYWARD - Bitcoin Security Made Simple</p>
      <p>This email was sent to ${user.email}</p>
    </div>
  </div>
</body>
</html>
  `;

  // Open preview in new window
  const previewWindow = window.open('', '_blank');
  previewWindow.document.write(emailHtml);
  previewWindow.document.close();
};
