import React, { useState, useEffect } from 'react';
import { kywardDB } from '../services/Database';
import { styles } from '../styles/Theme';
import { openPdfPreview } from '../services/PdfGenerator';
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
  const { t, language } = useLanguage();
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [canTakeNew, setCanTakeNew] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);
  const [emailPrefs, setEmailPrefs] = useState({
    dailyTips: user?.emailDailyTips ?? true,
    securityAlerts: user?.emailHackAlerts ?? true,
    monthlyReviews: user?.emailWalletReviews ?? false
  });

  // Combined refresh: user data + assessments + permission check in one effect to ensure sync
  useEffect(() => {
    let isMounted = true;
    let isRefreshing = false;

    const refreshUserAndPermission = async () => {
      // Prevent concurrent refreshes
      if (isRefreshing) return;
      isRefreshing = true;

      try {
        // Aggressive cache clearing for desktop/mobile consistency
        localStorage.removeItem('kyward_user_cache');
        sessionStorage.removeItem('kyward_user_cache');

        // Force fresh user data from API
        const freshUser = await kywardDB.getUser(true);
        if (!isMounted) return;

        if (freshUser) {
          // Also load user's assessments history
          const assessments = await kywardDB.getUserAssessments();
          if (!isMounted) return;

          freshUser.assessments = assessments;

          // CRITICAL: Sync assessments_taken with actual assessments array length
          // This fixes the race condition where API returns stale count
          const actualCount = assessments?.length || 0;
          if (actualCount > 0) {
            freshUser.assessments_taken = actualCount;
            freshUser.assessmentsTaken = actualCount;
          }

          setUser(freshUser);
          console.log('Dashboard - User refreshed:', {
            assessments_taken: freshUser.assessments_taken,
            assessments_count: actualCount,
            subscription: freshUser.subscriptionLevel || freshUser.subscription
          });

          // Check permission based on actual data
          const canTake = await kywardDB.canTakeNewAssessment();
          if (isMounted) {
            setCanTakeNew(canTake);
            console.log('Dashboard - Can take new assessment:', canTake);
          }
        }
      } catch (err) {
        console.error('Error refreshing user/permission in Dashboard:', err);
        if (isMounted) setCanTakeNew(false);
      } finally {
        isRefreshing = false;
      }
    };

    refreshUserAndPermission();

    // Debounced focus handler to prevent rapid refreshes
    let focusTimeout;
    const handleFocus = () => {
      clearTimeout(focusTimeout);
      focusTimeout = setTimeout(refreshUserAndPermission, 500);
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleFocus);
      clearTimeout(focusTimeout);
    };
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

  // Assessments are sorted newest first from API, so [0] is the most recent
  const lastAssessment = user.assessments?.length > 0
    ? user.assessments[0]
    : null;
  const lastScore = lastAssessment?.score ?? null;

  const handleCopyPassword = () => {
    if (user.pdfPassword) {
      navigator.clipboard.writeText(user.pdfPassword);
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
  };

  const handleSavePreferences = async () => {
    setSavingPrefs(true);
    setPrefsSaved(false);
    try {
      const result = await kywardDB.updateEmailPreferences(emailPrefs);
      if (result.success) {
        setUser(result.user);
        setPrefsSaved(true);
        setTimeout(() => setPrefsSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setSavingPrefs(false);
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
    // Assessments sorted newest first: [0] = current, [1] = previous
    if (!user.assessments || user.assessments.length < 2) return null;
    const current = user.assessments[0].score;
    const previous = user.assessments[1].score;
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
            <span className="user-email" style={{ color: '#888', marginRight: '15px', fontSize: '14px' }}>{user.email}</span>
            <button className="logout-btn" onClick={onLogout} style={styles.navButtonLogin}>{t.nav.logout}</button>
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
                      {lastScore >= 80 ? (t.report?.score?.excellent || 'Excellent') : lastScore >= 50 ? (t.report?.score?.good || 'Good') : (t.report?.score?.needsWork || 'Needs Work')}
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

          {/* CTA Card - Start Assessment (aquí usamos canTakeNew) */}
          <div className="dash-cta-card" style={{
            ...styles.dashCtaCard,
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: '20px'
          }}>
            <div style={styles.dashCtaCardGlow} />
            <div style={{...styles.dashCtaContent, flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
              <div style={styles.dashCtaIcon}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="20" fill="rgba(247,147,26,0.15)" stroke="#F7931A" strokeWidth="2"/>
                  <path d="M24 14V24L30 30" stroke="#F7931A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{...styles.dashCtaInfo, textAlign: 'center'}}>
                <h2 style={{...styles.dashCtaTitle, fontSize: '20px'}}>
                  {lastAssessment ? t.dashboard.cta.newAssessment : t.dashboard.cta.firstAssessment}
                </h2>
                <p style={{...styles.dashCtaText, fontSize: '14px'}}>
                  {lastAssessment ? t.dashboard.cta.newDesc : t.dashboard.cta.firstDesc}
                </p>
              </div>
            </div>

            {canTakeNew ? (
              <button
                onClick={onStartAssessment}
                className="dash-cta-button"
                style={{
                  ...styles.dashCtaButton,
                  width: '100%',
                  justifyContent: 'center'
                }}
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

          {/* Quick Action Plans - Request Consultation Time */}
          {isPremium && (
            <div style={{
              margin: '32px 0',
              padding: '24px',
              background: 'linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(247,147,26,0.08) 100%)',
              border: '1px solid rgba(168,85,247,0.3)',
              borderRadius: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="12" fill="rgba(168,85,247,0.2)" stroke="#a855f7" strokeWidth="2"/>
                  <path d="M14 8V14L18 16" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3 style={{ color: '#a855f7', margin: 0, fontSize: '18px', fontWeight: '700' }}>
                  {t.dashboard.quickActions?.consultationTitle || 'Quick Action Plans - Sentinel'}
                </h3>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
                {t.dashboard.quickActions?.consultationDesc || 'Request expert consultation time whenever you need personalized security guidance. Add a query whenever you want.'}
              </p>

              <div style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                marginBottom: '16px'
              }}>
                {/* First Hour / Additional Hour Button */}
                <button
                  onClick={() => onUpgrade(user.consultationCount > 0 ? 'consultation_additional' : 'consultation')}
                  style={{
                    flex: '1',
                    minWidth: '200px',
                    padding: '20px',
                    background: 'linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(168,85,247,0.05) 100%)',
                    border: '2px solid rgba(168,85,247,0.4)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#a855f7';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ color: '#a855f7', fontSize: '24px', fontWeight: '800' }}>
                      ${user.consultationCount > 0 ? '49' : '99'}
                    </span>
                    {user.consultationCount > 0 && (
                      <span style={{
                        fontSize: '10px',
                        color: '#22c55e',
                        background: 'rgba(34,197,94,0.15)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontWeight: '600'
                      }}>
                        RETURNING RATE
                      </span>
                    )}
                  </div>
                  <div style={{ color: '#fff', fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                    {user.consultationCount > 0
                      ? (t.dashboard.quickActions?.additionalHour || 'Additional Hour')
                      : (t.dashboard.quickActions?.firstHour || 'First Hour')}
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '13px' }}>
                    {user.consultationCount > 0
                      ? (t.dashboard.quickActions?.additionalHourDesc || '1-on-1 expert consultation')
                      : (t.dashboard.quickActions?.firstHourDesc || 'Private security audit session')}
                  </div>
                </button>

                {/* Multi-hour package hint */}
                <div style={{
                  flex: '1',
                  minWidth: '200px',
                  padding: '20px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px dashed rgba(107,114,128,0.4)',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div style={{ color: '#6b7280', fontSize: '13px', marginBottom: '8px' }}>
                    {t.dashboard.quickActions?.pricingNote || 'Pricing structure:'}
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '12px', lineHeight: '1.6' }}>
                    • {t.dashboard.quickActions?.firstHourPrice || 'First hour: $99'}<br/>
                    • {t.dashboard.quickActions?.subsequentPrice || 'Subsequent hours: $49/hr'}
                  </div>
                  {user.consultationCount > 0 && (
                    <div style={{
                      marginTop: '12px',
                      color: '#22c55e',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      ✓ {t.dashboard.quickActions?.hoursUsed || `${user.consultationCount} hour(s) purchased`}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

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
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9ca3af', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={emailPrefs.dailyTips}
                    onChange={(e) => setEmailPrefs(p => ({ ...p, dailyTips: e.target.checked }))}
                    style={{ accentColor: '#22c55e', cursor: 'pointer' }}
                  />
                  {t.dashboard.dailyTips || 'Daily security tips'}
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9ca3af', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={emailPrefs.securityAlerts}
                    onChange={(e) => setEmailPrefs(p => ({ ...p, securityAlerts: e.target.checked }))}
                    style={{ accentColor: '#22c55e', cursor: 'pointer' }}
                  />
                  {t.dashboard.securityAlerts || 'Security alerts & hack notifications'}
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9ca3af', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={emailPrefs.monthlyReviews}
                    onChange={(e) => setEmailPrefs(p => ({ ...p, monthlyReviews: e.target.checked }))}
                    style={{ accentColor: '#22c55e', cursor: 'pointer' }}
                  />
                  {t.dashboard.monthlyReviews || 'Monthly wallet review reminders'}
                </label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
                <button
                  onClick={handleSavePreferences}
                  disabled={savingPrefs}
                  style={{
                    padding: '10px 20px',
                    background: savingPrefs ? '#6b7280' : '#22c55e',
                    color: '#000',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: savingPrefs ? 'not-allowed' : 'pointer'
                  }}
                >
                  {savingPrefs ? (t.common.saving || 'Saving...') : (t.common.saveChanges || 'Save Preferences')}
                </button>
                {prefsSaved && (
                  <span style={{ color: '#22c55e', fontSize: '14px', fontWeight: '600' }}>
                    ✓ {t.common.saved || 'Saved!'}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Assessment History - Enhanced with PDF download */}
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
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    padding: '20px'
                  }}>
                    {/* Top row: Score + Date */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{
                        ...styles.dashHistoryScore,
                        fontSize: '32px',
                        fontWeight: '800',
                        color: assessment.score >= 80 ? '#22c55e' : assessment.score >= 50 ? '#F7931A' : '#ef4444'
                      }}>
                        {assessment.score}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#9ca3af', fontSize: '13px' }}>
                          {new Date(assessment.timestamp || assessment.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: assessment.score >= 80 ? '#22c55e' : assessment.score >= 50 ? '#F7931A' : '#ef4444'
                        }}>
                          {assessment.score >= 80 ? (t.report?.score?.excellent || 'Excellent') : assessment.score >= 50 ? (t.report?.score?.good || 'Good') : (t.report?.score?.needsWork || 'Needs Work')}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); onViewReport && onViewReport(assessment); }}
                        style={{
                          flex: 1,
                          padding: '10px 12px',
                          background: 'rgba(247,147,26,0.15)',
                          border: '1px solid rgba(247,147,26,0.3)',
                          borderRadius: '8px',
                          color: '#F7931A',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>📊</span> {t.dashboard.history.viewReport || 'View'}
                      </button>
                      {isPremium && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openPdfPreview(user, assessment.score, assessment.responses, language);
                          }}
                          style={{
                            flex: 1,
                            padding: '10px 12px',
                            background: 'rgba(59,130,246,0.15)',
                            border: '1px solid rgba(59,130,246,0.3)',
                            borderRadius: '8px',
                            color: '#3b82f6',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <span>📄</span> PDF
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions - Subtle upgrade section for Free users (moved below history) */}
          {isFree && (
            <div style={{
              marginTop: '32px',
              padding: '24px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid #2a2a2a',
              borderRadius: '16px'
            }}>
              <h3 style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {t.dashboard.quickActions?.title || 'Upgrade Options'}
              </h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => onUpgrade('essential')}
                  style={{
                    flex: '1',
                    minWidth: '160px',
                    padding: '14px 16px',
                    background: 'transparent',
                    border: '1px solid rgba(247,147,26,0.4)',
                    borderRadius: '10px',
                    color: '#F7931A',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  <span>{t.landing?.plans?.essential?.name || 'Essential'}</span>
                  <span style={{ fontSize: '11px', color: '#6b7280' }}>$7.99 one-time</span>
                </button>
                <button
                  onClick={() => onUpgrade('sentinel')}
                  style={{
                    flex: '1',
                    minWidth: '160px',
                    padding: '14px 16px',
                    background: 'transparent',
                    border: '1px solid rgba(34,197,94,0.4)',
                    borderRadius: '10px',
                    color: '#22c55e',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  <span>{t.landing?.plans?.sentinel?.name || 'Sentinel'}</span>
                  <span style={{ fontSize: '11px', color: '#6b7280' }}>$14.99/month</span>
                </button>
                <button
                  onClick={() => onUpgrade('consultation')}
                  style={{
                    flex: '1',
                    minWidth: '160px',
                    padding: '14px 16px',
                    background: 'transparent',
                    border: '1px solid rgba(168,85,247,0.4)',
                    borderRadius: '10px',
                    color: '#a855f7',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  <span>{t.landing?.plans?.consultation?.name || 'Consultation'}</span>
                  <span style={{ fontSize: '11px', color: '#6b7280' }}>$99/session</span>
                </button>
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