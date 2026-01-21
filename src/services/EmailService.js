// KYWARD EMAIL SERVICE
// Generates PDF on frontend and sends to backend for email attachment

import html2pdf from 'html2pdf.js';
import { generatePdfContent } from './PdfGenerator';
import { kywardDB } from './Database';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Generate PDF from HTML content and return as base64
 * Uses an iframe to render the full HTML document properly
 */
async function generatePdfBase64(htmlContent) {
  return new Promise((resolve, reject) => {
    // Create an iframe to render the complete HTML document
    const iframe = document.createElement('iframe');
    iframe.style.cssText = `
      position: fixed;
      left: 0;
      top: 0;
      width: 850px;
      height: 1100px;
      border: none;
      opacity: 0;
      pointer-events: none;
      z-index: -1;
    `;
    document.body.appendChild(iframe);

    // Wait for iframe to be ready
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    // Write the complete HTML to the iframe
    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();

    // Wait for content to fully render
    const checkReady = () => {
      const container = iframeDoc.querySelector('.container');
      if (container && container.offsetHeight > 0) {
        // Content is rendered, proceed with PDF generation
        setTimeout(() => {
          generateFromIframe();
        }, 500); // Extra time for fonts and styles
      } else {
        // Not ready yet, check again
        setTimeout(checkReady, 100);
      }
    };

    const generateFromIframe = () => {
      const opt = {
        margin: [0.25, 0.25, 0.25, 0.25],
        filename: 'kyward-security-plan.pdf',
        image: { type: 'jpeg', quality: 0.92 },
        html2canvas: {
          scale: 1.5,
          useCORS: true,
          backgroundColor: '#0a0a0a',
          logging: false,
          windowWidth: 850,
          windowHeight: 1100,
          onclone: (clonedDoc) => {
            // Ensure background colors are preserved in clone
            const body = clonedDoc.body;
            if (body) {
              body.style.backgroundColor = '#0a0a0a';
              body.style.margin = '0';
              body.style.padding = '40px';
            }
          }
        },
        jsPDF: {
          unit: 'in',
          format: 'letter',
          orientation: 'portrait'
        },
        pagebreak: { mode: ['css', 'legacy'], before: '.section' }
      };

      html2pdf()
        .set(opt)
        .from(iframeDoc.body)
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
    };

    // Start checking when iframe loads
    iframe.onload = checkReady;

    // Fallback timeout
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        generateFromIframe();
      }
    }, 3000);
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
