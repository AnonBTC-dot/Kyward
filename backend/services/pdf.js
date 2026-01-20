// KYWARD PDF SERVICE
// Generates password-protected security plan PDFs
// Uses the same HTML template as frontend for consistency

const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');

/**
 * Generate the HTML content (same as frontend PdfGenerator.js)
 */
function generatePdfHtml(user, score, recommendations) {
  // Generate inheritance plan data
  const plan = {
    executiveSummary: score >= 80
      ? 'Your Bitcoin security practices are excellent. You have implemented strong measures to protect your assets.'
      : score >= 50
      ? 'You have a good security foundation, but there are important areas that need improvement to fully protect your Bitcoin.'
      : 'Your Bitcoin is at significant risk. Immediate action is required to secure your assets.',
    currentSetup: {
      hasHardwareWallet: recommendations?.some(r => r.title?.toLowerCase().includes('hardware')) ? false : true,
      hasMetalBackup: recommendations?.some(r => r.title?.toLowerCase().includes('metal') || r.title?.toLowerCase().includes('backup')) ? false : true,
      hasPassphrase: score >= 60,
      hasMultisig: score >= 80,
      coldStoragePercent: Math.min(95, Math.max(20, score)),
      hasInheritancePlan: score >= 70
    },
    actionPlan: [
      { action: 'Review and implement critical recommendations', timeframe: 'Immediate', cost: 'Free' },
      { action: 'Purchase hardware wallet if needed', timeframe: '1-2 weeks', cost: '$70-150' },
      { action: 'Set up metal seed backup', timeframe: '2-3 weeks', cost: '$30-80' },
      { action: 'Configure multi-signature setup', timeframe: '1 month', cost: '$150-300' },
      { action: 'Document inheritance plan', timeframe: '1-2 months', cost: 'Free' },
      { action: 'Set up Liana timelock recovery', timeframe: '2-3 months', cost: 'Free' }
    ]
  };

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Kyward Security & Inheritance Plan</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: #0a0a0a;
      color: #e5e5e5;
      line-height: 1.6;
      padding: 40px;
    }
    .container { max-width: 800px; margin: 0 auto; }

    /* Header */
    .header {
      text-align: center;
      padding-bottom: 30px;
      border-bottom: 3px solid #F7931A;
      margin-bottom: 40px;
    }
    .logo { font-size: 32px; font-weight: 800; color: #F7931A; margin-bottom: 8px; }
    .header h1 { font-size: 28px; color: #fff; margin-bottom: 8px; }
    .header p { color: #9ca3af; font-size: 14px; }
    .confidential {
      display: inline-block;
      background: rgba(239,68,68,0.15);
      color: #ef4444;
      padding: 6px 16px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 700;
      margin-top: 16px;
      border: 1px solid rgba(239,68,68,0.3);
    }

    /* Score Section */
    .score-section {
      background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
      border: 1px solid #2a2a2a;
      border-radius: 12px;
      padding: 30px;
      text-align: center;
      margin-bottom: 40px;
    }
    .score-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 8px solid ${score >= 80 ? '#22c55e' : score >= 50 ? '#F7931A' : '#ef4444'};
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      background: ${score >= 80 ? 'rgba(34,197,94,0.1)' : score >= 50 ? 'rgba(247,147,26,0.1)' : 'rgba(239,68,68,0.1)'};
    }
    .score-number { font-size: 48px; font-weight: 800; color: ${score >= 80 ? '#22c55e' : score >= 50 ? '#F7931A' : '#ef4444'}; }
    .score-label { font-size: 18px; color: #fff; font-weight: 600; }
    .score-desc { color: #9ca3af; font-size: 14px; margin-top: 8px; }

    /* Section Headers */
    .section { margin-bottom: 40px; page-break-inside: avoid; }
    .section h2 {
      font-size: 22px;
      color: #F7931A;
      border-bottom: 2px solid #F7931A;
      padding-bottom: 8px;
      margin-bottom: 20px;
    }
    .section h3 { font-size: 18px; color: #fff; margin: 20px 0 12px; }
    .section p { color: #d1d5db; margin-bottom: 12px; }

    /* Lists */
    ul, ol { margin-left: 24px; margin-bottom: 16px; }
    li { margin-bottom: 8px; color: #d1d5db; }
    li strong { color: #F7931A; }

    /* Recommendation Cards */
    .rec-card {
      background: linear-gradient(180deg, #1a1a1a 0%, #141414 100%);
      border-left: 4px solid #F7931A;
      border-top: 1px solid #2a2a2a;
      border-right: 1px solid #2a2a2a;
      border-bottom: 1px solid #2a2a2a;
      padding: 16px 20px;
      margin-bottom: 16px;
      border-radius: 0 8px 8px 0;
    }
    .rec-card.critical { border-left-color: #ef4444; }
    .rec-card.high { border-left-color: #F7931A; }
    .rec-card.medium { border-left-color: #3b82f6; }
    .rec-card h4 { font-size: 16px; color: #fff; margin-bottom: 8px; }
    .rec-card p { font-size: 14px; color: #9ca3af; margin: 0; }
    .priority-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .priority-critical { background: rgba(239,68,68,0.15); color: #ef4444; }
    .priority-high { background: rgba(247,147,26,0.15); color: #F7931A; }
    .priority-medium { background: rgba(59,130,246,0.15); color: #3b82f6; }

    /* Wallet Guide Box */
    .wallet-box {
      background: linear-gradient(135deg, rgba(247,147,26,0.1) 0%, rgba(247,147,26,0.05) 100%);
      border: 2px solid rgba(247,147,26,0.4);
      border-radius: 12px;
      padding: 24px;
      margin: 20px 0;
    }
    .wallet-box h3 { color: #F7931A; margin-bottom: 12px; }
    .wallet-box h4 { color: #fff; margin-top: 16px; }
    .wallet-box p { color: #d1d5db; }

    /* Action Plan Table */
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #2a2a2a; color: #d1d5db; }
    th { background: #1a1a1a; font-weight: 600; color: #F7931A; }
    tr:hover { background: rgba(247,147,26,0.05); }

    /* Footer */
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #2a2a2a;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    .footer strong { color: #F7931A; }

    /* Print Styles */
    @media print {
      body {
        padding: 20px;
        background: #0a0a0a !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="logo">KYWARD</div>
      <h1>Bitcoin Security & Inheritance Plan</h1>
      <p>Personalized for: ${user.email}</p>
      <p>Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div class="confidential">CONFIDENTIAL - STORE SECURELY</div>
    </div>

    <!-- Score Section -->
    <div class="score-section">
      <div class="score-circle">
        <span class="score-number">${score}</span>
      </div>
      <div class="score-label">
        ${score >= 80 ? 'Excellent Security' : score >= 50 ? 'Moderate Security' : 'Needs Improvement'}
      </div>
      <p class="score-desc">${plan.executiveSummary}</p>
    </div>

    <!-- Executive Summary -->
    <div class="section">
      <h2>Executive Summary</h2>
      <p>${plan.executiveSummary}</p>

      <h3>Current Setup Analysis</h3>
      <ul>
        <li><strong>Hardware Wallet:</strong> ${plan.currentSetup.hasHardwareWallet ? 'Yes' : 'No - Critical Risk'}</li>
        <li><strong>Metal Backup:</strong> ${plan.currentSetup.hasMetalBackup ? 'Yes' : 'No - Recommended'}</li>
        <li><strong>Passphrase (25th word):</strong> ${plan.currentSetup.hasPassphrase ? 'Yes' : 'No'}</li>
        <li><strong>Multi-signature:</strong> ${plan.currentSetup.hasMultisig ? 'Yes' : 'No'}</li>
        <li><strong>Cold Storage:</strong> ~${plan.currentSetup.coldStoragePercent}% of holdings</li>
        <li><strong>Inheritance Plan:</strong> ${plan.currentSetup.hasInheritancePlan ? 'Documented' : 'Not Documented - Critical'}</li>
      </ul>
    </div>

    <!-- Priority Recommendations -->
    <div class="section">
      <h2>Priority Recommendations</h2>
      ${(recommendations || []).map(rec => `
        <div class="rec-card ${rec.priority}">
          <span class="priority-badge priority-${rec.priority}">${(rec.priority || 'info').toUpperCase()}</span>
          <h4>${rec.title || 'Recommendation'}</h4>
          <p>${rec.shortTip || ''}</p>
        </div>
      `).join('')}
    </div>

    <!-- Wallet Setup Guide -->
    <div class="section">
      <h2>Recommended Wallet Setup</h2>

      <div class="wallet-box">
        <h3>Primary Wallet: Sparrow Wallet</h3>
        <p>Sparrow is a desktop Bitcoin wallet focused on security and privacy. It's the recommended choice for self-custody.</p>
        <p><strong>Download:</strong> https://sparrowwallet.com</p>
        <h4 style="margin-top: 16px;">Setup Steps:</h4>
        <ol>
          <li>Download from official website only</li>
          <li>Verify the GPG signature before installing</li>
          <li>Connect your hardware wallet via USB</li>
          <li>Create new wallet or import existing</li>
          <li>Enable Tor for enhanced privacy (optional)</li>
          <li>Always verify addresses on your hardware wallet screen</li>
        </ol>
      </div>

      <div class="wallet-box">
        <h3>Multi-Signature Setup (2-of-3)</h3>
        <p>For maximum security, we recommend a 2-of-3 multisig setup. This means you need any 2 of 3 keys to spend your Bitcoin.</p>

        <h4>Recommended Hardware:</h4>
        <table>
          <tr>
            <th>Device</th>
            <th>Purpose</th>
            <th>Location</th>
          </tr>
          <tr>
            <td>Coldcard Mk4</td>
            <td>Primary signing device</td>
            <td>With you (home safe)</td>
          </tr>
          <tr>
            <td>Trezor Model T</td>
            <td>Secondary device</td>
            <td>Bank safety deposit box</td>
          </tr>
          <tr>
            <td>Ledger Nano X</td>
            <td>Inheritance device</td>
            <td>Trusted heir or lawyer</td>
          </tr>
        </table>

        <h4>Sparrow Multisig Setup:</h4>
        <ol>
          <li>Create keystore for each hardware wallet</li>
          <li>File → New Wallet → Multi Signature</li>
          <li>Set threshold to 2-of-3</li>
          <li>Import all three xpubs</li>
          <li>Verify all devices show the same addresses</li>
          <li>Send a small test transaction</li>
          <li>Document everything for inheritance</li>
        </ol>
      </div>
    </div>

    <!-- Inheritance Strategy -->
    <div class="section">
      <h2>Inheritance Strategy</h2>

      <div class="wallet-box">
        <h3>Recommended: Liana Wallet</h3>
        <p>Liana is a Bitcoin wallet with built-in inheritance through time-locked recovery. If you don't move your coins for a specified period, a recovery key can access them.</p>
        <p><strong>Website:</strong> https://wizardsardine.com/liana/</p>

        <h4>How It Works:</h4>
        <ol>
          <li>Set up your primary key (your hardware wallet)</li>
          <li>Set up a recovery key (heir's hardware wallet)</li>
          <li>Define a timelock (e.g., 365 days of inactivity)</li>
          <li>After the timelock, the recovery key can spend</li>
          <li>Your regular transactions reset the timer</li>
          <li>No third party needed - fully trustless inheritance</li>
        </ol>

        <h4>Important Considerations:</h4>
        <ul>
          <li>Recovery key holder cannot access funds before timelock expires</li>
          <li>You must transact periodically to reset the timer</li>
          <li>Consider a 180-day timelock with regular check-in reminders</li>
          <li>Heir needs technical ability or very clear instructions</li>
        </ul>
      </div>

      <h3>Documentation for Heirs</h3>
      <p>Prepare the following documents and store them securely:</p>
      <ol>
        <li><strong>Letter of Explanation:</strong> What Bitcoin is and why it's valuable</li>
        <li><strong>Asset List:</strong> Approximate holdings (not exact amounts)</li>
        <li><strong>Hardware Locations:</strong> Where devices are stored</li>
        <li><strong>Recovery Instructions:</strong> Step-by-step guide for non-technical heirs</li>
        <li><strong>Contact List:</strong> Technical people who can help if needed</li>
      </ol>
    </div>

    <!-- Backup Strategy -->
    <div class="section">
      <h2>Backup Strategy</h2>

      <h3>Seed Phrase Storage</h3>
      <ul>
        <li><strong>Format:</strong> Metal backup plates (Cryptosteel, Billfodl, or stamped steel washers)</li>
        <li><strong>Location 1:</strong> Home safe (primary access)</li>
        <li><strong>Location 2:</strong> Bank safety deposit box</li>
        <li><strong>Location 3:</strong> Trusted family member in different city</li>
      </ul>

      <h3>Passphrase Storage</h3>
      <ul>
        <li>Memorize your passphrase (25th word)</li>
        <li>Store encrypted backup separately from seed</li>
        <li>Never store passphrase with seed phrase</li>
      </ul>

      <h3>Documentation Storage</h3>
      <ul>
        <li>Physical copy in sealed envelope with lawyer</li>
        <li>Encrypted digital copy (use VeraCrypt or similar)</li>
        <li>Update annually or when setup changes</li>
      </ul>
    </div>

    <!-- Action Plan -->
    <div class="section">
      <h2>Your Action Plan</h2>
      <table>
        <tr>
          <th>#</th>
          <th>Action</th>
          <th>Timeframe</th>
          <th>Cost</th>
        </tr>
        ${plan.actionPlan.map((action, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${action.action}</td>
            <td>${action.timeframe}</td>
            <td>${action.cost}</td>
          </tr>
        `).join('')}
      </table>
    </div>

    <!-- Security Checklist -->
    <div class="section">
      <h2>Quarterly Security Review Checklist</h2>
      <ul>
        <li>☐ Verify backup locations are secure and accessible</li>
        <li>☐ Test that seed phrase backups are readable</li>
        <li>☐ Update wallet software (verify signatures first)</li>
        <li>☐ Review transaction history for anomalies</li>
        <li>☐ Check hardware wallet firmware is current</li>
        <li>☐ Update inheritance documentation if needed</li>
        <li>☐ Confirm heirs know how to reach this documentation</li>
      </ul>

      <h3>Annual Review</h3>
      <ul>
        <li>☐ Full recovery test on secondary device</li>
        <li>☐ Consider upgrading security setup</li>
        <li>☐ Update estate planning documents</li>
        <li>☐ Review overall security posture</li>
      </ul>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>KYWARD</strong> - Bitcoin Security Made Simple</p>
      <p>This document is confidential. Store it securely and never share your seed phrase.</p>
      <p>Generated on ${new Date().toISOString()}</p>
    </div>
  </div>
</body>
</html>
  `;

  return html;
}

/**
 * Generate password-protected PDF report
 * Uses same HTML as frontend for consistency
 */
async function generateSecurityPlanPdf(user, score, recommendations, password) {
  console.log('📄 Generating PDF with Puppeteer...');

  let browser = null;

  try {
    // Generate HTML content (same as frontend)
    const html = generatePdfHtml(user, score, recommendations);

    // Launch Puppeteer
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();

    // Set content
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });

    await browser.close();
    browser = null;

    console.log('📄 PDF generated, adding password protection...');

    // Add password protection using pdf-lib
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    const encryptedPdfBytes = await pdfDoc.save({
      userPassword: password,
      ownerPassword: password,
      permissions: {
        printing: 'highResolution',
        modifying: false,
        copying: false,
        annotating: false,
        fillingForms: false,
        contentAccessibility: true,
        documentAssembly: false
      }
    });

    console.log('📄 Password protection added, PDF ready');

    return Buffer.from(encryptedPdfBytes);

  } catch (error) {
    console.error('❌ PDF generation error:', error);
    if (browser) {
      await browser.close();
    }
    throw error;
  }
}

module.exports = {
  generateSecurityPlanPdf,
  generatePdfHtml
};
