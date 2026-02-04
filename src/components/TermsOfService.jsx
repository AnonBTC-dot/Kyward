import React from 'react';
import { useLanguage } from '../i18n';

const TermsOfService = ({ onBack }) => {
  const { t } = useLanguage();
  const legal = t.legal?.terms || {};

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
    warning: {
      backgroundColor: 'rgba(239,68,68,0.1)',
      border: '1px solid rgba(239,68,68,0.3)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px',
    },
    warningText: {
      fontSize: '15px',
      color: '#ef4444',
      fontWeight: '600',
      margin: 0,
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

        <h1 style={styles.title}>{legal.title || 'Terms of Service'}</h1>
        <p style={styles.lastUpdated}>{legal.lastUpdated || 'Last updated: February 2025'}</p>

        {/* Important Disclaimer */}
        <div style={styles.warning}>
          <p style={styles.warningText}>
            {legal.disclaimer || 'IMPORTANT: Kyward provides educational content about Bitcoin self-custody security. We do NOT provide financial, investment, or legal advice. You are solely responsible for your Bitcoin security decisions.'}
          </p>
        </div>

        {/* Acceptance */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{legal.acceptTitle || '1. Acceptance of Terms'}</h2>
          <p style={styles.paragraph}>
            {legal.acceptText || 'By accessing or using Kyward\'s services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.'}
          </p>
          <p style={styles.paragraph}>
            {legal.acceptText2 || 'You must be at least 18 years old to use our services. By using Kyward, you represent that you are at least 18 years of age.'}
          </p>
        </div>

        {/* Service Description */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{legal.serviceTitle || '2. Service Description'}</h2>
          <p style={styles.paragraph}>
            {legal.serviceText || 'Kyward provides Bitcoin self-custody security assessment services, including:'}
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {legal.serviceItem1 || 'Security questionnaires and assessments'}
            </li>
            <li style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {legal.serviceItem2 || 'Personalized security scores and recommendations'}
            </li>
            <li style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {legal.serviceItem3 || 'Educational content about Bitcoin security best practices'}
            </li>
            <li style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {legal.serviceItem4 || 'Optional monitoring and alert services (Sentinel plan)'}
            </li>
            <li style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {legal.serviceItem5 || 'Optional consultation services'}
            </li>
          </ul>
        </div>

        {/* Not Financial Advice */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{legal.adviceTitle || '3. Not Financial or Investment Advice'}</h2>
          <div style={styles.highlight}>
            <p style={styles.highlightText}>
              {legal.adviceHighlight || 'Kyward is an EDUCATIONAL platform. Nothing on this website constitutes financial, investment, tax, or legal advice.'}
            </p>
          </div>
          <p style={styles.paragraph}>
            {legal.adviceText || 'Our security assessments and recommendations are educational tools to help you understand Bitcoin self-custody best practices. We do not recommend specific investments, endorse any cryptocurrency, or guarantee any outcomes.'}
          </p>
          <p style={styles.paragraph}>
            {legal.adviceText2 || 'You should consult with qualified professionals before making any financial decisions. Kyward and its team are not responsible for any investment decisions you make.'}
          </p>
        </div>

        {/* User Responsibilities */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{legal.userTitle || '4. User Responsibilities'}</h2>
          <p style={styles.paragraph}>{legal.userIntro || 'By using our services, you agree to:'}</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {legal.userItem1 || 'Provide accurate information in security assessments'}
            </li>
            <li style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {legal.userItem2 || 'Keep your account credentials secure and confidential'}
            </li>
            <li style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {legal.userItem3 || 'Not share your account with others'}
            </li>
            <li style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {legal.userItem4 || 'Not use our services for illegal activities'}
            </li>
            <li style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {legal.userItem5 || 'Take full responsibility for your own Bitcoin security'}
            </li>
          </ul>
        </div>

        {/* Payments */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{legal.paymentTitle || '5. Payments & Refunds'}</h2>
          <p style={styles.paragraph}>
            {legal.paymentText || 'We accept cryptocurrency payments including Bitcoin (BTC) and USDT. Prices are displayed in USD but payment is made in cryptocurrency at the current exchange rate.'}
          </p>
          <div style={styles.warning}>
            <p style={styles.warningText}>
              {legal.refundPolicy || 'ALL SALES ARE FINAL. Due to the digital nature of our services and cryptocurrency payment methods, we do not offer refunds. Please review our services carefully before purchasing.'}
            </p>
          </div>
          <p style={styles.paragraph}>
            {legal.paymentText2 || 'Subscription services (Sentinel plan) can be cancelled at any time. Cancellation stops future billing but does not refund the current billing period.'}
          </p>
        </div>

        {/* Intellectual Property */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{legal.ipTitle || '6. Intellectual Property'}</h2>
          <p style={styles.paragraph}>
            {legal.ipText || 'All content on Kyward, including text, graphics, logos, assessments, recommendations, and software, is the property of Kyward and protected by intellectual property laws. You may not copy, reproduce, distribute, or create derivative works without our written permission.'}
          </p>
        </div>

        {/* Limitation of Liability */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{legal.liabilityTitle || '7. Limitation of Liability'}</h2>
          <p style={styles.paragraph}>
            {legal.liabilityText || 'TO THE MAXIMUM EXTENT PERMITTED BY LAW:'}
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {legal.liabilityItem1 || 'Kyward is NOT responsible for any loss of Bitcoin, cryptocurrency, or funds'}
            </li>
            <li style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {legal.liabilityItem2 || 'We do NOT guarantee the security of your self-custody setup'}
            </li>
            <li style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {legal.liabilityItem3 || 'We are NOT liable for any damages arising from use of our services'}
            </li>
            <li style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {legal.liabilityItem4 || 'Our maximum liability is limited to the amount you paid for services'}
            </li>
          </ul>
          <p style={styles.paragraph}>
            {legal.liabilityText2 || 'You acknowledge that Bitcoin and cryptocurrency involve significant risks. You are solely responsible for securing your private keys, seed phrases, and funds.'}
          </p>
        </div>

        {/* Account Termination */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{legal.terminationTitle || '8. Account Termination'}</h2>
          <p style={styles.paragraph}>
            {legal.terminationText || 'We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or abuse our services. You may delete your account at any time through the dashboard or by contacting support.'}
          </p>
        </div>

        {/* Governing Law */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{legal.lawTitle || '9. Governing Law'}</h2>
          <p style={styles.paragraph}>
            {legal.lawText || 'These Terms of Service are governed by and construed in accordance with the laws of Colombia. Any disputes arising from these terms or our services shall be resolved in the courts of Bogota, Colombia.'}
          </p>
        </div>

        {/* Changes */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{legal.changesTitle || '10. Changes to Terms'}</h2>
          <p style={styles.paragraph}>
            {legal.changesText || 'We may modify these Terms of Service at any time. Significant changes will be communicated via email or website notification. Continued use of our services after changes constitutes acceptance of the modified terms.'}
          </p>
        </div>

        {/* Contact */}
        <div style={styles.contact}>
          <h3 style={styles.contactTitle}>{legal.contactTitle || 'Questions?'}</h3>
          <p style={styles.paragraph}>
            {legal.contactText || 'For questions about these terms, contact us at:'}
          </p>
          <a href="mailto:contact@kyward.com" style={styles.contactEmail}>contact@kyward.com</a>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
