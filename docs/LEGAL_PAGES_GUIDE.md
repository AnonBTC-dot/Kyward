# Legal Pages Documentation / Documentación de Páginas Legales

This document explains the legal content on Kyward and how to modify it.

---

## Table of Contents
1. [Overview](#overview)
2. [Privacy Policy Explained](#privacy-policy-explained)
3. [Terms of Service Explained](#terms-of-service-explained)
4. [How to Modify Legal Content](#how-to-modify-legal-content)
5. [Important Legal Considerations](#important-legal-considerations)

---

## Overview

Kyward has two legal pages:
- **Privacy Policy** (`src/components/PrivacyPolicy.jsx`)
- **Terms of Service** (`src/components/TermsOfService.jsx`)

Both pages are translated in English and Spanish, with all text stored in:
- **File:** `src/i18n/translations.js`
- **English:** `en.legal.privacy` and `en.legal.terms`
- **Spanish:** `es.legal.privacy` and `es.legal.terms`

---

## Privacy Policy Explained

### Section 1: Introduction
**What it says:** Identifies Kyward as the operator, located in Bogota, Colombia.

**Why it matters:** Establishes jurisdiction and who is responsible for the service.

**Customizable:** Change location if company registration changes.

---

### Section 2: Information We Collect
**What it says:** We collect:
- Email address (for accounts)
- Assessment answers (stored in Supabase)
- Payment transaction IDs (not wallet data)

**Why it matters:** Users must know what data you collect. This is a legal requirement in most countries.

**Customizable:** If you add new data collection (like phone numbers for 2FA), add it here.

---

### Section 3: No KYC Policy
**What it says:** We don't require identity documents.

**Why it matters:** This is a key selling point for Kyward. Differentiates from traditional services.

**Customizable:** If you ever add KYC requirements, this section must change.

---

### Section 4: Data Storage & Security
**What it says:** Data is stored in Supabase with encryption.

**Why it matters:** Users want to know their data is secure.

**Customizable:** If you change database providers, update this section.

---

### Section 5: How We Use Your Data
**What it says:** We use data to provide services, generate recommendations, process payments, and communicate.

**Why it matters:** Users must consent to how their data is used.

**Customizable:** Add any new uses (like AI training) if applicable.

---

### Section 6: Data Sharing
**What it says:** We don't sell data. Only share with:
- Database hosting provider (Supabase)
- Legal authorities if required by Colombian law

**Why it matters:** Trust. Users need to know their data isn't being sold.

**Customizable:** If you add analytics, payment processors, or other third parties, list them here.

---

### Section 7: Payment Privacy
**What it says:** Crypto payments go directly to Kyward wallets. Only transaction IDs are stored.

**Why it matters:** Reassures users their payment info is private.

**Customizable:** If you add fiat payment methods (credit cards), update this section significantly.

---

### Section 8: Cookies & Analytics
**What it says:** Currently no analytics or third-party cookies.

**Why it matters:** Cookie consent is legally required in EU and many other places.

**Customizable:** If you add Google Analytics or similar, you MUST update this section and potentially add a cookie consent banner.

---

### Section 9: Your Rights
**What it says:** Users can access, correct, or delete their data.

**Why it matters:** GDPR and similar laws require this.

**Customizable:** Add more rights if operating in specific jurisdictions (like California's CCPA).

---

### Section 10: Changes to Policy
**What it says:** We'll notify users of significant changes.

**Why it matters:** Legal best practice.

**Customizable:** Rarely needs changes.

---

## Terms of Service Explained

### Important Disclaimer (Warning Box)
**What it says:** Kyward is educational, NOT financial/investment advice.

**Why it matters:** CRITICAL legal protection. Bitcoin services can be misinterpreted as investment advice.

**Customizable:** DO NOT weaken this disclaimer. You can strengthen it if needed.

---

### Section 1: Acceptance of Terms
**What it says:** Using the service means accepting these terms.

**Why it matters:** Creates a binding agreement.

**Customizable:** Rarely needs changes.

---

### Section 2: Service Description
**What it says:** Lists what Kyward provides:
- Security assessments
- Recommendations
- Educational content
- Sentinel monitoring (optional)
- Consultations (optional)

**Why it matters:** Defines scope of services.

**Customizable:** Add new services as you launch them.

---

### Section 3: Not Financial Advice
**What it says:** Kyward is EDUCATIONAL. Not investment, financial, tax, or legal advice.

**Why it matters:** CRITICAL. Protects Kyward from liability if users lose money.

**Customizable:** DO NOT weaken. Can add more disclaimers.

---

### Section 4: User Responsibilities
**What it says:** Users must:
- Provide accurate info
- Keep credentials secure
- Not share accounts
- Not use for illegal activities
- Take responsibility for their own security

**Why it matters:** Sets user obligations.

**Customizable:** Add more responsibilities as needed.

---

### Section 5: Payments & Refunds
**What it says:**
- Crypto payments (BTC, USDT)
- ALL SALES ARE FINAL (no refunds)
- Subscriptions can be cancelled but no prorated refunds

**Why it matters:** Clear payment terms prevent disputes.

**Customizable:**
- If you add refund policy, update this section
- If you add fiat payments, update accepted methods

---

### Section 6: Intellectual Property
**What it says:** All content is Kyward's property.

**Why it matters:** Protects your content from being copied.

**Customizable:** Rarely needs changes.

---

### Section 7: Limitation of Liability
**What it says:** Kyward is NOT responsible for:
- Loss of Bitcoin or funds
- Security breaches on user's end
- Damages from using the service
- Maximum liability = amount user paid

**Why it matters:** CRITICAL. Limits legal exposure.

**Customizable:** DO NOT weaken. Consult a lawyer before changes.

---

### Section 8: Account Termination
**What it says:** Kyward can suspend/terminate accounts for violations.

**Why it matters:** Gives you the right to remove bad actors.

**Customizable:** Add specific ban-worthy behaviors if needed.

---

### Section 9: Governing Law
**What it says:** Colombian law applies. Disputes resolved in Bogota courts.

**Why it matters:** Establishes legal jurisdiction.

**Customizable:** If you move company registration, update this.

---

### Section 10: Changes to Terms
**What it says:** We can modify terms with notice.

**Why it matters:** Allows policy updates.

**Customizable:** Rarely needs changes.

---

## How to Modify Legal Content

### Step 1: Edit Translations File
Open `src/i18n/translations.js`

### Step 2: Find the Legal Section
Search for `legal: {` - you'll find two instances:
- English version (around line 1233)
- Spanish version (around line 2555)

### Step 3: Edit the Text
Each section has keys like:
```javascript
privacy: {
  title: 'Privacy Policy',
  introTitle: '1. Introduction',
  introText: 'Your text here...',
  // ... more keys
}
```

### Step 4: Update Both Languages
**IMPORTANT:** Always update BOTH English (`en.legal`) AND Spanish (`es.legal`) versions!

### Step 5: Update the "Last Updated" Date
Change `lastUpdated` in both languages:
```javascript
lastUpdated: 'Last updated: February 2025',  // English
lastUpdated: 'Última actualización: Febrero 2025',  // Spanish
```

### Example: Adding a New Section
If you want to add "Section 11: Arbitration":

**English:**
```javascript
arbitrationTitle: '11. Arbitration',
arbitrationText: 'Any disputes will be resolved through binding arbitration...',
```

**Spanish:**
```javascript
arbitrationTitle: '11. Arbitraje',
arbitrationText: 'Cualquier disputa se resolverá mediante arbitraje vinculante...',
```

Then update the component (`PrivacyPolicy.jsx` or `TermsOfService.jsx`) to display the new section.

---

## Important Legal Considerations

### 1. Consult a Lawyer
This documentation explains the INTENT behind each section. For actual legal compliance, consult a lawyer licensed in:
- Colombia (where Kyward is registered)
- Any country where you have significant users

### 2. Critical Sections - DO NOT WEAKEN
These sections protect Kyward from lawsuits:
- "Not Financial Advice" disclaimer
- Limitation of Liability
- No Refunds policy

### 3. When to Update
Update legal pages when you:
- Add new features (especially paid ones)
- Change data collection practices
- Add third-party services (analytics, payment processors)
- Change company registration
- Expand to new countries with different laws

### 4. Notification Requirements
When making MAJOR changes, notify users via:
- Email (if you have email marketing set up)
- Website banner
- At minimum, update the "Last Updated" date

### 5. Record Keeping
Keep a log of all changes to legal documents with:
- Date of change
- What was changed
- Why it was changed

---

## File Locations Summary

| File | Purpose |
|------|---------|
| `src/components/PrivacyPolicy.jsx` | Privacy Policy component/layout |
| `src/components/TermsOfService.jsx` | Terms of Service component/layout |
| `src/i18n/translations.js` | All text content (EN & ES) |
| `src/components/Footer.jsx` | Links to legal pages |
| `src/App.jsx` | Page routing |

---

## Quick Reference: Translation Keys

### Privacy Policy (`legal.privacy`)
| Key | Description |
|-----|-------------|
| `title` | Page title |
| `lastUpdated` | Last update date |
| `highlight` | Top highlight box text |
| `introTitle`, `introText`, `introText2` | Section 1 |
| `dataTitle`, `dataIntro`, `dataItem1-3` | Section 2 |
| `kycTitle`, `kycText` | Section 3 |
| `storageTitle`, `storageText`, `storageText2` | Section 4 |
| `usageTitle`, `usageItem1-4` | Section 5 |
| `sharingTitle`, `sharingText`, `sharingItem1-2` | Section 6 |
| `paymentsTitle`, `paymentsText` | Section 7 |
| `cookiesTitle`, `cookiesText` | Section 8 |
| `rightsTitle`, `rightsIntro`, `rightsItem1-4` | Section 9 |
| `changesTitle`, `changesText` | Section 10 |
| `contactTitle`, `contactText` | Contact section |

### Terms of Service (`legal.terms`)
| Key | Description |
|-----|-------------|
| `title` | Page title |
| `lastUpdated` | Last update date |
| `disclaimer` | Warning box text |
| `acceptTitle`, `acceptText` | Section 1 |
| `serviceTitle`, `serviceText`, `serviceItem1-5` | Section 2 |
| `adviceTitle`, `adviceHighlight`, `adviceText`, `adviceText2` | Section 3 |
| `userTitle`, `userIntro`, `userItem1-5` | Section 4 |
| `paymentTitle`, `paymentText`, `refundPolicy`, `paymentText2` | Section 5 |
| `ipTitle`, `ipText` | Section 6 |
| `liabilityTitle`, `liabilityText`, `liabilityItem1-4`, `liabilityText2` | Section 7 |
| `terminationTitle`, `terminationText` | Section 8 |
| `lawTitle`, `lawText` | Section 9 |
| `changesTitle`, `changesText` | Section 10 |
| `contactTitle`, `contactText` | Contact section |

---

## Contact for Legal Questions

For legal questions about Kyward: **contact@kyward.com**
