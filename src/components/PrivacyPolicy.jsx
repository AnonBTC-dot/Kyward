import React from 'react';
import { useLanguage } from '../i18n';

const PrivacyPolicy = ({ onBack }) => {
  const { t } = useLanguage();
  const legal = t.legal?.privacy || {};

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#000',
      fontFamily: '"Space Grotesk", sans-serif',
      padding: '100px 24px 60px',
    },
    content: {
      maxWidth: '800px',
      margin: '0 auto',
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      backgroundColor: 'transparent',
      border: '1px solid #2a2a2a',
      color: '#9ca3af',
      borderRadius: '8px',
      fontSize: '14px',
      cursor: 'pointer',
      marginBottom: '32px',
      transition: 'all 0.3s',
    },
    title: {
      fontSize: '42px',
      fontWeight: '800',
      color: '#fff',
      marginBottom: '16px',
    },
    lastUpdated: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '40px',
    },
    section: {
      marginBottom: '32px',
    },
    sectionTitle: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#F7931A',
      marginBottom: '16px',
    },
    paragraph: {
      fontSize: '15px',
      color: '#9ca3af',
      lineHeight: '1.8',
      marginBottom: '16px',
    },
    list: {
      listStyle: 'none',
      padding: 0,
      margin: '0 0 16px 0',
    },
    listItem: {
      fontSize: '15px',
      color: '#9ca3af',
      lineHeight: '1.8',
      marginBottom: '8px',
      paddingLeft: '20px',
      position: 'relative',
    },
    bullet: {
      position: 'absolute',
      left: 0,
      color: '#F7931A',
    },
    highlight: {
      backgroundColor: 'rgba(247,147,26,0.1)',
      border: '1px solid rgba(247,147,26,0.3)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px',
    },
    highlightText: {
      fontSize: '15px',
      color: '#F7931A',
      fontWeight: '600',
      margin: 0,
    },
    contact: {
      backgroundColor: '#1a1a1a',
      border: '1px solid #2a2a2a',
      borderRadius: '12px',
      padding: '24px',
      marginTop: '40px',
    },
    contactTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#fff',
      marginBottom: '12px',
    },
    contactEmail: {
      fontSize: '15px',
      color: '#F7931A',
      textDecoration: 'none',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <button onClick={onBack} style={styles.backButton}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          {legal.back || 'Back'}
        </button>

        <h1 style={styles.title}>{legal.title || 'Privacy Policy'}</h1>
        <p style={styles.lastUpdated}>{legal.lastUpdated || 'Last updated: February 2025'}</p>

        {/* Key Highlight */}
        <div style={styles.highlight}>
          <p style={styles.highlightText}>
            {legal.highlight || 'Kyward is committed to your privacy. We practice minimal data collection and never sell your information.'}
          </p>
        </div>

        {/* Introduction */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{legal.introTitle || '1. Introduction'}</h2>
          <p style={styles.paragraph}>
            {legal.introText || 'Kyward ("we", "our", or "us") operates the kyward.com website and provides Bitcoin self-custody security assessment services. This Privacy Policy explains how we collect, use, and protect your information when you use our services.'}
          </p>
          <p style={styles.paragraph}>
            {legal.introText2 || 'Kyward is registered and operates from Bogota, Colombia, and complies with applicable Colombian data protection laws.'}
          </p>
        </div>

        {/* Data Collection */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{legal.dataTitle || '2. Information We Collect'}</h2>
          <p style={styles.paragraph}>{legal.dataIntro || 'We collect minimal information necessary to provide our services:'}</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {legal.dataItem1 || 'Email address - Required for account creation and communication'}
            </li>
            <li style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {legal.dataItem2 || 'Security assessment answers - Stored to generate your security score and recommendations'}
            </li>
            <li style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {legal.dataItem3 || 'Payment information - Transaction IDs for cryptocurrency payments (we do not store private keys or wallet seeds)'}
            </li>
          </ul>
        </div>

        {/* No KYC */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{legal.kycTitle || '3. No KYC Policy'}</h2>
          <p style={styles.paragraph}>
            {legal.kycText || 'We do NOT require or collect: government IDs, proof of address, photos, phone numbers, or any other identity verification documents. Your privacy is paramount to us.'}
          </p>
        </div>

        {/* Data Storage */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{legal.storageTitle || '4. Data Storage & Security'}</h2>
          <p style={styles.paragraph}>
            {legal.storageText || 'Your data is stored securely using Supabase, a trusted cloud database provider with encryption at rest and in transit. We implement industry-standard security measures to protect your information.'}
          </p>
          <p style={styles.paragraph}>
            {legal.storageText2 || 'We retain your data only as long as your account is active. You can request deletion of your account and all associated data at any time.'}
          </p>
        </div>

        {/* Data Usage */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{legal.usageTitle || '5. How We Use Your Data'}</h2>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {legal.usageItem1 || 'Provide and improve our security assessment services'}
            </li>
            <li style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {legal.usageItem2 || 'Generate personalized security recommendations'}
            </li>
            <li style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {legal.usageItem3 || 'Process payments and provide customer support'}
            </li>
            <li style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {legal.usageItem4 || 'Send service-related communications (with your consent for marketing)'}
            </li>
          </ul>
        </div>

        {/* Data Sharing */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{legal.sharingTitle || '6. Data Sharing'}</h2>
          <p style={styles.paragraph}>
            {legal.sharingText || 'We do NOT sell, trade, or rent your personal information to third parties. We may share data only with:'}
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {legal.sharingItem1 || 'Service providers necessary to operate our platform (database hosting)'}
            </li>
            <li style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {legal.sharingItem2 || 'Legal authorities if required by Colombian law'}
            </li>
          </ul>
        </div>

        {/* Payments */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{legal.paymentsTitle || '7. Payment Privacy'}</h2>
          <p style={styles.paragraph}>
            {legal.paymentsText || 'We accept cryptocurrency payments (Bitcoin and USDT) directly to our wallets. We do not use third-party payment processors that could track your identity. Only transaction IDs are stored for order verification.'}
          </p>
        </div>

        {/* Cookies */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{legal.cookiesTitle || '8. Cookies & Analytics'}</h2>
          <p style={styles.paragraph}>
            {legal.cookiesText || 'We currently do not use analytics tracking tools or third-party cookies. We only use essential cookies required for the website to function (session management, language preferences).'}
          </p>
        </div>

        {/* User Rights */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{legal.rightsTitle || '9. Your Rights'}</h2>
          <p style={styles.paragraph}>{legal.rightsIntro || 'You have the right to:'}</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {legal.rightsItem1 || 'Access your personal data'}
            </li>
            <li style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {legal.rightsItem2 || 'Request correction of inaccurate data'}
            </li>
            <li style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {legal.rightsItem3 || 'Request deletion of your account and data'}
            </li>
            <li style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {legal.rightsItem4 || 'Opt-out of marketing communications'}
            </li>
          </ul>
        </div>

        {/* Changes */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{legal.changesTitle || '10. Changes to This Policy'}</h2>
          <p style={styles.paragraph}>
            {legal.changesText || 'We may update this Privacy Policy from time to time. We will notify users of significant changes via email or website notification. Continued use of our services after changes constitutes acceptance.'}
          </p>
        </div>

        {/* Contact */}
        <div style={styles.contact}>
          <h3 style={styles.contactTitle}>{legal.contactTitle || 'Questions?'}</h3>
          <p style={styles.paragraph}>
            {legal.contactText || 'For privacy-related inquiries, contact us at:'}
          </p>
          <a href="mailto:contact@kyward.com" style={styles.contactEmail}>contact@kyward.com</a>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
