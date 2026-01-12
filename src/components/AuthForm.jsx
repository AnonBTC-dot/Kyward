import React, { useState } from 'react';
import { kywardDB } from '../services/Database';
import { styles } from '../styles/Theme';

const AuthForm = ({ initialMode = 'login', onAuthSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
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
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
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

  return (
    <div style={styles.authContainer}>
      <div style={styles.authCard}>
        <button onClick={onBack} style={styles.backButton}>← Back</button>
        
        <div style={styles.authLogo}>
          <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" fill="#F7931A" opacity="0.2"/>
            <path d="M20 8L28 13V27L20 32L12 27V13L20 8Z" stroke="#F7931A" strokeWidth="2.5" strokeLinejoin="round"/>
          </svg>
          <h2 style={styles.authTitle}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p style={styles.authSubtitle}>
            {isLogin ? 'Enter your details to access your dashboard' : 'Join Kyward and secure your Bitcoin legacy'}
          </p>
        </div>

        {success && <div style={styles.successBox}>{success}</div>}
        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={isLogin ? handleLogin : handleSignup}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
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
            <label style={styles.label}>Password</label>
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

          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                style={styles.input}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <button type="submit" style={styles.authSubmit} disabled={loading}>
            {loading ? <div style={styles.spinner} /> : (isLogin ? 'Login' : 'Create Account')}
          </button>
        </form>

        <div style={styles.authFooter}>
          {isLogin ? (
            <p>Don't have an account? <span style={styles.authLink} onClick={() => setIsLogin(false)}>Sign up</span></p>
          ) : (
            <p>Already have an account? <span style={styles.authLink} onClick={() => setIsLogin(true)}>Login</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;