// KYWARD PDF GENERATOR
// Generates password-protected inheritance plan PDF with i18n support

import { generateInheritancePlan, generateRecommendations } from './Recommendations';
import { translations } from '../i18n/translations';

// Get translated recommendation text
const getTranslatedRecommendation = (rec, t) => {
  const translatedRec = t.pdfRecommendations[rec.id];
  if (translatedRec) {
    return {
      ...rec,
      title: translatedRec.title,
      shortTip: translatedRec.shortTip
    };
  }
  return rec;
};

// Get priority label translated
const getPriorityLabel = (priority, t) => {
  return t.pdfRecommendations.priority[priority] || priority.toUpperCase();
};

export const generatePdfContent = (user, score, answers, lang = 'en') => {
  // Get translations for the specified language (fallback to English)
  const t = translations[lang] || translations.en;
  const pdf = t.pdf;

  const plan = generateInheritancePlan(answers, score, user.email);
  const recommendations = generateRecommendations(answers, score);

  // Translate recommendations
  const translatedRecommendations = recommendations.map(rec => getTranslatedRecommendation(rec, t));

  // Date formatting based on language
  const dateLocale = lang === 'es' ? 'es-ES' : 'en-US';
  const formattedDate = new Date().toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' });

  // Score label
  const scoreLabel = score >= 80 ? pdf.score.excellent : score >= 50 ? pdf.score.moderate : pdf.score.needsImprovement;

  const html = `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <title>Kyward - ${pdf.title}</title>
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

    ul, ol { margin-left: 24px; margin-bottom: 16px; }
    li { margin-bottom: 8px; color: #d1d5db; }
    li strong { color: #F7931A; }

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

    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #2a2a2a; color: #d1d5db; }
    th { background: #1a1a1a; font-weight: 600; color: #F7931A; }
    tr:hover { background: rgba(247,147,26,0.05); }

    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #2a2a2a;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    .footer strong { color: #F7931A; }

    @media print {
      body { padding: 20px; background: #0a0a0a !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">KYWARD</div>
      <h1>${pdf.title}</h1>
      <p>${pdf.generatedFor}: ${user.email}</p>
      <p>${pdf.generatedOn}: ${formattedDate}</p>
      <div class="confidential">${pdf.confidential}</div>
    </div>

    <div class="score-section">
      <div class="score-circle">
        <span class="score-number">${score}</span>
      </div>
      <div class="score-label">${scoreLabel}</div>
      <p class="score-desc">${plan.executiveSummary}</p>
    </div>

    <div class="section">
      <h2>${pdf.sections.executiveSummary}</h2>
      <p>${plan.executiveSummary}</p>

      <h3>${pdf.sections.currentSetup}</h3>
      <ul>
        <li><strong>${pdf.currentSetup.hardwareWallet}:</strong> ${plan.currentSetup.hasHardwareWallet ? pdf.currentSetup.yes : pdf.currentSetup.criticalRisk}</li>
        <li><strong>${pdf.currentSetup.metalBackup}:</strong> ${plan.currentSetup.hasMetalBackup ? pdf.currentSetup.yes : pdf.currentSetup.recommended}</li>
        <li><strong>${pdf.currentSetup.passphrase}:</strong> ${plan.currentSetup.hasPassphrase ? pdf.currentSetup.yes : pdf.currentSetup.no}</li>
        <li><strong>${pdf.currentSetup.multiSignature}:</strong> ${plan.currentSetup.hasMultisig ? pdf.currentSetup.yes : pdf.currentSetup.no}</li>
        <li><strong>${pdf.currentSetup.coldStorage}:</strong> ~${plan.currentSetup.coldStoragePercent}% ${pdf.currentSetup.ofHoldings}</li>
        <li><strong>${pdf.currentSetup.inheritancePlan}:</strong> ${plan.currentSetup.hasInheritancePlan ? pdf.currentSetup.documented : pdf.currentSetup.notDocumented}</li>
      </ul>
    </div>

    <div class="section">
      <h2>${pdf.sections.priorityRecommendations}</h2>
      ${translatedRecommendations.map(rec => `
        <div class="rec-card ${rec.priority}">
          <span class="priority-badge priority-${rec.priority}">${getPriorityLabel(rec.priority, t)}</span>
          <h4>${rec.title}</h4>
          <p>${rec.shortTip}</p>
        </div>
      `).join('')}
    </div>

    <div class="section">
      <h2>${pdf.sections.walletSetup}</h2>

      <div class="wallet-box">
        <h3>${pdf.sparrow.title}</h3>
        <p>${pdf.sparrow.description}</p>
        <p><strong>${pdf.sparrow.download}:</strong> https://sparrowwallet.com</p>
        <h4>${pdf.sparrow.setupSteps}:</h4>
        <ol>
          ${pdf.sparrow.steps.map(step => `<li>${step}</li>`).join('')}
        </ol>
      </div>

      <div class="wallet-box">
        <h3>${pdf.coldStorage.title}</h3>
        <p>${pdf.coldStorage.description}</p>
        <ul>
          <li><strong>BlueWallet</strong> - ${pdf.coldStorage.blueWallet}</li>
          <li><strong>Blockstream Jade</strong> - ${pdf.coldStorage.jade}</li>
          <li><strong>Bull Bitcoin Wallet</strong> - ${pdf.coldStorage.bullBitcoin}</li>
        </ul>
        <p><strong>${pdf.coldStorage.bestPractice}:</strong> ${pdf.coldStorage.bestPracticeText}</p>
      </div>

      ${!plan.currentSetup.hasMultisig ? `
      <div class="wallet-box">
        <h3>${pdf.paths.chooseTitle}</h3>
        <p>${pdf.paths.chooseDesc}</p>

        <div class="wallet-path">
          <h4>${pdf.paths.sparrow.title}</h4>
          <p>${pdf.paths.sparrow.description}</p>

          <h5>${pdf.paths.sparrow.hardware}:</h5>
          <table>
            <tr><th>${pdf.paths.sparrow.device}</th><th>${pdf.paths.sparrow.purpose}</th><th>${pdf.paths.sparrow.location}</th></tr>
            <tr><td>Coldcard Mk4</td><td>${pdf.paths.sparrow.coldcard}</td><td>${pdf.paths.sparrow.coldcardLocation}</td></tr>
            <tr><td>BitBox02</td><td>${pdf.paths.sparrow.bitbox}</td><td>${pdf.paths.sparrow.bitboxLocation}</td></tr>
            <tr><td>Jade Wallet</td><td>${pdf.paths.sparrow.jade}</td><td>${pdf.paths.sparrow.jadeLocation}</td></tr>
          </table>

          <h5>${pdf.paths.sparrow.setupSteps}:</h5>
          <ol>
            ${pdf.paths.sparrow.steps.map(step => `<li>${step}</li>`).join('')}
          </ol>

          <p><strong>${pdf.paths.sparrow.bestFor}:</strong> ${pdf.paths.sparrow.bestForText}</p>
        </div>

        <div class="wallet-path">
          <h4>${pdf.paths.liana.title}</h4>
          <p>${pdf.paths.liana.description}</p>
          <p><strong>${pdf.paths.liana.website}:</strong> https://wizardsardine.com/liana/</p>

          <h5>${pdf.paths.liana.howItWorks}:</h5>
          <ol>
            ${pdf.paths.liana.steps.map(step => `<li>${step}</li>`).join('')}
          </ol>

          <h5>${pdf.paths.liana.considerations}:</h5>
          <ul>
            ${pdf.paths.liana.considerationsList.map(item => `<li>${item}</li>`).join('')}
          </ul>

          <p><strong>${pdf.paths.liana.bestFor}:</strong> ${pdf.paths.liana.bestForText}</p>
        </div>
      </div>
      ` : ''}
    </div>

    <!-- Inheritance Strategy -->
    <div class="section">
      <h2>${pdf.sections.inheritanceStrategy}</h2>

      <p>${pdf.inheritance.bothPathsValid}</p>

      <h3>${pdf.inheritance.documentation}</h3>
      <p>${pdf.inheritance.documentationDesc}</p>
      <ol>
        ${pdf.inheritance.documents.map((doc, i) => `<li><strong>${doc.split(':')[0]}:</strong>${doc.split(':')[1] || ''}</li>`).join('')}
      </ol>
    </div>

    <!-- Backup Strategy -->
    <div class="section">
      <h2>${pdf.sections.backupStrategy}</h2>

      <h3>${pdf.backup.passphraseTitle}</h3>
      <p>${pdf.backup.passphraseDesc}</p>
      <ol>
        ${pdf.backup.passphraseSteps.map(step => `<li>${step}</li>`).join('')}
      </ol>

      <h3>${pdf.backup.seedStorage}</h3>
      <p>${pdf.backup.seedStorageDesc}</p>

      <h4>${pdf.backup.exactDistribution}</h4>
      <ul>
        <li><strong>${pdf.backup.location1}</strong><br>
            → ${pdf.backup.location1Items.join('<br>→ ')}</li>

        <li><strong>${pdf.backup.location2}</strong><br>
            → ${pdf.backup.location2Items.join('<br>→ ')}</li>

        <li><strong>${pdf.backup.location3}</strong><br>
            → ${pdf.backup.location3Items.join('<br>→ ')}</li>
      </ul>

      <h4>${pdf.backup.recoveryWorks}</h4>
      <ul>
        ${pdf.backup.recoveryExamples.map(ex => `<li>${ex}</li>`).join('')}
      </ul>

      <h4>${pdf.backup.physicalSecurity}</h4>
      <p><strong>${pdf.backup.physicalSecurityText}</strong></p>

      <h4>${pdf.backup.additionalRecs}</h4>
      <ul>
        ${pdf.backup.additionalRecsList.map(rec => `<li>${rec}</li>`).join('')}
      </ul>

      <h3>${pdf.backup.passphraseStorage}</h3>
      <ul>
        ${pdf.backup.passphraseStorageList.map(item => `<li>${item}</li>`).join('')}
      </ul>

      <h3>${pdf.backup.docStorage}</h3>
      <ul>
        ${pdf.backup.docStorageList.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>

    <!-- Action Plan -->
    <div class="section">
      <h2>${pdf.sections.actionPlan}</h2>
      <p>${pdf.actionPlan.description}</p>

      <!-- Sparrow Path -->
      <div class="wallet-box">
        <h3>${pdf.actionPlan.sparrowTitle}</h3>
        <p>${pdf.actionPlan.sparrowDesc}</p>
        <ol>
          ${plan.actionPlanSparrow.map(item => `
            <li>${item.action} (${item.timeframe}, ${item.cost})</li>
          `).join('')}
        </ol>
      </div>

      <!-- Liana Path -->
      <div class="wallet-box">
        <h3>${pdf.actionPlan.lianaTitle}</h3>
        <p>${pdf.actionPlan.lianaDesc}</p>
        <ol>
          ${plan.actionPlanLiana.map(item => `
            <li>${item.action} (${item.timeframe}, ${item.cost})</li>
          `).join('')}
        </ol>
      </div>
    </div>

    <!-- Security Checklist -->
    <div class="section">
      <h2>${pdf.sections.securityChecklist}</h2>
      <ul>
        ${pdf.checklist.quarterly.map(item => `<li>☐ ${item}</li>`).join('')}
      </ul>

      <h3>${pdf.sections.annualReview}</h3>
      <ul>
        ${pdf.checklist.annual.map(item => `<li>☐ ${item}</li>`).join('')}
      </ul>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>KYWARD</strong> - ${pdf.footer.tagline}</p>
      <p>${pdf.footer.confidentialNote}</p>
      <p>${pdf.generatedOn}: ${new Date().toISOString()}</p>
    </div>
  </div>
</body>
</html>
  `;

  return html;
};

// Open PDF in new window for printing/saving
export const openPdfPreview = (user, score, answers, lang = 'en') => {
  const html = generatePdfContent(user, score, answers, lang);
  const printWindow = window.open('', '_blank');
  printWindow.document.write(html);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.print();
  }, 500);
};

// Download as HTML file (can be opened and printed to PDF)
export const downloadHtmlReport = (user, score, answers, lang = 'en') => {
  const html = generatePdfContent(user, score, answers, lang);
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
