// KYWARD EMAIL SERVICE
// Generates PDF on frontend and sends to backend for email attachment

import html2pdf from 'html2pdf.js';
import { generatePdfContent } from './PdfGenerator';
import { kywardDB } from './Database';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Generate PDF from HTML content and return as base64
 * Uses an iframe to properly render the full HTML document with styles
 */
async function generatePdfBase64(htmlContent) {
  return new Promise((resolve, reject) => {
    // Create an iframe to properly render the full HTML document
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    iframe.style.width = '816px'; // Letter width at 96dpi
    iframe.style.height = '1056px'; // Letter height at 96dpi
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    // Write the HTML content to the iframe
    iframe.contentDocument.open();
    iframe.contentDocument.write(htmlContent);
    iframe.contentDocument.close();

    // Wait for iframe to fully load and render
    iframe.onload = () => {
      // Give extra time for styles and fonts to load
      setTimeout(() => {
        const iframeBody = iframe.contentDocument.body;

        const opt = {
          margin: 0,
          filename: 'kyward-security-plan.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: '#0a0a0a',
            logging: false,
            windowWidth: 816,
            windowHeight: 1056
          },
          jsPDF: {
            unit: 'in',
            format: 'letter',
            orientation: 'portrait'
          }
        };

        html2pdf()
          .set(opt)
          .from(iframeBody)
          .outputPdf('arraybuffer')
          .then((pdfArrayBuffer) => {
            document.body.removeChild(iframe);

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
            document.body.removeChild(iframe);
            reject(error);
          });
      }, 500); // Wait 500ms for styles to fully apply
    };

    // Handle iframe errors
    iframe.onerror = (error) => {
      document.body.removeChild(iframe);
      reject(error);
    };
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
