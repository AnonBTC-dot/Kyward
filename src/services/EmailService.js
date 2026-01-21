// KYWARD EMAIL SERVICE
// Generates PDF on frontend and sends to backend for email attachment

import html2pdf from 'html2pdf.js';
import { generatePdfContent } from './PdfGenerator';
import { kywardDB } from './Database';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Generate PDF from HTML content and return as base64
 * Extracts styles and body content to render properly with html2pdf
 */
async function generatePdfBase64(htmlContent) {
  return new Promise((resolve, reject) => {
    // Extract styles from the HTML
    const styleMatch = htmlContent.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    const styles = styleMatch ? styleMatch[1] : '';

    // Extract body content from the HTML
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyContent = bodyMatch ? bodyMatch[1] : htmlContent;

    // Create a container that will be visible for rendering
    const container = document.createElement('div');
    container.id = 'pdf-render-container';
    container.innerHTML = bodyContent;

    // Apply styles via a style element
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    container.insertBefore(styleElement, container.firstChild);

    // Position off-screen but still renderable
    container.style.cssText = `
      position: fixed;
      left: -9999px;
      top: 0;
      width: 8.5in;
      background: #0a0a0a;
      color: #e5e5e5;
      font-family: 'Segoe UI', system-ui, sans-serif;
    `;

    document.body.appendChild(container);

    // Wait for styles and content to be applied
    requestAnimationFrame(() => {
      setTimeout(() => {
        const opt = {
          margin: [0.3, 0.3, 0.3, 0.3],
          filename: 'kyward-security-plan.pdf',
          image: { type: 'jpeg', quality: 0.95 },
          html2canvas: {
            scale: 1.5,
            useCORS: true,
            backgroundColor: '#0a0a0a',
            logging: false,
            scrollY: 0,
            scrollX: 0
          },
          jsPDF: {
            unit: 'in',
            format: 'letter',
            orientation: 'portrait'
          },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
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
      }, 300);
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
