import React from 'react';
import { useLanguage } from '../i18n';

const Footer = () => {
  const { t } = useLanguage();

  const footerStyles = {
    footer: {
      backgroundColor: '#0a0a0a',
      borderTop: '1px solid #1a1a1a',
      padding: '48px 24px 32px',
      marginTop: 'auto',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    topSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: '40px',
      marginBottom: '40px',
    },
    logoSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    logoText: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#F7931A',
    },
    tagline: {
      fontSize: '14px',
      color: '#6b7280',
      maxWidth: '280px',
      lineHeight: '1.5',
    },
    contactSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    contactTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#fff',
      marginBottom: '4px',
    },
    contactEmail: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '14px',
      color: '#9ca3af',
      textDecoration: 'none',
      transition: 'color 0.3s',
    },
    socialSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    socialTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#fff',
    },
    socialIcons: {
      display: 'flex',
      gap: '12px',
    },
    socialLink: {
      width: '44px',
      height: '44px',
      borderRadius: '12px',
      backgroundColor: '#1a1a1a',
      border: '1px solid #2a2a2a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    divider: {
      height: '1px',
      backgroundColor: '#1a1a1a',
      marginBottom: '24px',
    },
    bottomSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px',
    },
    copyright: {
      fontSize: '13px',
      color: '#6b7280',
    },
    bottomLinks: {
      display: 'flex',
      gap: '24px',
    },
    bottomLink: {
      fontSize: '13px',
      color: '#6b7280',
      textDecoration: 'none',
      transition: 'color 0.3s',
      cursor: 'pointer',
    },
  };

  return (
    <footer style={footerStyles.footer} className="site-footer">
      <div style={footerStyles.container}>
        <div style={footerStyles.topSection}>
          {/* Logo & Tagline */}
          <div style={footerStyles.logoSection}>
            <div style={footerStyles.logo}>
              <img
                src="/vite.svg"
                alt="Kyward"
                style={{ width: '36px', height: '36px' }}
              />
              <span style={footerStyles.logoText}>Kyward</span>
            </div>
            <p style={footerStyles.tagline}>
              {t?.landing?.footer?.tagline || 'Empowering your Bitcoin security journey with personalized assessments and expert guidance.'}
            </p>
          </div>

          {/* Contact */}
          <div style={footerStyles.contactSection}>
            <h4 style={footerStyles.contactTitle}>Contact</h4>
            <a
              href="mailto:contact@kyward.com"
              style={footerStyles.contactEmail}
              className="footer-link"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M22 6L12 13L2 6"/>
              </svg>
              contact@kyward.com
            </a>
          </div>

          {/* Social Links */}
          <div style={footerStyles.socialSection}>
            <h4 style={footerStyles.socialTitle}>Follow Us</h4>
            <div style={footerStyles.socialIcons}>
              {/* Instagram - PUT YOUR LINK HERE */}
              <a
                href="https://www.instagram.com/kywardb?igsh=MTF1Z2t5OHV6ZGV1aQ=="
                target="_blank"
                rel="noopener noreferrer"
                style={footerStyles.socialLink}
                className="social-icon"
                aria-label="Instagram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>

              {/* X (Twitter) - PUT YOUR LINK HERE */}
              <a
                href="https://x.com/kywardb"
                target="_blank"
                rel="noopener noreferrer"
                style={footerStyles.socialLink}
                className="social-icon"
                aria-label="X (Twitter)"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#9ca3af">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div style={footerStyles.divider} />

        <div style={footerStyles.bottomSection}>
          <p style={footerStyles.copyright}>
            {t?.landing?.footer?.copyright || `© ${new Date().getFullYear()} Kyward. All rights reserved.`}
          </p>
          <div style={footerStyles.bottomLinks}>
            <span style={footerStyles.bottomLink} className="footer-link">Privacy Policy</span>
            <span style={footerStyles.bottomLink} className="footer-link">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
