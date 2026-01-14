import React, { useState } from 'react';
import { kywardDB } from '../services/Database';
import { styles } from '../styles/Theme';
import { useLanguage, LanguageToggle } from '../i18n';

const AuthForm = ({ initialMode = 'login', onAuthSuccess, onBack }) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState(initialMode); // 'login', 'signup', 'forgot', 'reset'
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', newPassword: '', confirmNewPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  // Password validation checks (for signup)
  const passwordChecks = {
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
  };

  // Password validation checks (for reset)
  const newPasswordChecks = {
    minLength: formData.newPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.newPassword),
    hasLowercase: /[a-z]/.test(formData.newPassword),
    hasNumber: /[0-9]/.test(formData.newPassword),
  };

  const isPasswordValid = passwordChecks.minLength && passwordChecks.hasUppercase &&
                          passwordChecks.hasLowercase && passwordChecks.hasNumber;

  const isNewPasswordValid = newPasswordChecks.minLength && newPasswordChecks.hasUppercase &&
                             newPasswordChecks.hasLowercase && newPasswordChecks.hasNumber;

  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';
  const newPasswordsMatch = formData.newPassword === formData.confirmNewPassword && formData.confirmNewPassword !== '';

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  // Handle forgot password - verify email exists
  const handleForgotPassword = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (kywardDB.userExists(formData.email)) {
        setResetEmail(formData.email);
        setMode('reset');
        setSuccess('Email verified! Create your new password.');
      } else {
        setError('No account found with this email address.');
      }
      setLoading(false);
    }, 1000);
  };

  // Handle password reset
  const handleResetPassword = (e) => {
    e.preventDefault();

    if (!isNewPasswordValid) {
      setError('Please meet all password requirements');
      return;
    }
    if (!newPasswordsMatch) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = kywardDB.resetPassword(resetEmail, formData.newPassword);
      if (result.success) {
        setSuccess('Password reset successfully! You can now login.');
        setTimeout(() => {
          setMode('login');
          setIsLogin(true);
          setFormData({ email: resetEmail, password: '', confirmPassword: '', newPassword: '', confirmNewPassword: '' });
          setSuccess('');
        }, 2000);
      } else {
        setError(result.message);
      }
      setLoading(false);
    }, 1000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      const result = kywardDB.login(formData.email, formData.password);
      if (result.success) {
        onAuthSuccess(result.user, result.token);
      } else {
        setError(result.message);
      }
      setLoading(false);
    }, 1000);
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      setError("Please meet all password requirements");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = kywardDB.createUser({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        setSuccess('Account created! Logging you in...');
        setTimeout(() => {
          const loginRes = kywardDB.login(formData.email, formData.password);
          onAuthSuccess(loginRes.user, loginRes.token);
        }, 1500);
      } else {
        setError(result.message);
      }
      setLoading(false);
    }, 1000);
  };

  // Helper to render password requirements
  const renderPasswordRequirements = (checks) => (
    <div style={styles.passwordReqsContainer}>
      <div style={styles.passwordReqsTitle}>{t.auth.passwordRequirements.title}</div>
      <div style={styles.passwordReqsGrid}>
        <div style={{...styles.passwordReqItem, ...(checks.minLength ? styles.passwordReqMet : {})}}>
          <span style={{...styles.passwordReqIcon, ...(checks.minLength ? styles.passwordReqIconMet : {})}}>
            {checks.minLength ? '✓' : '○'}
          </span>
          {t.auth.passwordRequirements.minLength}
        </div>
        <div style={{...styles.passwordReqItem, ...(checks.hasUppercase ? styles.passwordReqMet : {})}}>
          <span style={{...styles.passwordReqIcon, ...(checks.hasUppercase ? styles.passwordReqIconMet : {})}}>
            {checks.hasUppercase ? '✓' : '○'}
          </span>
          {t.auth.passwordRequirements.uppercase}
        </div>
        <div style={{...styles.passwordReqItem, ...(checks.hasLowercase ? styles.passwordReqMet : {})}}>
          <span style={{...styles.passwordReqIcon, ...(checks.hasLowercase ? styles.passwordReqIconMet : {})}}>
            {checks.hasLowercase ? '✓' : '○'}
          </span>
          {t.auth.passwordRequirements.lowercase}
        </div>
        <div style={{...styles.passwordReqItem, ...(checks.hasNumber ? styles.passwordReqMet : {})}}>
          <span style={{...styles.passwordReqIcon, ...(checks.hasNumber ? styles.passwordReqIconMet : {})}}>
            {checks.hasNumber ? '✓' : '○'}
          </span>
          {t.auth.passwordRequirements.number}
        </div>
      </div>
      <div style={styles.passwordStrengthContainer}>
        <div style={styles.passwordStrengthLabel}>Strength:</div>
        <div style={styles.passwordStrengthBar}>
          <div style={{
            ...styles.passwordStrengthFill,
            width: `${Object.values(checks).filter(Boolean).length * 25}%`,
            backgroundColor: Object.values(checks).filter(Boolean).length <= 1 ? '#ef4444' :
                             Object.values(checks).filter(Boolean).length <= 2 ? '#f59e0b' :
                             Object.values(checks).filter(Boolean).length <= 3 ? '#F7931A' : '#22c55e'
          }} />
        </div>
        <span style={{
          ...styles.passwordStrengthText,
          color: Object.values(checks).filter(Boolean).length <= 1 ? '#ef4444' :
                 Object.values(checks).filter(Boolean).length <= 2 ? '#f59e0b' :
                 Object.values(checks).filter(Boolean).length <= 3 ? '#F7931A' : '#22c55e'
        }}>
          {Object.values(checks).filter(Boolean).length <= 1 ? t.auth.passwordStrength.weak :
           Object.values(checks).filter(Boolean).length <= 2 ? t.auth.passwordStrength.fair :
           Object.values(checks).filter(Boolean).length <= 3 ? t.auth.passwordStrength.good : t.auth.passwordStrength.strong}
        </span>
      </div>
    </div>
  );

  // Get title and subtitle based on mode
  const getTitle = () => {
    if (mode === 'forgot') return t.auth.forgotTitle;
    if (mode === 'reset') return t.auth.resetTitle;
    return isLogin ? t.auth.loginTitle : t.auth.signupTitle;
  };

  const getSubtitle = () => {
    if (mode === 'forgot') return t.auth.forgotSubtitle;
    if (mode === 'reset') return `${t.auth.resetSubtitle} ${resetEmail}`;
    return isLogin ? t.auth.loginSubtitle : t.auth.signupSubtitle;
  };

  return (
    <div style={styles.authContainer}>
      <div className="auth-card" style={styles.authCard}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px',
          width: '100%' 
        }}>
          {/* Botón Back a la izquierda */}
          <button 
            onClick={mode === 'forgot' || mode === 'reset' ? () => { setMode('login'); setIsLogin(true); setError(''); setSuccess(''); } : onBack} 
            style={{ ...styles.backButton, margin: 0 }}
          >
            ← {mode === 'forgot' || mode === 'reset' ? t.auth.backToLogin : t.auth.back}
          </button>

          {/* Idioma a la derecha */}
          <div style={{ marginLeft: 'auto' }}>
            <LanguageToggle />
          </div>
        </div>
        <div style={styles.authLogo}>
          <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" fill="#F7931A" opacity="0.2"/>
            <path d="M20 8L28 13V27L20 32L12 27V13L20 8Z" stroke="#F7931A" strokeWidth="2.5" strokeLinejoin="round"/>
          </svg>
          <h2 className="auth-title" style={styles.authTitle}>{getTitle()}</h2>
          <p className="auth-subtitle" style={styles.authSubtitle}>{getSubtitle()}</p>
        </div>

        {success && <div style={styles.successBox}>{success}</div>}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>{t.auth.email}</label>
              <input
                type="email"
                name="email"
                style={styles.input}
                placeholder="satoshi@blockmail.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" style={styles.authSubmit} disabled={loading}>
              {loading ? <div style={styles.spinner} /> : t.auth.verifyEmail}
            </button>
          </form>
        )}

        {/* RESET PASSWORD FORM */}
        {mode === 'reset' && (
          <form onSubmit={handleResetPassword}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>{t.auth.newPassword}</label>
              <input
                type="password"
                name="newPassword"
                style={styles.input}
                placeholder="••••••••"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            {formData.newPassword.length > 0 && renderPasswordRequirements(newPasswordChecks)}

            <div style={styles.inputGroup}>
              <label style={styles.label}>{t.auth.confirmNewPassword}</label>
              <input
                type="password"
                name="confirmNewPassword"
                style={{
                  ...styles.input,
                  ...(formData.confirmNewPassword.length > 0 ?
                    (newPasswordsMatch ? styles.inputSuccess : styles.inputError) : {})
                }}
                placeholder="••••••••"
                value={formData.confirmNewPassword}
                onChange={handleInputChange}
                required
              />
              {formData.confirmNewPassword.length > 0 && (
                <div style={newPasswordsMatch ? styles.matchSuccess : styles.matchError}>
                  {newPasswordsMatch ? `✓ ${t.auth.passwordsMatch}` : `✗ ${t.auth.passwordsNoMatch}`}
                </div>
              )}
            </div>

            <button type="submit" style={styles.authSubmit} disabled={loading}>
              {loading ? <div style={styles.spinner} /> : t.auth.resetButton}
            </button>
          </form>
        )}

        {/* LOGIN / SIGNUP FORMS */}
        {(mode === 'login' || mode === 'signup') && (
          <>
            <form onSubmit={isLogin ? handleLogin : handleSignup}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>{t.auth.email}</label>
                <input
                  type="email"
                  name="email"
                  style={styles.input}
                  placeholder="satoshi@blockmail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>{t.auth.password}</label>
                <input
                  type="password"
                  name="password"
                  style={styles.input}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Forgot password link - only on login */}
              {isLogin && (
                <div style={styles.forgotPasswordLink}>
                  <span style={styles.authLink} onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }}>
                    {t.auth.forgotLink}
                  </span>
                </div>
              )}

              {/* Password Requirements - Only show on signup */}
              {!isLogin && formData.password.length > 0 && renderPasswordRequirements(passwordChecks)}

              {!isLogin && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>{t.auth.confirmPassword}</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    style={{
                      ...styles.input,
                      ...(formData.confirmPassword.length > 0 ?
                        (passwordsMatch ? styles.inputSuccess : styles.inputError) : {})
                    }}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  {formData.confirmPassword.length > 0 && (
                    <div style={passwordsMatch ? styles.matchSuccess : styles.matchError}>
                      {passwordsMatch ? `✓ ${t.auth.passwordsMatch}` : `✗ ${t.auth.passwordsNoMatch}`}
                    </div>
                  )}
                </div>
              )}

              <button type="submit" style={styles.authSubmit} disabled={loading}>
                {loading ? <div style={styles.spinner} /> : (isLogin ? t.auth.loginButton : t.auth.signupButton)}
              </button>
            </form>

            <div style={styles.authFooter}>
              {isLogin ? (
                <p>{t.auth.noAccount} <span style={styles.authLink} onClick={() => { setIsLogin(false); setMode('signup'); }}>{t.nav.signup}</span></p>
              ) : (
                <p>{t.auth.hasAccount} <span style={styles.authLink} onClick={() => { setIsLogin(true); setMode('login'); }}>{t.nav.login}</span></p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForm;