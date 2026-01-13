import React, { useState, useMemo } from 'react';
import { kywardDB } from '../services/Database';
import { styles } from '../styles/Theme';
import { openPdfPreview } from '../services/PdfGenerator';
import { previewEmail } from '../services/EmailService';
import TelegramBlur from './TelegramBlur';

// Daily security tips - rotates based on date
const DAILY_TIPS = [
  {
    title: "Seed Phrase Security",
    text: "Never share your 24-word seed phrase with anyone, including us. Kyward will never ask for your keys or private information."
  },
  {
    title: "Hardware Wallet Best Practice",
    text: "Always verify receiving addresses on your hardware wallet's screen before sending Bitcoin. Never trust addresses shown only on your computer."
  },
  {
    title: "Backup Redundancy",
    text: "Store your seed phrase backup in at least 2 geographically separate locations. Consider using metal backup plates for fire and water resistance."
  },
  {
    title: "Passphrase Protection",
    text: "Consider using a 25th word (passphrase) with your seed phrase. Store it separately from your seed for maximum security."
  },
  {
    title: "Test Your Recovery",
    text: "Periodically test your wallet recovery process with a small amount. Better to discover issues now than during an emergency."
  },
  {
    title: "Multisig Security",
    text: "For significant holdings, consider a 2-of-3 multisig setup. It protects against single points of failure and physical threats."
  },
  {
    title: "Cold Storage Priority",
    text: "Keep 90%+ of your Bitcoin in cold storage. Only maintain small amounts in hot wallets for regular transactions."
  },
  {
    title: "Address Privacy",
    text: "Never reuse Bitcoin addresses. Using fresh addresses for each transaction improves your financial privacy significantly."
  },
  {
    title: "Software Updates",
    text: "Always verify software signatures before updating your wallet. Download only from official sources and check GPG signatures."
  },
  {
    title: "Inheritance Planning",
    text: "Document your Bitcoin inheritance plan. Your heirs should know how to access your Bitcoin if something happens to you."
  },
  {
    title: "Dedicated Device",
    text: "Use a dedicated device for Bitcoin transactions. Air-gapped computers provide the highest security for signing transactions."
  },
  {
    title: "UTXO Management",
    text: "Learn coin control and UTXO management. Consolidate small UTXOs during low-fee periods to save on future transaction costs."
  },
  {
    title: "Security Review",
    text: "Review your security setup quarterly. Technology and best practices evolve - make sure your setup stays current."
  },
  {
    title: "Phishing Awareness",
    text: "Be vigilant about phishing attacks. Bookmark official wallet websites and never click links in emails claiming to be from Bitcoin services."
  },
  {
    title: "Physical Security",
    text: "Consider physical security threats. Don't publicly disclose your Bitcoin holdings, and be cautious about who knows you own Bitcoin."
  }
];

// Get daily tip based on current date (changes once per day)
const getDailyTip = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return DAILY_TIPS[dayOfYear % DAILY_TIPS.length];
};

const Dashboard = ({ user, onStartAssessment, onLogout, onUpgrade, onViewReport }) => {
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const usageStatus = kywardDB.getUserUsageStatus(user.email);
  const isPremium = kywardDB.hasPremiumAccess(user.email);

  const lastAssessment = user.assessments && user.assessments.length > 0
    ? user.assessments[user.assessments.length - 1]
    : null;
  const lastScore = lastAssessment?.score || null;

  // Get subscription level display (check both field names for compatibility)
  const getSubscription = () => user.subscriptionLevel || user.subscription || 'free';

  const getPlanName = () => {
    const sub = getSubscription();
    if (sub === 'consultation') return 'Consultation';
    if (sub === 'complete') return 'Complete';
    return 'Free';
  };

  const getPlanColor = () => {
    const sub = getSubscription();
    if (sub === 'consultation') return '#22c55e';
    if (sub === 'complete') return '#F7931A';
    return '#6b7280';
  };

  // Copy password to clipboard
  const handleCopyPassword = () => {
    if (user.pdfPassword) {
      navigator.clipboard.writeText(user.pdfPassword);
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
  };

  // Calculate days until next free assessment
  const getDaysUntilNextAssessment = () => {
    if (isPremium || !lastAssessment) return 0;
    const lastDate = new Date(lastAssessment.timestamp);
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + 1);
    const now = new Date();
    const diff = Math.ceil((nextDate - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  // Score trend calculation
  const getScoreTrend = () => {
    if (!user.assessments || user.assessments.length < 2) return null;
    const current = user.assessments[user.assessments.length - 1].score;
    const previous = user.assessments[user.assessments.length - 2].score;
    return current - previous;
  };

  const scoreTrend = getScoreTrend();

  // Get comparison with community average
  const comparison = lastScore !== null ? kywardDB.compareToAverage(lastScore) : null;

  return (
    <div style={styles.dashboardContainer}>
      {/* Navigation */}
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
            {/* Plan Badge */}
            <span style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '700',
              backgroundColor: `${getPlanColor()}20`,
              color: getPlanColor(),
              marginRight: '12px'
            }}>
              {getPlanName()} Plan
            </span>
            <span style={{ color: '#888', marginRight: '15px', fontSize: '14px' }}>{user.email}</span>
            <button onClick={onLogout} style={styles.navButtonLogin}>Logout</button>
          </div>
        </div>
      </nav>

      {/* Main Content with Background Effects */}
      <div style={styles.dashboardMain}>
        {/* Background Glows */}
        <div style={styles.dashboardGlow1} />
        <div style={styles.dashboardGlow2} />
        <div style={styles.dashboardGlow3} />

        <div className="dashboard-content" style={styles.dashboardContent}>
          {/* Header Section */}
          <header className="dashboard-header" style={styles.dashboardHeader}>
            <div style={styles.dashboardWelcomeBadge}>
              <span style={styles.dashboardBadgeIcon}>🛡️</span>
              Security Dashboard
            </div>
            <h1 className="dashboard-title" style={styles.dashboardTitle}>
              Welcome back, <span style={styles.dashboardTitleAccent}>Bitcoiner</span>
            </h1>
            <p className="dashboard-subtitle" style={styles.dashboardSubtitle}>
              {isPremium
                ? 'Manage your security assessments, download reports, and track your progress.'
                : 'Take your security assessment and discover how to better protect your Bitcoin.'
              }
            </p>
          </header>

          {/* Stats Grid */}
          <div className="stats-grid" style={styles.dashStatsGrid}>
            {/* Score Card */}
            <div className="dash-stat-card" style={{...styles.dashStatCard, ...styles.dashStatCardScore}}>
              <div style={{...styles.dashStatCardGlow, ...styles.dashStatCardGlow1}} className="glow-element" />
              <div style={styles.dashStatVisual}>
                <div style={styles.dashStatIconContainer}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="16" stroke="#2a2a2a" strokeWidth="3"/>
                    <circle
                      cx="20" cy="20" r="16"
                      stroke={lastScore >= 80 ? '#22c55e' : lastScore >= 50 ? '#F7931A' : lastScore ? '#ef4444' : '#3a3a3a'}
                      strokeWidth="3"
                      strokeDasharray="100"
                      strokeDashoffset={lastScore ? 100 - lastScore : 100}
                      strokeLinecap="round"
                      transform="rotate(-90 20 20)"
                    />
                    <text x="20" y="24" textAnchor="middle" fill={lastScore >= 80 ? '#22c55e' : lastScore >= 50 ? '#F7931A' : lastScore ? '#ef4444' : '#6b7280'} fontSize="12" fontWeight="800">
                      {lastScore || '--'}
                    </text>
                  </svg>
                </div>
              </div>
              <div style={styles.dashStatContent}>
                <div style={{...styles.dashStatNum, color: lastScore >= 80 ? '#22c55e' : lastScore >= 50 ? '#F7931A' : lastScore ? '#ef4444' : '#6b7280'}}>
                  {lastScore || '--'}
                </div>
                <div style={styles.dashStatLabel}>Security Score</div>
                {lastScore && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <span style={{
                      ...styles.dashStatBadge,
                      backgroundColor: lastScore >= 80 ? 'rgba(34,197,94,0.15)' : lastScore >= 50 ? 'rgba(247,147,26,0.15)' : 'rgba(239,68,68,0.15)',
                      color: lastScore >= 80 ? '#22c55e' : lastScore >= 50 ? '#F7931A' : '#ef4444'
                    }}>
                      {lastScore >= 80 ? 'Excellent' : lastScore >= 50 ? 'Moderate' : 'Needs Work'}
                    </span>
                    {scoreTrend !== null && (
                      <span style={{
                        fontSize: '12px',
                        color: scoreTrend > 0 ? '#22c55e' : scoreTrend < 0 ? '#ef4444' : '#6b7280'
                      }}>
                        {scoreTrend > 0 ? `+${scoreTrend}` : scoreTrend}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Plan Status Card */}
            <div className="dash-stat-card" style={{...styles.dashStatCard, ...styles.dashStatCardScans}}>
              <div style={{...styles.dashStatCardGlow, ...styles.dashStatCardGlow2}} className="glow-element" />
              <div style={styles.dashStatVisual}>
                <div style={styles.dashStatIconContainer}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    {isPremium ? (
                      <>
                        <circle cx="20" cy="20" r="14" fill={`${getPlanColor()}20`} stroke={getPlanColor()} strokeWidth="2"/>
                        <path d="M14 20L18 24L26 16" stroke={getPlanColor()} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </>
                    ) : (
                      <>
                        <circle cx="20" cy="20" r="14" fill="rgba(107,114,128,0.2)" stroke="#6b7280" strokeWidth="2"/>
                        <path d="M20 14V20L24 24" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </>
                    )}
                  </svg>
                </div>
              </div>
              <div style={styles.dashStatContent}>
                <div style={{...styles.dashStatNum, color: getPlanColor(), fontSize: '24px'}}>
                  {getPlanName()}
                </div>
                <div style={styles.dashStatLabel}>Current Plan</div>
                <div style={{
                  ...styles.dashStatBadge,
                  backgroundColor: `${getPlanColor()}15`,
                  color: getPlanColor(),
                  marginTop: '8px'
                }}>
                  {isPremium ? '✓ Active' : 'Limited'}
                </div>
              </div>
            </div>

            {/* Assessments Card */}
            <div className="dash-stat-card" style={{...styles.dashStatCard, ...styles.dashStatCardPrivacy}}>
              <div style={{...styles.dashStatCardGlow, ...styles.dashStatCardGlow3}} className="glow-element" />
              <div style={styles.dashStatVisual}>
                <div style={styles.dashStatIconContainer}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <rect x="8" y="6" width="24" height="28" rx="3" fill="rgba(59,130,246,0.2)" stroke="#3b82f6" strokeWidth="2"/>
                    <path d="M14 14H26M14 20H26M14 26H20" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <div style={styles.dashStatContent}>
                <div style={{...styles.dashStatNum, color: '#3b82f6'}}>
                  {user.assessments?.length || 0}
                </div>
                <div style={styles.dashStatLabel}>Assessments Taken</div>
                <div style={{...styles.dashStatBadge, backgroundColor: 'rgba(59,130,246,0.15)', color: '#3b82f6', marginTop: '8px'}}>
                  {isPremium ? '∞ Unlimited' : `${usageStatus.remaining} remaining`}
                </div>
              </div>
            </div>
          </div>

          {/* Community Comparison Section */}
          {comparison && lastScore !== null && (
            <div style={{
              background: 'linear-gradient(180deg, rgba(26,26,26,0.9) 0%, rgba(15,15,15,0.95) 100%)',
              border: '1px solid #2a2a2a',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21V19C17 16.79 15.21 15 13 15H5C2.79 15 1 16.79 1 19V21" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="9" cy="7" r="4" stroke="#3b82f6" strokeWidth="2"/>
                  <path d="M23 21V19C23 17.14 21.73 15.57 20 15.13" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16 3.13C17.73 3.57 19 5.14 19 7C19 8.86 17.73 10.43 16 10.87" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: '600', margin: 0 }}>
                  How You Compare
                </h3>
              </div>

              {/* Comparison Stats Row */}
              <div className="comparison-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                marginBottom: '20px'
              }}>
                {/* Your Score */}
                <div className="comparison-card" style={{
                  background: `${lastScore >= 80 ? '#22c55e' : lastScore >= 50 ? '#F7931A' : '#ef4444'}10`,
                  border: `1px solid ${lastScore >= 80 ? '#22c55e' : lastScore >= 50 ? '#F7931A' : '#ef4444'}30`,
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>YOU</div>
                  <div className="comparison-number" style={{
                    fontSize: '28px',
                    fontWeight: '800',
                    color: lastScore >= 80 ? '#22c55e' : lastScore >= 50 ? '#F7931A' : '#ef4444'
                  }}>
                    {lastScore}
                  </div>
                </div>

                {/* Average */}
                <div className="comparison-card" style={{
                  background: 'rgba(107,114,128,0.1)',
                  border: '1px solid rgba(107,114,128,0.2)',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>AVG</div>
                  <div className="comparison-number" style={{ fontSize: '28px', fontWeight: '800', color: '#6b7280' }}>
                    {comparison.averageScore}
                  </div>
                </div>

                {/* Percentile */}
                <div className="comparison-card" style={{
                  background: 'rgba(168,85,247,0.1)',
                  border: '1px solid rgba(168,85,247,0.2)',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>TOP</div>
                  <div className="comparison-number" style={{ fontSize: '28px', fontWeight: '800', color: '#a855f7' }}>
                    {100 - comparison.percentile}%
                  </div>
                </div>
              </div>

              {/* Distribution Bar */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px', textAlign: 'center' }}>
                  SCORE DISTRIBUTION
                </div>
                <div style={{ display: 'flex', gap: '4px', height: '32px', borderRadius: '8px', overflow: 'hidden' }}>
                  <div
                    style={{
                      flex: comparison.distribution.needsWork,
                      background: lastScore < 50 ? '#ef4444' : 'rgba(239,68,68,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    {lastScore < 50 && (
                      <div style={{
                        position: 'absolute',
                        top: '-20px',
                        fontSize: '10px',
                        color: '#ef4444',
                        fontWeight: '600'
                      }}>You</div>
                    )}
                    <span style={{ fontSize: '10px', color: lastScore < 50 ? '#fff' : '#ef4444', fontWeight: '600' }}>
                      {comparison.distribution.needsWork}%
                    </span>
                  </div>
                  <div
                    style={{
                      flex: comparison.distribution.moderate,
                      background: lastScore >= 50 && lastScore < 80 ? '#F7931A' : 'rgba(247,147,26,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    {lastScore >= 50 && lastScore < 80 && (
                      <div style={{
                        position: 'absolute',
                        top: '-20px',
                        fontSize: '10px',
                        color: '#F7931A',
                        fontWeight: '600'
                      }}>You</div>
                    )}
                    <span style={{ fontSize: '10px', color: lastScore >= 50 && lastScore < 80 ? '#000' : '#F7931A', fontWeight: '600' }}>
                      {comparison.distribution.moderate}%
                    </span>
                  </div>
                  <div
                    style={{
                      flex: comparison.distribution.excellent,
                      background: lastScore >= 80 ? '#22c55e' : 'rgba(34,197,94,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    {lastScore >= 80 && (
                      <div style={{
                        position: 'absolute',
                        top: '-20px',
                        fontSize: '10px',
                        color: '#22c55e',
                        fontWeight: '600'
                      }}>You</div>
                    )}
                    <span style={{ fontSize: '10px', color: lastScore >= 80 ? '#000' : '#22c55e', fontWeight: '600' }}>
                      {comparison.distribution.excellent}%
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                  <span style={{ fontSize: '10px', color: '#ef4444' }}>Needs Work</span>
                  <span style={{ fontSize: '10px', color: '#F7931A' }}>Moderate</span>
                  <span style={{ fontSize: '10px', color: '#22c55e' }}>Excellent</span>
                </div>
              </div>

              {/* Insight */}
              <div style={{
                padding: '12px 16px',
                background: comparison.isAboveAverage ? 'rgba(34,197,94,0.1)' : 'rgba(247,147,26,0.1)',
                border: `1px solid ${comparison.isAboveAverage ? 'rgba(34,197,94,0.2)' : 'rgba(247,147,26,0.2)'}`,
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                <span style={{
                  fontSize: '13px',
                  color: comparison.isAboveAverage ? '#22c55e' : '#F7931A'
                }}>
                  {comparison.isAboveAverage
                    ? `You're ${comparison.comparison} average! ${comparison.difference > 10 ? 'Excellent work!' : 'Keep it up!'}`
                    : `${Math.abs(comparison.difference)} points below average. Follow your recommendations to improve!`
                  }
                </span>
              </div>
            </div>
          )}

          {/* ===== PREMIUM USER SECTION ===== */}
          {isPremium && (
            <>
              {/* Quick Actions Panel */}
              <div className="quick-actions" style={{
                background: 'linear-gradient(135deg, rgba(247,147,26,0.1) 0%, rgba(34,197,94,0.1) 100%)',
                border: '1px solid rgba(247,147,26,0.3)',
                borderRadius: '20px',
                padding: '32px',
                marginBottom: '32px'
              }}>
                <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', marginBottom: '24px', margin: '0 0 24px 0' }}>
                  Quick Actions
                </h3>
                <div className="quick-actions-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  {/* Download PDF */}
                  <button
                    onClick={() => lastAssessment && openPdfPreview(user, lastAssessment.score, lastAssessment.responses)}
                    disabled={!lastAssessment}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px 20px',
                      background: lastAssessment ? 'rgba(34,197,94,0.15)' : 'rgba(107,114,128,0.1)',
                      border: `1px solid ${lastAssessment ? 'rgba(34,197,94,0.3)' : 'rgba(107,114,128,0.2)'}`,
                      borderRadius: '12px',
                      color: lastAssessment ? '#22c55e' : '#6b7280',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: lastAssessment ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s'
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 3V15M12 15L7 10M12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 17V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Download PDF
                  </button>

                  {/* Email Report */}
                  <button
                    onClick={() => lastAssessment && previewEmail(user, lastAssessment.score, lastAssessment.responses)}
                    disabled={!lastAssessment}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px 20px',
                      background: lastAssessment ? 'rgba(59,130,246,0.15)' : 'rgba(107,114,128,0.1)',
                      border: `1px solid ${lastAssessment ? 'rgba(59,130,246,0.3)' : 'rgba(107,114,128,0.2)'}`,
                      borderRadius: '12px',
                      color: lastAssessment ? '#3b82f6' : '#6b7280',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: lastAssessment ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s'
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Email Report
                  </button>

                  {/* View Report */}
                  <button
                    onClick={() => lastAssessment && onViewReport && onViewReport(lastAssessment)}
                    disabled={!lastAssessment}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px 20px',
                      background: lastAssessment ? 'rgba(168,85,247,0.15)' : 'rgba(107,114,128,0.1)',
                      border: `1px solid ${lastAssessment ? 'rgba(168,85,247,0.3)' : 'rgba(107,114,128,0.2)'}`,
                      borderRadius: '12px',
                      color: lastAssessment ? '#a855f7' : '#6b7280',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: lastAssessment ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s'
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      <path d="M2 12C4 7 7.5 4 12 4C16.5 4 20 7 22 12C20 17 16.5 20 12 20C7.5 20 4 17 2 12Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    View Report
                  </button>

                  {/* New Assessment */}
                  <button
                    onClick={onStartAssessment}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px 20px',
                      background: '#F7931A',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#000',
                      fontSize: '15px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    New Assessment
                  </button>
                </div>
              </div>

              {/* PDF Password Box with Compact Telegram Blur Effect */}
              {user.pdfPassword && (
                <div className="password-box" style={{
                  background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
                  border: '1px solid #2a2a2a',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  marginBottom: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(247,147,26,0.15)',
                      border: '1px solid rgba(247,147,26,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="11" width="18" height="11" rx="2" stroke="#F7931A" strokeWidth="2"/>
                        <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="#F7931A" strokeWidth="2"/>
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>PDF Password</div>
                      {/* Compact Password with Blur Effect */}
                      <div
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'relative',
                          cursor: 'pointer',
                          display: 'inline-block'
                        }}
                      >
                        <div style={{
                          fontFamily: 'monospace',
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#F7931A',
                          letterSpacing: '2px',
                          filter: showPassword ? 'none' : 'blur(6px)',
                          transition: 'filter 0.3s ease',
                          userSelect: showPassword ? 'text' : 'none'
                        }}>
                          {user.pdfPassword}
                        </div>
                        {/* Mini stars overlay when blurred */}
                        {!showPassword && (
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            pointerEvents: 'none',
                            overflow: 'hidden'
                          }}>
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                style={{
                                  position: 'absolute',
                                  left: `${20 + i * 15}%`,
                                  top: '50%',
                                  width: '3px',
                                  height: '3px',
                                  borderRadius: '50%',
                                  background: '#F7931A',
                                  boxShadow: '0 0 6px #F7931A',
                                  animation: `starFloat${i % 3} ${1.5 + i * 0.3}s ease-in-out infinite`
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="password-buttons" style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        background: 'rgba(107,114,128,0.1)',
                        border: '1px solid rgba(107,114,128,0.2)',
                        borderRadius: '8px',
                        color: '#9ca3af',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                    <button
                      onClick={handleCopyPassword}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        background: copiedPassword ? 'rgba(34,197,94,0.15)' : 'rgba(247,147,26,0.1)',
                        border: `1px solid ${copiedPassword ? 'rgba(34,197,94,0.3)' : 'rgba(247,147,26,0.2)'}`,
                        borderRadius: '8px',
                        color: copiedPassword ? '#22c55e' : '#F7931A',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      {copiedPassword ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}

              {/* Star animations */}
              <style>{`
                @keyframes starFloat0 {
                  0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
                  50% { transform: translateY(-8px) scale(1.3); opacity: 1; }
                }
                @keyframes starFloat1 {
                  0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
                  50% { transform: translateY(-6px) scale(1.2); opacity: 1; }
                }
                @keyframes starFloat2 {
                  0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
                  50% { transform: translateY(-10px) scale(1.4); opacity: 1; }
                }
              `}</style>

              {/* Consultation User: Schedule Call */}
              {getSubscription() === 'consultation' && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(59,130,246,0.1) 100%)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '24px' }}>🎥</span>
                      <h4 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', margin: 0 }}>
                        Video Consultation Included
                      </h4>
                    </div>
                    <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
                      Schedule your 60-minute video call to create your custom inheritance plan with expert guidance.
                    </p>
                  </div>
                  <button style={{
                    padding: '14px 28px',
                    background: '#22c55e',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#000',
                    fontSize: '15px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}>
                    Schedule Call
                  </button>
                </div>
              )}
            </>
          )}

          {/* ===== FREE USER SECTION ===== */}
          {!isPremium && (
            <>
              {/* Upgrade Banner */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(247,147,26,0.15) 0%, rgba(239,68,68,0.1) 100%)',
                border: '2px solid #F7931A',
                borderRadius: '20px',
                padding: '32px',
                marginBottom: '32px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔒</div>
                <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '12px' }}>
                  Unlock Your Complete Security Plan
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '15px', maxWidth: '500px', margin: '0 auto 24px' }}>
                  Get unlimited assessments, download your personalized PDF report, and access your complete inheritance plan.
                </p>

                {/* Locked Features */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '24px',
                  marginBottom: '24px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                    <span>🔒</span> Download PDF
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                    <span>🔒</span> Email Report
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                    <span>🔒</span> All Recommendations
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                    <span>🔒</span> Inheritance Plan
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => onUpgrade && onUpgrade('complete')}
                      style={{
                        padding: '14px 32px',
                        background: '#F7931A',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#000',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Subscribe - $7.99/month
                    </button>
                    <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '8px', marginBottom: 0 }}>
                      Cancel anytime
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => onUpgrade && onUpgrade('consultation')}
                      style={{
                        padding: '14px 32px',
                        background: 'transparent',
                        border: '2px solid #22c55e',
                        borderRadius: '12px',
                        color: '#22c55e',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Book Consultation - $99
                    </button>
                    <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '8px', marginBottom: 0 }}>
                      1-hour session
                    </p>
                  </div>
                </div>
              </div>

              {/* Assessment Limit Info */}
              {!usageStatus.canTake && (
                <div style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '32px',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#ef4444', margin: 0, fontSize: '15px' }}>
                    <strong>Monthly assessment limit reached.</strong>
                    <br />
                    <span style={{ color: '#9ca3af' }}>
                      Next free assessment available in {getDaysUntilNextAssessment()} days, or upgrade for unlimited access.
                    </span>
                  </p>
                </div>
              )}
            </>
          )}

          {/* CTA Card - Start Assessment */}
          <div style={styles.dashCtaCard}>
            <div style={styles.dashCtaCardGlow} />
            <div style={styles.dashCtaContent}>
              <div style={styles.dashCtaIcon}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="20" fill="rgba(247,147,26,0.15)" stroke="#F7931A" strokeWidth="2"/>
                  <path d="M24 14V24L30 30" stroke="#F7931A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={styles.dashCtaInfo}>
                <h2 style={styles.dashCtaTitle}>
                  {lastAssessment ? 'Ready for a new assessment?' : 'Take Your First Assessment'}
                </h2>
                <p style={styles.dashCtaText}>
                  {lastAssessment
                    ? 'Check if your security practices have improved since your last assessment.'
                    : 'Answer 15 questions about your Bitcoin security to get your personalized score and recommendations.'
                  }
                </p>
              </div>
            </div>

            {usageStatus.canTake ? (
              <button onClick={onStartAssessment} className="dash-cta-button" style={styles.dashCtaButton}>
                <span>{lastAssessment ? 'Start New Assessment' : 'Start Assessment'}</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ) : (
              <div style={styles.dashCtaLimited}>
                <button style={styles.dashCtaButtonDisabled} disabled>
                  Limit Reached
                </button>
                <p style={styles.dashCtaUpgrade}>
                  {isPremium ? 'You have unlimited assessments' : 'Upgrade to Premium for unlimited assessments'}
                </p>
              </div>
            )}
          </div>

          {/* Daily Security Tip */}
          {(() => {
            const dailyTip = getDailyTip();
            return (
              <div style={styles.dashTipCard}>
                <div style={styles.dashTipCardGlow} />
                <div style={styles.dashTipIcon}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="14" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="2"/>
                    <path d="M16 10V18" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="16" cy="22" r="1.5" fill="#22c55e"/>
                  </svg>
                </div>
                <div style={styles.dashTipContent}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{ ...styles.dashTipTitle, margin: 0 }}>{dailyTip.title}</h3>
                    <span style={{ fontSize: '10px', color: '#6b7280', background: 'rgba(107,114,128,0.15)', padding: '2px 8px', borderRadius: '10px' }}>
                      Daily Tip
                    </span>
                  </div>
                  <p style={styles.dashTipText}>
                    {dailyTip.text}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Assessment History */}
          {user.assessments && user.assessments.length > 0 && (
            <div style={styles.dashHistorySection}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={styles.dashHistoryTitle}>Assessment History</h3>
                {user.assessments.length > 3 && (
                  <button
                    onClick={() => setShowAllHistory(!showAllHistory)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#F7931A',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {showAllHistory ? 'Show Less' : `View All (${user.assessments.length})`}
                  </button>
                )}
              </div>
              <div className="history-grid" style={styles.dashHistoryGrid}>
                {(showAllHistory ? user.assessments : user.assessments.slice(-3)).reverse().map((assessment, index) => (
                  <div key={index} className="dash-history-card" style={{
                    ...styles.dashHistoryCard,
                    cursor: isPremium ? 'pointer' : 'default'
                  }}
                  onClick={() => isPremium && onViewReport && onViewReport(assessment)}
                  >
                    <div style={styles.dashHistoryScore}>
                      <span style={{
                        color: assessment.score >= 80 ? '#22c55e' : assessment.score >= 50 ? '#F7931A' : '#ef4444'
                      }}>
                        {assessment.score}
                      </span>
                    </div>
                    <div style={styles.dashHistoryInfo}>
                      <div style={styles.dashHistoryDate}>
                        {new Date(assessment.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div style={{
                        ...styles.dashHistoryStatus,
                        color: assessment.score >= 80 ? '#22c55e' : assessment.score >= 50 ? '#F7931A' : '#ef4444'
                      }}>
                        {assessment.score >= 80 ? 'Excellent' : assessment.score >= 50 ? 'Moderate' : 'Needs Work'}
                      </div>
                    </div>
                    {isPremium && (
                      <div style={{ color: '#6b7280', fontSize: '12px' }}>
                        View →
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
