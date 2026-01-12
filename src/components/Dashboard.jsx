import React from 'react';
import { kywardDB } from '../services/Database';
import { styles } from '../styles/Theme';

const Dashboard = ({ user, onStartAssessment, onLogout }) => {
  // Obtenemos el estado de uso del usuario desde la DB
  const usageStatus = kywardDB.getUserUsageStatus(user.email);

  return (
    <div style={styles.dashboardContainer}>
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <div style={styles.navLogo}>
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" fill="#F7931A" opacity="0.2"/>
              <path d="M20 8L28 13V27L20 32L12 27V13L20 8Z" stroke="#F7931A" strokeWidth="2.5" strokeLinejoin="round"/>
            </svg>
            <span style={styles.navLogoText}>Kyward</span>
          </div>
          <div style={styles.navButtons}>
            <span style={{ color: '#888', marginRight: '15px' }}>{user.email}</span>
            <button onClick={onLogout} style={styles.navButtonLogin}>Logout</button>
          </div>
        </div>
      </nav>

      <div style={styles.dashboardContent}>
        <header style={styles.dashboardHeader}>
          <h1 style={styles.dashboardTitle}>Welcome back, Bitcoiner</h1>
          <p style={styles.dashboardSubtitle}>Manage your security assessments and track your progress.</p>
        </header>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📊</div>
            <div style={styles.statNum}>{user.lastScore || '--'}</div>
            <div style={styles.statLabel}>Latest Security Score</div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statIcon}>⚡</div>
            <div style={styles.statNum}>{usageStatus.remaining}</div>
            <div style={styles.statLabel}>{usageStatus.isPremium ? 'Unlimited Scans' : 'Scans Remaining'}</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>🔒</div>
            <div style={styles.statNum}>100%</div>
            <div style={styles.statLabel}>Privacy Guaranteed</div>
          </div>
        </div>

        <div style={styles.ctaCard}>
          <div style={styles.ctaInfo}>
            <h2 style={styles.ctaTitle}>Ready for a new assessment?</h2>
            <p style={styles.ctaText}>
              Review your setup to see if you have improved your security practices since the last time.
            </p>
          </div>
          
          {usageStatus.canTake ? (
            <button onClick={onStartAssessment} style={styles.startButton}>
              Start New Assessment →
            </button>
          ) : (
            <div style={{ textAlign: 'right' }}>
              <button style={{...styles.startButton, opacity: 0.5, cursor: 'not-allowed'}} disabled>
                Limit Reached
              </button>
              <p style={styles.upgradeText}>Upgrade to Premium for unlimited scans</p>
            </div>
          )}
        </div>

        {/* Historial (Opcional para el futuro) */}
        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>💡 Security Tip</h3>
          <p style={styles.infoText}>
            Never share your 24-word seed phrase with anyone, including us. 
            Kyward will never ask for your keys.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;