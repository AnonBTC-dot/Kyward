// KYWARD EMAIL SERVICE
// Generates PDF on frontend and sends to backend for email attachment

import html2pdf from 'html2pdf.js';
import { generatePdfContent } from './PdfGenerator';
import { kywardDB } from './Database';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Generate PDF from HTML content and return as base64
 */
async function generatePdfBase64(htmlContent) {
  return new Promise((resolve, reject) => {
    // Create a temporary container
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    document.body.appendChild(container);

    const opt = {
      margin: 0,
      filename: 'kyward-security-plan.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0a0a0a'
      },
      jsPDF: {
        unit: 'in',
        format: 'letter',
        orientation: 'portrait'
      }
    };

    html2pdf()
      .set(opt)
      .from(container)
      .outputPdf('arraybuffer')
      .then((pdfArrayBuffer) => {
        document.body.removeChild(container);

        // Convert ArrayBuffer to base64
        const uint8Array = new Uint8Array(pdfArrayBuffer);
        let binary = '';
        for (let i = 0; i < uint8Array.length; i++) {
          binary += String.fromCharCode(uint8Array[i]);
        }
        const base64 = btoa(binary);
        resolve(base64);
      })
      .catch((error) => {
        document.body.removeChild(container);
        reject(error);
      });
  });
}

/**
 * Send security plan email with PDF attachment
 * PDF is generated on frontend (same as download) and sent to backend
 */
export const sendSecurityPlanEmail = async (user, score, answers) => {
  const pdfPassword = user.pdfPassword;

  if (!pdfPassword) {
    return {
      success: false,
      error: 'No PDF password found. Please upgrade your account first.'
    };
  }

  try {
    // Generate the same HTML used for download
    const htmlContent = generatePdfContent(user, score, answers);

    console.log('📄 Generating PDF...');

    // Generate PDF as base64
    const pdfBase64 = await generatePdfBase64(htmlContent);

    console.log('📄 PDF generated, size:', Math.round(pdfBase64.length / 1024), 'KB');

    // Send to backend
    const token = kywardDB.getToken();

    const response = await fetch(`${API_URL}/email/send-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify({
        pdfBase64,
        score
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send email');
    }

    return { success: true, message: data.message };

  } catch (error) {
    console.error('Email send error:', error);

    if (error.message.includes('Failed to fetch')) {
      return {
        success: false,
        error: 'Cannot connect to server. Please try again.'
      };
    }

    return { success: false, error: error.message };
  }
};
