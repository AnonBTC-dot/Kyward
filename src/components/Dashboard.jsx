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

  // Telegram linking state
  const [telegramStatus, setTelegramStatus] = useState(null);
  const [telegramLoading, setTelegramLoading] = useState(false);
  const [telegramCode, setTelegramCode] = useState(null);
  const [telegramCodeExpiry, setTelegramCodeExpiry] = useState(null);
  const [copiedTelegramCode, setCopiedTelegramCode] = useState(false);

  // Fetch Telegram link status for Sentinel users
  useEffect(() => {
    const subscriptionLevel = user?.subscriptionLevel || user?.subscription || 'free';
    const isSentinelOrConsultation = subscriptionLevel === 'sentinel' || subscriptionLevel === 'consultation';

    if (isSentinelOrConsultation) {
      const fetchTelegramStatus = async () => {
        try {
          const token = localStorage.getItem('kyward_session_token');
          if (!token) return; // Skip if no token
          const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/telegram/status`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setTelegramStatus(data);
          }
        } catch (error) {
          console.error('Error fetching Telegram status:', error);
        }
      };
      fetchTelegramStatus();
    }
  }, [user?.subscriptionLevel, user?.subscription]);

  // Handle initiating Telegram link
  const handleLinkTelegram = async () => {
    setTelegramLoading(true);
    setTelegramCode(null);
    try {
      const token = localStorage.getItem('kyward_session_token');
      if (!token) {
        alert('Session expired. Please log in again.');
        window.location.href = '/login';
        return;
      }
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/telegram/link/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setTelegramCode(data.verificationCode);
        setTelegramCodeExpiry(new Date(data.expiresAt));
      } else {
        alert(data.error || 'Failed to generate code');
      }
    } catch (error) {
      console.error('Error starting Telegram link:', error);
      alert('Failed to connect. Please try again.');
    } finally {
      setTelegramLoading(false);
    }
  };

  // Handle unlinking Telegram
  const handleUnlinkTelegram = async () => {
    if (!confirm('Are you sure you want to unlink your Telegram account?')) return;

    setTelegramLoading(true);
    try {
      const token = localStorage.getItem('kyward_session_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/telegram/unlink`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setTelegramStatus({ linked: false, canLink: true });
        setTelegramCode(null);
      }
    } catch (error) {
      console.error('Error unlinking Telegram:', error);
    } finally {
      setTelegramLoading(false);
    }
  };

  // Copy Telegram code to clipboard
  const handleCopyTelegramCode = () => {
    if (telegramCode) {
      navigator.clipboard.writeText(`/link ${telegramCode}`);
      setCopiedTelegramCode(true);
      setTimeout(() => setCopiedTelegramCode(false), 2000);
    }
  };

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
            <img src="/kywardw.svg" style={{ width: '180px', height: 'auto', maxHeight: '100px', cursor: 'pointer'}} onClick={() => window.location.href = "https://kyward.com"} />
            <span style={styles.navLogoText}></span>
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

          {/* Expert Consultation - Available for all premium users */}
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
                  {language === 'es' ? 'Consultoria Experta' : 'Expert Consultation'}
                </h3>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
                {language === 'es'
                  ? 'Solicita tiempo de consultoria personalizada con expertos en seguridad Bitcoin.'
                  : 'Request personalized consultation time with Bitcoin security experts.'}
              </p>

              <div style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                marginBottom: '16px'
              }}>
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
                        {language === 'es' ? 'TARIFA CLIENTE' : 'RETURNING RATE'}
                      </span>
                    )}
                  </div>
                  <div style={{ color: '#fff', fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                    {user.consultationCount > 0
                      ? (language === 'es' ? 'Hora Adicional' : 'Additional Hour')
                      : (language === 'es' ? 'Primera Hora' : 'First Hour')}
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '13px' }}>
                    {language === 'es' ? 'Sesion privada de auditoria de seguridad' : 'Private security audit session'}
                  </div>
                </button>

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
                    {language === 'es' ? 'Estructura de precios:' : 'Pricing structure:'}
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '12px', lineHeight: '1.6' }}>
                    • {language === 'es' ? 'Primera hora: $99' : 'First hour: $99'}<br/>
                    • {language === 'es' ? 'Horas adicionales: $49/hr' : 'Subsequent hours: $49/hr'}
                  </div>
                  {user.consultationCount > 0 && (
                    <div style={{
                      marginTop: '12px',
                      color: '#22c55e',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      ✓ {user.consultationCount} {language === 'es' ? 'hora(s) compradas' : 'hour(s) purchased'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* BTC Guardian Bot - Sentinel users only */}
          {isSentinel && (
            <div style={{
              margin: '32px 0',
              padding: '24px',
              background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(34,197,94,0.08) 100%)',
              border: '1px solid rgba(59,130,246,0.3)',
              borderRadius: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="12" fill="rgba(59,130,246,0.2)" stroke="#3b82f6" strokeWidth="2"/>
                  <path d="M8 14L12 18L20 10" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3 style={{ color: '#3b82f6', margin: 0, fontSize: '18px', fontWeight: '700' }}>
                  {language === 'es' ? 'BTC Guardian - Bot de Telegram' : 'BTC Guardian - Telegram Bot'}
                </h3>
              </div>

              <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
                {language === 'es'
                  ? 'Vincula tu cuenta de Telegram para recibir alertas de balance en tiempo real, notificaciones de transacciones y seguimiento de precio de BTC.'
                  : 'Link your Telegram account to receive real-time balance alerts, transaction notifications, and BTC price tracking.'}
              </p>

              {telegramStatus?.linked ? (
                // Already linked
                <div style={{
                  padding: '16px',
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  borderRadius: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <span style={{ color: '#22c55e', fontSize: '20px' }}>✓</span>
                    <span style={{ color: '#22c55e', fontWeight: '600' }}>
                      {language === 'es' ? 'Telegram Vinculado' : 'Telegram Linked'}
                    </span>
                  </div>
                  {telegramStatus.telegramUsername && (
                    <p style={{ color: '#9ca3af', fontSize: '13px', margin: '0 0 12px 0' }}>
                      @{telegramStatus.telegramUsername}
                      {telegramStatus.linkedAt && (
                        <span style={{ marginLeft: '8px', color: '#6b7280' }}>
                          ({language === 'es' ? 'desde' : 'since'} {new Date(telegramStatus.linkedAt).toLocaleDateString()})
                        </span>
                      )}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <a
                      href="https://t.me/GuardianBTCBot"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '10px 16px',
                        background: '#3b82f6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '13px',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                      </svg>
                      {language === 'es' ? 'Abrir Bot' : 'Open Bot'}
                    </a>
                    <button
                      onClick={handleUnlinkTelegram}
                      disabled={telegramLoading}
                      style={{
                        padding: '10px 16px',
                        background: 'transparent',
                        color: '#ef4444',
                        border: '1px solid rgba(239,68,68,0.4)',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '13px',
                        cursor: telegramLoading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {language === 'es' ? 'Desvincular' : 'Unlink'}
                    </button>
                  </div>
                </div>
              ) : telegramCode ? (
                // Show verification code
                <div style={{
                  padding: '20px',
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.3)',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '16px' }}>
                    {language === 'es'
                      ? 'Abre @GuardianBTCBot en Telegram y envia:'
                      : 'Open @GuardianBTCBot on Telegram and send:'}
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <code style={{
                      padding: '12px 20px',
                      background: 'rgba(0,0,0,0.3)',
                      borderRadius: '8px',
                      color: '#3b82f6',
                      fontSize: '18px',
                      fontWeight: '700',
                      fontFamily: 'monospace'
                    }}>
                      /link {telegramCode}
                    </code>
                    <button
                      onClick={handleCopyTelegramCode}
                      style={{
                        padding: '12px',
                        background: copiedTelegramCode ? '#22c55e' : 'rgba(59,130,246,0.2)',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        color: copiedTelegramCode ? '#fff' : '#3b82f6'
                      }}
                    >
                      {copiedTelegramCode ? '✓' : '📋'}
                    </button>
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>
                    {language === 'es'
                      ? `Codigo valido por 10 minutos`
                      : `Code valid for 10 minutes`}
                  </p>
                  <a
                    href="https://t.me/GuardianBTCBot"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      marginTop: '16px',
                      padding: '12px 24px',
                      background: '#3b82f6',
                      color: '#fff',
                      borderRadius: '8px',
                      fontWeight: '600',
                      textDecoration: 'none'
                    }}
                  >
                    {language === 'es' ? 'Abrir @GuardianBTCBot' : 'Open @GuardianBTCBot'}
                  </a>
                </div>
              ) : (
                // Not linked - show link button
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={handleLinkTelegram}
                    disabled={telegramLoading}
                    style={{
                      padding: '14px 24px',
                      background: telegramLoading ? '#6b7280' : '#3b82f6',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: telegramLoading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                    </svg>
                    {telegramLoading
                      ? (language === 'es' ? 'Generando...' : 'Generating...')
                      : (language === 'es' ? 'Vincular Telegram' : 'Link Telegram')}
                  </button>
                  <div style={{ color: '#6b7280', fontSize: '13px', display: 'flex', alignItems: 'center' }}>
                    {language === 'es'
                      ? 'Incluido con tu suscripcion Sentinel'
                      : 'Included with your Sentinel subscription'}
                  </div>
                </div>
              )}
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