import React, { useState, useEffect } from 'react';
import { kywardDB } from '../services/Database';
import { styles } from '../styles/Theme';
import { openPdfPreview } from '../services/PdfGenerator';
import { previewEmail } from '../services/EmailService';
import TelegramBlur from './TelegramBlur';
import Footer from './Footer';
import { useLanguage, LanguageToggle } from '../i18n';

// Daily security tip keys
const DAILY_TIP_KEYS = [
  'seedPhrase', 'hardwareWallet', 'backupRedundancy', 'passphrase', 'testRecovery',
  'multisig', 'coldStorage', 'addressPrivacy', 'softwareUpdates', 'inheritance',
  'dedicatedDevice', 'utxoManagement', 'securityReview', 'phishing', 'physicalSecurity'
];

const getDailyTipKey = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return DAILY_TIP_KEYS[dayOfYear % DAILY_TIP_KEYS.length];
};

const Dashboard = ({ user, setUser, onStartAssessment, onLogout, onUpgrade, onViewReport }) => {
  const { t } = useLanguage();
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [canTakeNew, setCanTakeNew] = useState(false); // Nuevo estado para gating

  // Combined refresh: user data + permission check in one effect to ensure sync
  useEffect(() => {
    const refreshUserAndPermission = async () => {
      try {
        // Aggressive cache clearing for desktop/mobile consistency
        localStorage.removeItem('kyward_user_cache');
        sessionStorage.removeItem('kyward_user_cache');

        // Force fresh user data from API
        const freshUser = await kywardDB.getUser(true);
        if (freshUser) {
          setUser(freshUser);
          console.log('Dashboard - User refreshed:', {
            assessments_taken: freshUser.assessments_taken,
            subscription: freshUser.subscriptionLevel || freshUser.subscription
          });
        }

        // Check permission immediately after user refresh
        const canTake = await kywardDB.canTakeNewAssessment();
        setCanTakeNew(canTake);
        console.log('Dashboard - Can take new assessment:', canTake);
      } catch (err) {
        console.error('Error refreshing user/permission in Dashboard:', err);
        setCanTakeNew(false);
      }
    };

    refreshUserAndPermission();

    // Also refresh on window focus (user returns to tab)
    const handleFocus = () => refreshUserAndPermission();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [setUser, user?.id]);

  const subscriptionLevel = user.subscriptionLevel || user.subscription || 'free';
  const isEssential = subscriptionLevel === 'essential';
  const isSentinel = subscriptionLevel === 'sentinel';
  const isConsultation = subscriptionLevel === 'consultation';
  const isFree = subscriptionLevel === 'free';
  const isPremium = isEssential || isSentinel || isConsultation;

  const planData = t.landing.plans[subscriptionLevel] || { name: 'Free' };
  const planName = planData.name;
  const planColor = isSentinel || isConsultation ? '#22c55e' : isEssential ? '#F7931A' : '#6b7280';
  const planType = isEssential ? '(One-time)' : isSentinel ? '(Monthly)' : '(Free)';

  const lastAssessment = user.assessments?.length > 0
    ? user.assessments[user.assessments.length - 1]
    : null;
  const lastScore = lastAssessment?.score ?? null;

  const handleCopyPassword = () => {
    if (user.pdfPassword) {
      navigator.clipboard.writeText(user.pdfPassword);
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
  };

  const getDaysUntilNextAssessment = () => {
    if (isPremium || !lastAssessment) return 0;
    const lastDate = new Date(lastAssessment.timestamp);
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + 1);
    const now = new Date();
    const diff = Math.ceil((nextDate - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const getScoreTrend = () => {
    if (!user.assessments || user.assessments.length < 2) return null;
    const current = user.assessments[user.assessments.length - 1].score;
    const previous = user.assessments[user.assessments.length - 2].score;
    return current - previous;
  };

  const scoreTrend = getScoreTrend();

  const comparison = lastScore !== null ? kywardDB.compareToAverage(lastScore) : null;

  return (
    <div style={styles.dashboardContainer}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <div style={styles.navLogo}>
            <img src="/vite.svg" alt="Kyward" style={{ width: '32px', height: '32px' }} />
            <span style={styles.navLogoText}>Kyward</span>
          </div>
          <div style={styles.navButtons}>
            <LanguageToggle style={{ marginRight: '12px' }} />
            <span style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '700',
              backgroundColor: `${planColor}20`,
              color: planColor,
              marginRight: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              {planName}
              <span style={{ fontSize: '11px', opacity: 0.8 }}>{planType}</span>
            </span>
            <span style={{ color: '#888', marginRight: '15px', fontSize: '14px' }}>{user.email}</span>
            <button onClick={onLogout} style={styles.navButtonLogin}>{t.nav.logout}</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={styles.dashboardMain}>
        <div style={styles.dashboardGlow1} />
        <div style={styles.dashboardGlow2} />
        <div style={styles.dashboardGlow3} />

        <div className="dashboard-content" style={styles.dashboardContent}>
          {/* Header */}
          <header className="dashboard-header" style={styles.dashboardHeader}>
            <div style={styles.dashboardWelcomeBadge}>
              <span style={styles.dashboardBadgeIcon}>🛡️</span>
              {t.nav.dashboard}
            </div>
            <h1 className="dashboard-title" style={styles.dashboardTitle}>
              {t.dashboard.welcome} <span style={styles.dashboardTitleAccent}>{t.dashboard.welcomeUser}</span>
            </h1>
            <p className="dashboard-subtitle" style={styles.dashboardSubtitle}>
              {t.dashboard.subtitle}
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
                <div style={styles.dashStatLabel}>{t.dashboard.stats.securityScore}</div>
                {lastScore && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <span style={{
                      ...styles.dashStatBadge,
                      backgroundColor: lastScore >= 80 ? 'rgba(34,197,94,0.15)' : lastScore >= 50 ? 'rgba(247,147,26,0.15)' : 'rgba(239,68,68,0.15)',
                      color: lastScore >= 80 ? '#22c55e' : lastScore >= 50 ? '#F7931A' : '#ef4444'
                    }}>
                      {lastScore >= 80 ? t.report.score.excellent : lastScore >= 50 ? t.report.score.good : t.report.score.needsWork}
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
                        <circle cx="20" cy="20" r="14" fill={`${planColor}20`} stroke={planColor} strokeWidth="2"/>
                        <path d="M14 20L18 24L26 16" stroke={planColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
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
                <div style={{...styles.dashStatNum, color: planColor, fontSize: '24px'}}>
                  {planName}
                </div>
                <div style={styles.dashStatLabel}>{t.dashboard.stats.plan}</div>
                <div style={{
                  ...styles.dashStatBadge,
                  backgroundColor: `${planColor}15`,
                  color: planColor,
                  marginTop: '8px'
                }}>
                  {isPremium 
                    ? `✓ ${t.dashboard.stats.active}` 
                    : 'Limited'}
                </div>
                
                {isEssential && (
                  <p style={{ fontSize: '11px', color: '#F7931A', marginTop: '8px', opacity: 0.9 }}>
                    {t.common.assessmentLimitEssential || 'One assessment only - repurchase to retake'}
                  </p>
                )}
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
                  {user?.assessments_taken ?? 0}
                </div>
                <div style={styles.dashStatLabel}>{t.dashboard.stats.assessments}</div>
                <div style={{...styles.dashStatBadge, backgroundColor: 'rgba(59,130,246,0.15)', color: '#3b82f6', marginTop: '8px'}}>
                  {isPremium ? `∞ ${t.dashboard.cta.unlimitedNote || 'Unlimited'}` : 'Limited'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions - Premium Upgrade Buttons */}
          {isFree && (
            <div style={{
              marginBottom: '32px',
              padding: '24px',
              background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
              border: '1px solid #2a2a2a',
              borderRadius: '20px'
            }}>
              <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
                {t.dashboard.quickActions || 'Quick Actions'}
              </h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => onUpgrade('essential')}
                  style={{
                    flex: '1',
                    minWidth: '200px',
                    padding: '14px 20px',
                    background: 'linear-gradient(135deg, #F7931A 0%, #f5a623 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#000',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>🔓 {t.landing.plans.essential?.name || 'Essential'}</span>
                  <span style={{ fontSize: '12px', opacity: 0.8 }}>$7.99 {t.common.oneTime || 'one-time'}</span>
                </button>
                <button
                  onClick={() => onUpgrade('sentinel')}
                  style={{
                    flex: '1',
                    minWidth: '200px',
                    padding: '14px 20px',
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#000',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>♾️ {t.landing.plans.sentinel?.name || 'Sentinel'}</span>
                  <span style={{ fontSize: '12px', opacity: 0.8 }}>$5.99/{t.common.month || 'month'}</span>
                </button>
                <button
                  onClick={() => onUpgrade('consultation')}
                  style={{
                    flex: '1',
                    minWidth: '200px',
                    padding: '14px 20px',
                    background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>👨‍💻 {t.landing.plans.consultation?.name || 'Consultation'}</span>
                  <span style={{ fontSize: '12px', opacity: 0.8 }}>$99/{t.common.session || 'session'}</span>
                </button>
              </div>
            </div>
          )}

          {/* CTA Card - Start Assessment (aquí usamos canTakeNew) */}
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
                  {lastAssessment ? t.dashboard.cta.newAssessment : t.dashboard.cta.firstAssessment}
                </h2>
                <p style={styles.dashCtaText}>
                  {lastAssessment ? t.dashboard.cta.newDesc : t.dashboard.cta.firstDesc}
                </p>
              </div>
            </div>

            {canTakeNew ? (
              <button 
                onClick={onStartAssessment} 
                className="dash-cta-button" 
                style={styles.dashCtaButton}
              >
                <span>{lastAssessment ? t.dashboard.cta.startNewButton : t.dashboard.cta.startButton}</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ) : isEssential ? (
              <div style={{
                padding: '20px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <p style={{ color: '#ef4444', fontWeight: '600', margin: '0 0 12px 0' }}>
                  {t.common.assessmentLimitEssential || 'You already used your one-time Essential assessment'}
                </p>
                <button
                  onClick={() => onUpgrade('essential')}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#F7931A',
                    color: '#000',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '12px'
                  }}
                >
                  {t.common.repurchase || 'Repurchase Essential'} - $7.99
                </button>
              </div>
            ) : (
              <div style={{
                padding: '20px',
                background: 'rgba(247,147,26,0.1)',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <p style={{ color: '#F7931A', margin: 0 }}>
                  {t.dashboard.cta.upgradeForUnlimited || 'Upgrade to Sentinel for unlimited assessments'}
                </p>
              </div>
            )}
          </div>

          {/* Daily Security Tip */}
          {(() => {
            const tipKey = getDailyTipKey();
            const dailyTip = t.tips[tipKey];
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
                      {t.dashboard.dailyTip}
                    </span>
                  </div>
                  <p style={styles.dashTipText}>
                    {dailyTip.text}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Email Preferences - Solo Sentinel */}
          {isSentinel && (
            <div style={{
              margin: '32px 0',
              padding: '24px',
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: '16px'
            }}>
              <h3 style={{ color: '#22c55e', margin: '0 0 16px 0' }}>
                {t.dashboard.emailPreferences || 'Email Preferences'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9ca3af' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: '#22c55e' }} />
                  {t.dashboard.dailyTips || 'Daily security tips'}
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9ca3af' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: '#22c55e' }} />
                  {t.dashboard.securityAlerts || 'Security alerts & hack notifications'}
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9ca3af' }}>
                  <input type="checkbox" style={{ accentColor: '#22c55e' }} />
                  {t.dashboard.monthlyReviews || 'Monthly wallet review reminders'}
                </label>
              </div>
              <button style={{
                marginTop: '16px',
                padding: '10px 20px',
                background: '#22c55e',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                {t.common.saveChanges || 'Save Preferences'}
              </button>
            </div>
          )}

          {/* Assessment History */}
          {user.assessments && user.assessments.length > 0 && (
            <div style={styles.dashHistorySection}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={styles.dashHistoryTitle}>{t.dashboard.history.title}</h3>
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
                    {showAllHistory ? t.dashboard.history.showLess : `${t.dashboard.history.viewAll} (${user.assessments.length})`}
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
                        {assessment.score >= 80 ? t.report.score.excellent : assessment.score >= 50 ? t.report.score.good : t.report.score.needsWork}
                      </div>
                    </div>
                    {isPremium && (
                      <div style={{ color: '#6b7280', fontSize: '12px' }}>
                        {t.dashboard.history.viewReport} →
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;