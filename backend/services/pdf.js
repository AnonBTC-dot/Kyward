// KYWARD PDF SERVICE
// Generates password-protected security plan PDFs

const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

// Colors
const COLORS = {
  orange: rgb(247/255, 147/255, 26/255),
  white: rgb(1, 1, 1),
  gray: rgb(0.6, 0.6, 0.6),
  lightGray: rgb(0.8, 0.8, 0.8),
  darkGray: rgb(0.15, 0.15, 0.15),
  red: rgb(239/255, 68/255, 68/255),
  green: rgb(34/255, 197/255, 94/255),
  blue: rgb(59/255, 130/255, 246/255)
};

/**
 * Generate password-protected PDF report
 */
async function generateSecurityPlanPdf(user, score, recommendations, password) {
  const pdfDoc = await PDFDocument.create();

  // Embed fonts
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Page dimensions
  const pageWidth = 612; // Letter size
  const pageHeight = 792;
  const margin = 50;
  const contentWidth = pageWidth - (margin * 2);

  // Helper to add new page
  const addPage = () => {
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    return { page, y: pageHeight - margin };
  };

  // Helper to draw text with word wrap
  const drawText = (page, text, x, y, options = {}) => {
    const {
      font = helvetica,
      size = 11,
      color = COLORS.white,
      maxWidth = contentWidth
    } = options;

    page.drawText(text, { x, y, font, size, color });
    return y - (size + 4);
  };

  // Helper to draw wrapped text
  const drawWrappedText = (page, text, x, startY, options = {}) => {
    const {
      font = helvetica,
      size = 11,
      color = COLORS.white,
      maxWidth = contentWidth,
      lineHeight = size + 4
    } = options;

    const words = text.split(' ');
    let line = '';
    let y = startY;

    for (const word of words) {
      const testLine = line + (line ? ' ' : '') + word;
      const width = font.widthOfTextAtSize(testLine, size);

      if (width > maxWidth && line) {
        page.drawText(line, { x, y, font, size, color });
        y -= lineHeight;
        line = word;
      } else {
        line = testLine;
      }
    }

    if (line) {
      page.drawText(line, { x, y, font, size, color });
      y -= lineHeight;
    }

    return y;
  };

  // ==========================================
  // PAGE 1: Cover & Score
  // ==========================================
  let { page, y } = addPage();

  // Background
  page.drawRectangle({
    x: 0, y: 0,
    width: pageWidth, height: pageHeight,
    color: rgb(0.04, 0.04, 0.04)
  });

  // Header
  y = pageHeight - 80;
  page.drawText('KYWARD', {
    x: margin, y,
    font: helveticaBold, size: 36,
    color: COLORS.orange
  });

  y -= 40;
  page.drawText('Bitcoin Security & Inheritance Plan', {
    x: margin, y,
    font: helveticaBold, size: 24,
    color: COLORS.white
  });

  y -= 25;
  page.drawText(`Prepared for: ${user.email}`, {
    x: margin, y,
    font: helvetica, size: 12,
    color: COLORS.gray
  });

  y -= 18;
  page.drawText(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, {
    x: margin, y,
    font: helvetica, size: 12,
    color: COLORS.gray
  });

  // Confidential badge
  y -= 30;
  page.drawRectangle({
    x: margin, y: y - 5,
    width: 180, height: 22,
    color: rgb(0.2, 0.08, 0.08),
    borderColor: COLORS.red,
    borderWidth: 1
  });
  page.drawText('CONFIDENTIAL - STORE SECURELY', {
    x: margin + 10, y: y,
    font: helveticaBold, size: 10,
    color: COLORS.red
  });

  // Score section
  y -= 80;

  // Score circle (simulated with rectangle)
  const scoreBoxX = pageWidth / 2 - 60;
  page.drawRectangle({
    x: scoreBoxX, y: y - 100,
    width: 120, height: 120,
    color: rgb(0.1, 0.1, 0.1),
    borderColor: COLORS.orange,
    borderWidth: 4
  });

  // Score number
  const scoreColor = score >= 80 ? COLORS.green : score >= 50 ? COLORS.orange : COLORS.red;
  const scoreStr = score.toString();
  const scoreWidth = helveticaBold.widthOfTextAtSize(scoreStr, 48);
  page.drawText(scoreStr, {
    x: pageWidth / 2 - scoreWidth / 2,
    y: y - 60,
    font: helveticaBold, size: 48,
    color: scoreColor
  });

  page.drawText('/100', {
    x: pageWidth / 2 - 15,
    y: y - 85,
    font: helvetica, size: 14,
    color: COLORS.gray
  });

  // Score label
  y -= 130;
  const scoreLabel = score >= 80 ? 'Excellent Security' : score >= 50 ? 'Moderate Security' : 'Needs Improvement';
  const labelWidth = helveticaBold.widthOfTextAtSize(scoreLabel, 18);
  page.drawText(scoreLabel, {
    x: pageWidth / 2 - labelWidth / 2, y,
    font: helveticaBold, size: 18,
    color: scoreColor
  });

  // Score description
  y -= 30;
  const scoreDesc = score >= 80
    ? 'Your Bitcoin security practices are excellent. Continue maintaining your high standards.'
    : score >= 50
    ? 'You have a good foundation but there is room for improvement in key areas.'
    : 'Your Bitcoin is at significant risk. Please follow the recommendations in this report.';

  y = drawWrappedText(page, scoreDesc, margin + 40, y, {
    maxWidth: contentWidth - 80,
    color: COLORS.lightGray,
    size: 12
  });

  // ==========================================
  // PAGE 2: Recommendations
  // ==========================================
  ({ page, y } = addPage());

  // Background
  page.drawRectangle({
    x: 0, y: 0,
    width: pageWidth, height: pageHeight,
    color: rgb(0.04, 0.04, 0.04)
  });

  // Section header
  y = pageHeight - 60;
  page.drawText('Priority Recommendations', {
    x: margin, y,
    font: helveticaBold, size: 22,
    color: COLORS.orange
  });

  // Orange underline
  y -= 8;
  page.drawRectangle({
    x: margin, y,
    width: 200, height: 3,
    color: COLORS.orange
  });

  y -= 30;

  // Recommendations
  const recsToShow = recommendations?.slice(0, 8) || [];

  for (let i = 0; i < recsToShow.length; i++) {
    const rec = recsToShow[i];

    // Check if we need a new page
    if (y < 120) {
      ({ page, y } = addPage());
      page.drawRectangle({
        x: 0, y: 0,
        width: pageWidth, height: pageHeight,
        color: rgb(0.04, 0.04, 0.04)
      });
      y = pageHeight - 60;
    }

    // Priority color
    const priorityColor = rec.priority === 'critical' ? COLORS.red :
                          rec.priority === 'high' ? COLORS.orange :
                          rec.priority === 'medium' ? COLORS.blue : COLORS.gray;

    // Card background
    page.drawRectangle({
      x: margin, y: y - 65,
      width: contentWidth, height: 70,
      color: rgb(0.1, 0.1, 0.1)
    });

    // Left border
    page.drawRectangle({
      x: margin, y: y - 65,
      width: 4, height: 70,
      color: priorityColor
    });

    // Priority badge
    page.drawText(rec.priority?.toUpperCase() || 'INFO', {
      x: margin + 15, y: y - 5,
      font: helveticaBold, size: 9,
      color: priorityColor
    });

    // Title
    page.drawText(rec.title || 'Recommendation', {
      x: margin + 15, y: y - 22,
      font: helveticaBold, size: 13,
      color: COLORS.white
    });

    // Short tip (truncate if too long)
    const shortTip = rec.shortTip?.substring(0, 120) || '';
    drawWrappedText(page, shortTip, margin + 15, y - 40, {
      maxWidth: contentWidth - 30,
      color: COLORS.gray,
      size: 10,
      lineHeight: 12
    });

    y -= 85;
  }

  // ==========================================
  // PAGE 3: Wallet & Inheritance Guide
  // ==========================================
  ({ page, y } = addPage());

  page.drawRectangle({
    x: 0, y: 0,
    width: pageWidth, height: pageHeight,
    color: rgb(0.04, 0.04, 0.04)
  });

  y = pageHeight - 60;
  page.drawText('Recommended Setup', {
    x: margin, y,
    font: helveticaBold, size: 22,
    color: COLORS.orange
  });

  y -= 8;
  page.drawRectangle({
    x: margin, y,
    width: 160, height: 3,
    color: COLORS.orange
  });

  y -= 40;

  // Sparrow Wallet section
  page.drawText('Primary Wallet: Sparrow Wallet', {
    x: margin, y,
    font: helveticaBold, size: 16,
    color: COLORS.white
  });

  y -= 25;
  y = drawWrappedText(page,
    'Sparrow is a desktop Bitcoin wallet focused on security and privacy. Download from sparrowwallet.com and verify the GPG signature before installing.',
    margin, y, { color: COLORS.lightGray, size: 11 }
  );

  y -= 20;
  page.drawText('Setup Steps:', {
    x: margin, y,
    font: helveticaBold, size: 12,
    color: COLORS.white
  });

  const sparrowSteps = [
    '1. Download from official website only',
    '2. Verify the GPG signature before installing',
    '3. Connect your hardware wallet via USB',
    '4. Create new wallet or import existing',
    '5. Enable Tor for enhanced privacy (optional)',
    '6. Always verify addresses on hardware wallet screen'
  ];

  y -= 20;
  for (const step of sparrowSteps) {
    page.drawText(step, { x: margin + 15, y, font: helvetica, size: 10, color: COLORS.lightGray });
    y -= 16;
  }

  // Liana Inheritance section
  y -= 30;
  page.drawText('Inheritance: Liana Wallet', {
    x: margin, y,
    font: helveticaBold, size: 16,
    color: COLORS.white
  });

  y -= 25;
  y = drawWrappedText(page,
    'Liana provides trustless inheritance through time-locked recovery. If you dont move your coins for a specified period, a recovery key can access them. Visit wizardsardine.com/liana for setup.',
    margin, y, { color: COLORS.lightGray, size: 11 }
  );

  y -= 20;
  page.drawText('How It Works:', {
    x: margin, y,
    font: helveticaBold, size: 12,
    color: COLORS.white
  });

  const lianaSteps = [
    '1. Set up your primary key (your hardware wallet)',
    '2. Set up a recovery key (heirs hardware wallet)',
    '3. Define a timelock (e.g., 365 days of inactivity)',
    '4. After timelock expires, recovery key can spend',
    '5. Your regular transactions reset the timer'
  ];

  y -= 20;
  for (const step of lianaSteps) {
    page.drawText(step, { x: margin + 15, y, font: helvetica, size: 10, color: COLORS.lightGray });
    y -= 16;
  }

  // ==========================================
  // PAGE 4: Backup & Security Checklist
  // ==========================================
  ({ page, y } = addPage());

  page.drawRectangle({
    x: 0, y: 0,
    width: pageWidth, height: pageHeight,
    color: rgb(0.04, 0.04, 0.04)
  });

  y = pageHeight - 60;
  page.drawText('Backup & Security Checklist', {
    x: margin, y,
    font: helveticaBold, size: 22,
    color: COLORS.orange
  });

  y -= 8;
  page.drawRectangle({
    x: margin, y,
    width: 220, height: 3,
    color: COLORS.orange
  });

  y -= 40;
  page.drawText('Seed Phrase Storage:', {
    x: margin, y,
    font: helveticaBold, size: 14,
    color: COLORS.white
  });

  const backupItems = [
    'Use metal backup plates (Cryptosteel, Billfodl)',
    'Store primary backup in home safe',
    'Secondary backup in bank safety deposit box',
    'Third backup with trusted family member',
    'Never store digitally or photograph seed phrase'
  ];

  y -= 22;
  for (const item of backupItems) {
    page.drawText('[ ]  ' + item, { x: margin + 10, y, font: helvetica, size: 10, color: COLORS.lightGray });
    y -= 18;
  }

  y -= 20;
  page.drawText('Quarterly Security Review:', {
    x: margin, y,
    font: helveticaBold, size: 14,
    color: COLORS.white
  });

  const quarterlyItems = [
    'Verify backup locations are secure and accessible',
    'Test that seed phrase backups are readable',
    'Update wallet software (verify signatures first)',
    'Review transaction history for anomalies',
    'Check hardware wallet firmware is current',
    'Update inheritance documentation if needed'
  ];

  y -= 22;
  for (const item of quarterlyItems) {
    page.drawText('[ ]  ' + item, { x: margin + 10, y, font: helvetica, size: 10, color: COLORS.lightGray });
    y -= 18;
  }

  // Footer on last page
  y = 60;
  page.drawRectangle({
    x: margin, y: y + 10,
    width: contentWidth, height: 1,
    color: COLORS.gray
  });

  page.drawText('KYWARD - Bitcoin Security Made Simple', {
    x: margin, y: y - 10,
    font: helveticaBold, size: 10,
    color: COLORS.orange
  });

  page.drawText('This document is confidential. Store securely and never share your seed phrase.', {
    x: margin, y: y - 25,
    font: helvetica, size: 9,
    color: COLORS.gray
  });

  // ==========================================
  // Encrypt with password
  // ==========================================
  const pdfBytes = await pdfDoc.save({
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

  return Buffer.from(pdfBytes);
}

module.exports = {
  generateSecurityPlanPdf
};
