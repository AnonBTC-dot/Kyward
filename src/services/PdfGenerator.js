// KYWARD PDF GENERATOR
// Generates password-protected inheritance plan PDF

import { generateInheritancePlan, generateRecommendations } from './Recommendations';

// Since we can't use jsPDF directly without npm install, we'll create a
// printable HTML version that can be saved as PDF from the browser
export const generatePdfContent = (user, score, answers) => {
  const plan = generateInheritancePlan(answers, score, user.email);
  const recommendations = generateRecommendations(answers, score);

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
      border: 8px solid #F7931A;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      background: rgba(247,147,26,0.1);
    }
    .score-number { font-size: 48px; font-weight: 800; color: #F7931A; }
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
    .section h4 { font-size: 16px; color: #F7931A; margin: 16px 0 8px; }
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
    .wallet-path { 
      margin: 24px 0; 
      padding: 16px; 
      border: 1px solid #2a2a2a; 
      border-radius: 8px; 
      background: rgba(0,0,0,0.3);
    }
    .wallet-path h4 { color: #F7931A; }

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
      ${recommendations.map(rec => `
        <div class="rec-card ${rec.priority}">
          <span class="priority-badge priority-${rec.priority}">${rec.priority.toUpperCase()}</span>
          <h4>${rec.title}</h4>
          <p>${rec.shortTip}</p>
        </div>
      `).join('')}
    </div>

    <!-- Wallet Setup Guide -->
    <div class="section">
      <h2>Recommended Wallet Setup</h2>

      <div class="wallet-box">
        <h3>Primary Wallet Recommendation: Sparrow Wallet</h3>
        <p>Sparrow is a desktop Bitcoin wallet focused on security, privacy, and self-custody. It excels at both single-signature and multi-signature setups.</p>
        <p><strong>Download:</strong> https://sparrowwallet.com</p>
        <h4>Setup Steps:</h4>
        <ol>
          <li>Download from official website only</li>
          <li>Verify the GPG signature before installing</li>
          <li>Connect your hardware wallet via USB</li>
          <li>Create new wallet or import existing</li>
          <li>Enable Tor for enhanced privacy (optional but recommended)</li>
          <li>Always verify addresses on your hardware wallet screen</li>
        </ol>
      </div>

      <!-- Nueva sección: Cold Storage Wallet Options -->
      <div class="wallet-box">
        <h3>Cold Storage Wallet Options (Bitcoin Mainnet)</h3>
        <p>For long-term cold storage (minimal interaction, maximum security), consider these mobile/desktop wallets designed specifically for Bitcoin mainnet use:</p>
        
        <ul>
          <li><strong>BlueWallet</strong> - Mobile-first, supports watch-only mode, Lightning + on-chain, easy to use for cold storage with air-gapped signing via PSBT export/import.</li>
          <li><strong>Blockstream Jade</strong> - Hardware wallet with strong cold storage capabilities (air-gapped via QR codes), fully open-source, integrates well with Green wallet or Sparrow for offline signing.</li>
          <li><strong>Bull Bitcoin Wallet</strong> - Focused on non-KYC Bitcoin privacy, supports cold storage setups with strong emphasis on self-custody and Canadian-friendly features (good for geographic diversification).</li>
        </ul>

        <p><strong>Best Practice for Cold Storage:</strong> Use these wallets in watch-only mode on your online device, sign transactions offline/air-gapped, and never expose private keys online.</p>
      </div>

      ${!plan.currentSetup.hasMultisig ? `
      <div class="wallet-box">
        <h3>Choose Your Security & Inheritance Path</h3>
        <p>You have two strong options depending on your needs: active management with multisig (Sparrow) or automated trustless inheritance (Liana). Choose based on your priorities.</p>

        <!-- Path 1: Sparrow Multisig -->
        <div class="wallet-path">
          <h4>Path 1: Multisig with Sparrow (Best for Active Management)</h4>
          <p>Use Sparrow to create a 2-of-3 multisig setup for maximum security against loss or theft while maintaining full control.</p>

          <h5>Recommended Hardware:</h5>
          <table>
            <tr>
              <th>Device</th>
              <th>Purpose</th>
              <th>Location Suggestion</th>
            </tr>
            <tr>
              <td>Coldcard Mk4</td>
              <td>Primary signing device</td>
              <td>With you (home safe)</td>
            </tr>
            <tr>
              <td>BitBox02</td>
              <td>Secondary device</td>
              <td>Bank safety deposit box</td>
            </tr>
            <tr>
              <td>Jade Wallet</td>
              <td>Inheritance / backup device</td>
              <td>Trusted heir or lawyer</td>
            </tr>
          </table>

          <h5>Setup Steps in Sparrow:</h5>
          <ol>
            <li>Create keystore for each hardware wallet</li>
            <li>File → New Wallet → Multi Signature</li>
            <li>Set threshold to 2-of-3</li>
            <li>Import all three xpubs</li>
            <li>Verify all devices show the same addresses</li>
            <li>Send a small test transaction</li>
            <li>Document everything for inheritance</li>
          </ol>

          <p><strong>Best for:</strong> Users who want full control, frequent transactions, and strong protection against single-point failures.</p>
        </div>

        <!-- Path 2: Liana Time-lock -->
        <div class="wallet-path">
          <h4>Path 2: Time-locked Inheritance with Liana (Best for Hands-off Inheritance)</h4>
          <p>Liana adds automatic inheritance via time-locks — if you don't move funds for a set period, a recovery key (held by your heir) can access them. No third party required.</p>
          <p><strong>Website:</strong> https://wizardsardine.com/liana/</p>

          <h5>How It Works:</h5>
          <ol>
            <li>Set up your primary key (your hardware wallet)</li>
            <li>Set up a recovery key (heir's hardware wallet)</li>
            <li>Define a timelock (e.g., 365 days of inactivity)</li>
            <li>After timelock expires, recovery key can spend</li>
            <li>Your regular transactions automatically reset the timer</li>
            <li>Fully trustless — no one can access funds early</li>
          </ol>

          <h5>Important Considerations:</h5>
          <ul>
            <li>Recovery key holder cannot access funds before timelock</li>
            <li>You must make occasional transactions to prevent accidental activation</li>
            <li>Consider 180-day timelock with calendar reminders for check-ins</li>
            <li>Heir needs basic technical ability or very clear written instructions</li>
          </ul>

          <p><strong>Best for:</strong> Users who want automatic, trustless inheritance without relying on lawyers or services, even if it means less frequent manual control.</p>
        </div>
      </div>
      ` : ''}
    </div>

    <!-- Inheritance Strategy -->
    <div class="section">
      <h2>Inheritance Strategy</h2>

      <p>Choose between the two paths above (Sparrow multisig or Liana time-lock) based on whether you prefer active control or automated inheritance protection.</p>

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
};

// Open PDF in new window for printing/saving
export const openPdfPreview = (user, score, answers) => {
  const html = generatePdfContent(user, score, answers);
  const printWindow = window.open('', '_blank');
  printWindow.document.write(html);
  printWindow.document.close();

  // Auto-trigger print dialog after a short delay
  setTimeout(() => {
    printWindow.print();
  }, 500);
};

// Download as HTML file (can be opened and printed to PDF)
export const downloadHtmlReport = (user, score, answers) => {
  const html = generatePdfContent(user, score, answers);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kyward-security-plan-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};