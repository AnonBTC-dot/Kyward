import React, { useState } from 'react';
import { kywardDB } from '../services/Database';
import { styles } from '../styles/Theme';
import { useLanguage, LanguageToggle } from '../i18n';

const AuthForm = ({ onAuthSuccess, onBack }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');

    try {
      const result = await kywardDB.login(trimmed);
      if (result.success) {
        onAuthSuccess(result.user);
      } else {
        setError(result.message || 'Could not sign in. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={styles.authContainer}>
      <div className="auth-card" style={styles.authCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', width: '100%' }}>
          <button onClick={onBack} style={{ ...styles.backButton, margin: 0 }}>
            ← {t.auth.back}
          </button>
          <div style={{ marginLeft: 'auto' }}>
            <LanguageToggle />
          </div>
        </div>

        <div style={styles.authLogo}>
          <img src="/vite.svg" alt="Kyward" style={{ width: '48px', height: '48px' }} />
          <h2 className="auth-title" style={styles.authTitle}>Access your account</h2>
          <p className="auth-subtitle" style={styles.authSubtitle}>
            Enter your email to view your security score and history
          </p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>{t.auth.email}</label>
            <input
              type="email"
              style={styles.input}
              placeholder="satoshi@blockmail.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              required
              autoFocus
            />
          </div>

          <button type="submit" style={styles.authSubmit} disabled={loading || !email.trim()}>
            {loading ? <div style={styles.spinner} /> : 'Access account →'}
          </button>
        </form>

        <p style={{ marginTop: '20px', color: '#6b7280', fontSize: '13px', textAlign: 'center' }}>
          {t.auth.footer}
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
