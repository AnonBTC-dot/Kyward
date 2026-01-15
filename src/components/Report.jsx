import React, { useState, useEffect } from 'react';
import { styles } from '../styles/Theme';
import { kywardDB } from '../services/Database';
import { generateRecommendations, getFreeTips, getLockedTipsPreview, generateInheritancePlan } from '../services/Recommendations';
import { openPdfPreview, downloadHtmlReport } from '../services/PdfGenerator';
import { previewEmail, sendSecurityPlanEmail } from '../services/EmailService';
import TelegramBlur from './TelegramBlur';
import Footer from './Footer';
import { useLanguage, LanguageToggle } from '../i18n';

const Report = ({ score, answers, user, setUser, onBackToDashboard, onUpgrade, onStartAssessment }) => {
  const { t } = useLanguage();
  const [recommendations, setRecommendations] = useState([]);
  const [freeTips, setFreeTips] = useState([]);
  const [lockedTips, setLockedTips] = useState([]);
  const [expandedTip, setExpandedTip] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  // Plan detection - más preciso para los 4 tiers
  const subscriptionLevel = user?.subscriptionLevel || user?.subscription || 'free';

  const isFree = subscriptionLevel === 'free';
  const isEssential = subscriptionLevel === 'essential';
  const isSentinel = subscriptionLevel === 'sentinel';
  const isConsultation = subscriptionLevel === 'consultation';

  const isPremium = isEssential || isSentinel || isConsultation;

  // Determinar qué mostrar según plan
  const showFullReport = isPremium;                          // Full tips + recomendaciones
  const showPdfButton = isPremium;                           // PDF solo premium
  const showEmailButton = isPremium;                         // Email solo premium
  const showNewAssessmentButton = (isSentinel || isConsultation || kywardDB.canTakeNewAssessment?.(user?.email)) ?? false;

  const handleCopyPassword = () => {
    if (user?.pdfPassword) {
      navigator.clipboard.writeText(user.pdfPassword);
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
  };

  useEffect(() => {
    if (answers && score !== undefined) {
      const recs = generateRecommendations(answers, score);
      setRecommendations(recs);
      setFreeTips(getFreeTips(recs));
      setLockedTips(getLockedTipsPreview(recs));

      // Get comparison with global average
      const comparisonData = kywardDB.compareToAverage(score);
      setComparison(comparisonData);
    }
  }, [answers, score]);

  const getScoreColor = (s) => {
    if (s >= 80) return '#22c55e';
    if (s >= 50) return '#F7931A';
    return '#ef4444';
  };

  const getScoreLabel = (s) => {
    if (s >= 80) return t.report.score.excellent;
    if (s >= 50) return t.report.score.good;
    return t.report.score.needsWork;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#F7931A';
      case 'medium': return '#3b82f6';
      case 'low': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'critical': return t.report.recommendations.priority.critical;
      case 'high': return t.report.recommendations.priority.high;
      case 'medium': return t.report.recommendations.priority.medium;
      case 'low': return t.report.recommendations.priority.low;
      default: return 'INFO';
    }
  };

  // Tips to display based on subscription
  // Tips a mostrar según plan
    let displayTips = [];
    if (isFree) {
      displayTips = freeTips.slice(0, 1); // Solo 1 tip crítico en Free
    } else if (isEssential) {
      displayTips = recommendations; // Todo para Essential
    } else {
      displayTips = recommendations; // Todo para Sentinel/Consultation
    }

  // Calculate critical/high priority count for urgency
  const criticalCount = recommendations.filter(r => r.priority === 'critical' || r.priority === 'high').length;

  return (
    <div className="report-container" style={styles.reportContainer2}>
      {/* Background Effects */}
      <div style={styles.reportGlow1} />
      <div style={styles.reportGlow2} />

      {/* Language Toggle */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px 20px 0', maxWidth: '900px', margin: '0 auto' }}>
        <LanguageToggle />
      </div>

      {/* Header */}
      <header style={styles.reportHeader}>
        <div style={styles.reportBadge}>
          {t.report.badge}
        </div>
        <h1 className="report-title" style={styles.reportTitle}>{t.report.title}</h1>
        <p className="report-subtitle" style={styles.reportSubtitle}>
          {t.report.subtitle}
        </p>
      </header>

      {/* Score Section */}
      <div style={styles.reportScoreSection}>
        <div className="score-card" style={styles.reportScoreCard}>
          <div style={styles.reportScoreCardGlow} />
          <div className="score-visual" style={styles.reportScoreVisual}>
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="80" fill="none" stroke="#2a2a2a" strokeWidth="12"/>
              <circle
                cx="90" cy="90" r="80"
                fill="none"
                stroke={getScoreColor(score)}
                strokeWidth="12"
                strokeDasharray={2 * Math.PI * 80}
                strokeDashoffset={2 * Math.PI * 80 * (1 - score / 100)}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '90px 90px', transition: 'stroke-dashoffset 1.5s ease-out' }}
              />
            </svg>
            <div style={styles.reportScoreInner}>
              <div className="score-number" style={{...styles.reportScoreNumber, color: getScoreColor(score)}}>{score}</div>
              <div style={styles.reportScoreOf}>/100</div>
            </div>
          </div>
          <div style={{...styles.reportScoreLabel, color: getScoreColor(score)}}>
            {getScoreLabel(score)}

            {isEssential && (
              <p style={{ 
                marginTop: '16px', 
                fontSize: '13px', 
                color: '#F7931A', 
                fontStyle: 'italic' 
              }}>
                {t.common.oneTimeNote || 'One-time assessment - repurchase to retake'}
              </p>
            )}
            {isSentinel && (
              <p style={{ 
                marginTop: '16px', 
                fontSize: '13px', 
                color: '#22c55e' 
              }}>
                {t.common.unlimitedAccess || 'Unlimited assessments & features'}
              </p>
            )}
          </div>
          <p style={styles.reportScoreDesc}>
            {score >= 80 ? t.report.score.excellentDesc :
             score >= 50 ? t.report.score.goodDesc :
             t.report.score.needsWorkDesc}
          </p>
        </div>
      </div>

      {/* Comparison Section - How You Compare */}
      {comparison && (
        <div style={{
          maxWidth: '900px',
          margin: '0 auto 48px',
          padding: '0 20px'
        }}>
          <div style={{
            background: 'linear-gradient(180deg, rgba(26,26,26,0.9) 0%, rgba(15,15,15,0.95) 100%)',
            border: '1px solid #2a2a2a',
            borderRadius: '20px',
            padding: '32px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'rgba(59,130,246,0.1)',
                border: '1px solid rgba(59,130,246,0.3)',
                borderRadius: '20px',
                marginBottom: '12px'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="9" cy="7" r="4" stroke="#3b82f6" strokeWidth="2"/>
                  <path d="M23 21V19C23 17.1362 21.7252 15.5701 20 15.126" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16 3.12602C17.7252 3.57006 19 5.13616 19 7C19 8.86384 17.7252 10.4299 16 10.874" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span style={{ color: '#3b82f6', fontSize: '13px', fontWeight: '600' }}>
                  {t.report.comparison.badge}
                </span>
              </div>
              <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', margin: 0 }}>
                {t.report.comparison.title}
              </h3>
            </div>

            {/* Main Comparison */}
            <div className="comparison-stats-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
              marginBottom: '32px'
            }}>
              {/* Your Score */}
              <div className="comparison-stat-card" style={{
                background: `${getScoreColor(score)}10`,
                border: `1px solid ${getScoreColor(score)}40`,
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <div style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '8px' }}>{t.report.comparison.yourScore}</div>
                <div className="comparison-stat-number" style={{ fontSize: '48px', fontWeight: '800', color: getScoreColor(score) }}>
                  {score}
                </div>
                <div style={{
                  marginTop: '12px',
                  padding: '6px 12px',
                  background: `${getScoreColor(score)}20`,
                  borderRadius: '20px',
                  display: 'inline-block',
                  color: getScoreColor(score),
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  {getScoreLabel(score)}
                </div>
              </div>

              {/* Community Average */}
              <div className="comparison-stat-card" style={{
                background: 'rgba(107,114,128,0.1)',
                border: '1px solid rgba(107,114,128,0.3)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <div style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '8px' }}>{t.report.comparison.communityAvg}</div>
                <div className="comparison-stat-number" style={{ fontSize: '48px', fontWeight: '800', color: '#6b7280' }}>
                  {comparison.averageScore}
                </div>
                <div style={{
                  marginTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}>
                  <span style={{
                    color: comparison.isAboveAverage ? '#22c55e' : comparison.isBelowAverage ? '#ef4444' : '#6b7280',
                    fontSize: '14px',
                    fontWeight: '700'
                  }}>
                    {comparison.isAboveAverage ? '+' : ''}{comparison.difference} {t.report.comparison.points}
                  </span>
                  <span style={{ color: '#6b7280', fontSize: '13px' }}>
                    {comparison.isAboveAverage ? t.report.comparison.aboveAvg : comparison.isBelowAverage ? t.report.comparison.belowAvg : t.report.comparison.atAvg}
                  </span>
                </div>
              </div>

              {/* Percentile */}
              <div className="comparison-stat-card" style={{
                background: 'rgba(168,85,247,0.1)',
                border: '1px solid rgba(168,85,247,0.3)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <div style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '8px' }}>{t.report.comparison.percentile}</div>
                <div className="comparison-stat-number" style={{ fontSize: '48px', fontWeight: '800', color: '#a855f7' }}>
                  {comparison.percentile}%
                </div>
                <div style={{ color: '#9ca3af', fontSize: '13px', marginTop: '8px' }}>
                  {t.report.comparison.betterThan} {comparison.percentile}{t.report.comparison.ofUsers}
                </div>
              </div>
            </div>

            {/* Distribution Chart */}
            <div className="distribution-chart" style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <div style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
                {t.report.distribution.title}
              </div>

              {/* Bar Chart */}
              <div className="distribution-bar" style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', height: '100px', marginBottom: '16px' }}>
                {/* Needs Work */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '100%',
                    background: score < 50 ? '#ef4444' : 'rgba(239,68,68,0.3)',
                    borderRadius: '8px 8px 0 0',
                    height: `${Math.max(20, comparison.distribution.needsWork)}%`,
                    transition: 'height 1s ease',
                    position: 'relative'
                  }}>
                    {score < 50 && (
                      <div style={{
                        position: 'absolute',
                        top: '-30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#ef4444',
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        whiteSpace: 'nowrap'
                      }}>
                        {t.report.distribution.youAreHere}
                      </div>
                    )}
                  </div>
                </div>

                {/* Moderate */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '100%',
                    background: score >= 50 && score < 80 ? '#F7931A' : 'rgba(247,147,26,0.3)',
                    borderRadius: '8px 8px 0 0',
                    height: `${Math.max(20, comparison.distribution.moderate)}%`,
                    transition: 'height 1s ease',
                    position: 'relative'
                  }}>
                    {score >= 50 && score < 80 && (
                      <div style={{
                        position: 'absolute',
                        top: '-30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#F7931A',
                        color: '#000',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        whiteSpace: 'nowrap'
                      }}>
                        {t.report.distribution.youAreHere}
                      </div>
                    )}
                  </div>
                </div>

                {/* Excellent */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '100%',
                    background: score >= 80 ? '#22c55e' : 'rgba(34,197,94,0.3)',
                    borderRadius: '8px 8px 0 0',
                    height: `${Math.max(20, comparison.distribution.excellent)}%`,
                    transition: 'height 1s ease',
                    position: 'relative'
                  }}>
                    {score >= 80 && (
                      <div style={{
                        position: 'absolute',
                        top: '-30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#22c55e',
                        color: '#000',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        whiteSpace: 'nowrap'
                      }}>
                        {t.report.distribution.youAreHere}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Labels */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: '600' }}>{t.report.distribution.needsWork}</div>
                  <div style={{ color: '#6b7280', fontSize: '11px' }}>0-49 pts</div>
                  <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>
                    {comparison.distribution.needsWork}%
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ color: '#F7931A', fontSize: '12px', fontWeight: '600' }}>{t.report.distribution.average}</div>
                  <div style={{ color: '#6b7280', fontSize: '11px' }}>50-79 pts</div>
                  <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>
                    {comparison.distribution.moderate}%
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ color: '#22c55e', fontSize: '12px', fontWeight: '600' }}>{t.report.distribution.excellent}</div>
                  <div style={{ color: '#6b7280', fontSize: '11px' }}>80-100 pts</div>
                  <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>
                    {comparison.distribution.excellent}%
                  </div>
                </div>
              </div>
            </div>

            {/* Insight Message */}
            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: comparison.isAboveAverage ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${comparison.isAboveAverage ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <p style={{
                margin: 0,
                color: comparison.isAboveAverage ? '#22c55e' : '#ef4444',
                fontSize: '14px'
              }}>
                {comparison.isAboveAverage ? (
                  <>
                    <strong>{t.report.comparison.greatJob}</strong> {t.report.comparison.yourScoreIs} {comparison.comparison} {t.report.comparison.theAverage}
                    {score < 80 && ` ${t.report.comparison.keepImproving}`}
                  </>
                ) : comparison.isBelowAverage ? (
                  <>
                    <strong>{t.report.comparison.roomForImprovement}</strong> {t.report.comparison.pointsBelow} {Math.abs(comparison.difference)} {t.report.comparison.pointsBelowAvg}
                    {` ${t.report.comparison.followRecs}`}
                  </>
                ) : (
                  <>
                    <strong>{t.report.comparison.rightAtAverage}</strong> {t.report.comparison.onParWith}
                    {` ${t.report.comparison.takeAction}`}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Free User: Quick Summary Box */}
      {!isPremium && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(247,147,26,0.1) 0%, rgba(239,68,68,0.1) 100%)',
          border: '1px solid rgba(247,147,26,0.3)',
          borderRadius: '16px',
          padding: '32px',
          margin: '48px auto',
          maxWidth: '800px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#F7931A', fontSize: '24px', marginBottom: '16px' }}>
            {t.report.upgrade.unlockFullReport}
          </h3>

          <p style={{ color: '#9ca3af', marginBottom: '24px' }}>
            {t.report.upgrade.freeLimitedTo} {freeTips.length} {t.report.upgrade.tipsOnly}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
            <button
              onClick={() => onUpgrade('essential')}
              style={{
                padding: '16px',
                background: '#F7931A',
                color: '#000',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {t.common.getEssential || 'Get Essential - $7.99 one-time'}
            </button>

            <button
              onClick={() => onUpgrade('sentinel')}
              style={{
                padding: '16px',
                background: 'transparent',
                border: '2px solid #22c55e',
                color: '#22c55e',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {t.common.subscribeSentinel || 'Subscribe Sentinel - Unlimited'}
            </button>
          </div>
        </div>
      )}

      {/* Recommendations Section */}
      <div style={styles.reportRecsSection}>
        <div style={styles.reportRecsHeader}>
          <h2 className="recs-title" style={styles.reportRecsTitle}>
            {isPremium ? t.report.recommendations.premiumTitle : t.report.recommendations.freeTitle}
          </h2>
          <p style={styles.reportRecsSubtitle}>
            {isPremium
              ? `${recommendations.length} ${t.report.recommendations.premiumSubtitle}`
              : `${t.report.recommendations.freeSubtitle} ${recommendations.length} ${t.report.recommendations.freeSubtitle2}`
            }
          </p>
        </div>

        {/* Tips List */}
        <div style={styles.reportTipsList}>
          {displayTips.map((tip, index) => (
            <div
              key={tip.id}
              className="report-tip-card tip-card"
              style={styles.reportTipCard}
              onClick={() => isPremium && setExpandedTip(expandedTip === tip.id ? null : tip.id)}
            >
              <div style={styles.reportTipHeader}>
                <div style={styles.reportTipLeft}>
                  <span style={{
                    ...styles.reportTipPriority,
                    backgroundColor: `${getPriorityColor(tip.priority)}20`,
                    color: getPriorityColor(tip.priority)
                  }}>
                    {getPriorityLabel(tip.priority)}
                  </span>
                  <span style={styles.reportTipCategory}>{tip.category}</span>
                </div>
                <div style={styles.reportTipNumber}>#{index + 1}</div>
              </div>

              <h3 style={styles.reportTipTitle}>{tip.title}</h3>
              <p style={styles.reportTipShort}>{tip.shortTip}</p>

              {/* Expanded content for premium users */}
              {isPremium && expandedTip === tip.id && (
                <div style={styles.reportTipExpanded}>
                  <div style={styles.reportTipDivider} />
                  <div style={styles.reportTipFull}>
                    {tip.fullTip.split('\n').map((line, i) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <h4 key={i} style={styles.reportTipFullHeading}>{line.replace(/\*\*/g, '')}</h4>;
                      }
                      if (line.startsWith('- ')) {
                        return <li key={i} style={styles.reportTipFullList}>{line.substring(2)}</li>;
                      }
                      if (line.match(/^\d+\./)) {
                        return <li key={i} style={styles.reportTipFullList}>{line.substring(line.indexOf('.') + 2)}</li>;
                      }
                      if (line.trim() === '') {
                        return <br key={i} />;
                      }
                      return <p key={i} style={styles.reportTipFullText}>{line}</p>;
                    })}
                  </div>
                </div>
              )}

              {isPremium && (
                <div style={styles.reportTipExpand}>
                  {expandedTip === tip.id ? t.report.recommendations.clickCollapse : t.report.recommendations.clickExpand}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ===== FREE USER UPGRADE SECTION ===== */}
        {!isPremium && (
          <div style={{ marginTop: '48px' }}>

            {/* Locked Tips Preview with Telegram Blur Effect */}
            <div style={{
              background: 'linear-gradient(180deg, rgba(26,26,26,0.9) 0%, rgba(15,15,15,0.95) 100%)',
              border: '1px solid #2a2a2a',
              borderRadius: '20px',
              padding: '32px',
              marginBottom: '32px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px'
              }}>
                <span style={{ fontSize: '24px' }}>🔒</span>
                <div>
                  <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', margin: 0 }}>
                    {lockedTips.length} {t.report.recommendations.locked}
                  </h3>
                  <p style={{ color: '#9ca3af', fontSize: '14px', margin: '4px 0 0 0' }}>
                    {t.report.recommendations.lockedDesc}
                  </p>
                </div>
              </div>

              {/* Premium Locked Tips with Telegram Blur */}
              <TelegramBlur
                isRevealed={false}
                showLockIcon={true}
                showStars={true}
                accentColor="#F7931A"
                revealText={`${t.report.recommendations.unlock} ${lockedTips.length} ${t.report.recommendations.recommendations}`}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  padding: '8px'
                }}>
                  {lockedTips.slice(0, 5).map((tip, index) => (
                    <div key={tip.id} style={{
                      background: '#1a1a1a',
                      border: '1px solid #2a2a2a',
                      borderRadius: '12px',
                      padding: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '700',
                          backgroundColor: `${getPriorityColor(tip.priority)}20`,
                          color: getPriorityColor(tip.priority)
                        }}>
                          {getPriorityLabel(tip.priority)}
                        </span>
                        <span style={{ color: '#6b7280', fontSize: '12px' }}>{tip.category}</span>
                      </div>
                      <span style={{ color: '#fff', fontWeight: '600', fontSize: '15px' }}>{tip.title}</span>
                      <p style={{ color: '#9ca3af', fontSize: '13px', margin: '8px 0 0 0', lineHeight: '1.4' }}>
                        {tip.shortTip}
                      </p>
                    </div>
                  ))}
                </div>
              </TelegramBlur>

              {lockedTips.length > 5 && (
                <p style={{
                  textAlign: 'center',
                  color: '#6b7280',
                  fontSize: '13px',
                  marginTop: '16px',
                  marginBottom: 0
                }}>
                  + {lockedTips.length - 5} {t.report.recommendations.moreRecommendations}
                </p>
              )}

              {/* Upgrade Button */}
              <button
                onClick={() => onUpgrade && onUpgrade('complete')}
                style={{
                  width: '100%',
                  marginTop: '20px',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #F7931A 0%, #f5a623 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#000',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                </svg>
                {t.report.recommendations.unlock} {t.report.recommendations.recommendations} - $7.99/mo
              </button>
            </div>

            {/* What You'll Get Section */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(247,147,26,0.05) 0%, rgba(34,197,94,0.05) 100%)',
              border: '2px solid #F7931A',
              borderRadius: '24px',
              padding: '40px',
              marginBottom: '32px'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  color: '#fff',
                  marginBottom: '12px'
                }}>
                  {t.report.upgrade.title}
                </h2>
                <p style={{ color: '#9ca3af', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
                  {t.report.upgrade.subtitle}
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="benefits-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                marginBottom: '32px'
              }}>
                {/* Benefit 1 */}
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #2a2a2a'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>📋</div>
                  <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>
                    {t.report.upgrade.benefits.recommendations.title.replace('All', `${recommendations.length}`)}
                  </h4>
                  <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                    {t.report.upgrade.benefits.recommendations.description}
                  </p>
                </div>

                {/* Benefit 2 */}
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #2a2a2a'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>📄</div>
                  <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>
                    {t.report.upgrade.benefits.pdf.title}
                  </h4>
                  <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                    {t.report.upgrade.benefits.pdf.description}
                  </p>
                </div>

                {/* Benefit 3 */}
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #2a2a2a'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏦</div>
                  <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>
                    {t.report.upgrade.benefits.inheritance.title}
                  </h4>
                  <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                    {t.report.upgrade.benefits.inheritance.description}
                  </p>
                </div>

                {/* Benefit 4 */}
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #2a2a2a'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔐</div>
                  <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>
                    {t.report.upgrade.benefits.multisig.title}
                  </h4>
                  <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                    {t.report.upgrade.benefits.multisig.description}
                  </p>
                </div>

                {/* Benefit 5 */}
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #2a2a2a'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>💼</div>
                  <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>
                    {t.report.upgrade.benefits.sparrow.title}
                  </h4>
                  <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                    {t.report.upgrade.benefits.sparrow.description}
                  </p>
                </div>

                {/* Benefit 6 */}
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #2a2a2a'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>♾️</div>
                  <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>
                    {t.report.upgrade.benefits.unlimited.title}
                  </h4>
                  <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                    {t.report.upgrade.benefits.unlimited.description}
                  </p>
                </div>
              </div>

              {/* PDF Preview */}
              <div style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '32px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: '#ef4444',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: '800',
                    fontSize: '12px'
                  }}>
                    PDF
                  </div>
                  <div>
                    <div style={{ color: '#333', fontWeight: '700', fontSize: '16px' }}>
                      {t.report.upgrade.pdfPreview.title}
                    </div>
                    <div style={{ color: '#666', fontSize: '13px' }}>
                      {t.report.upgrade.pdfPreview.subtitle}
                    </div>
                  </div>
                </div>
                <div style={{
                  background: '#f5f5f5',
                  borderRadius: '8px',
                  padding: '16px',
                  fontSize: '13px',
                  color: '#666'
                }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {t.report.upgrade.pdfPreview.contents.map((item, i) => (
                      <span key={i}>✓ {item}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing Options */}
              <div className="upgrade-pricing-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '20px'
              }}>
                {/* Complete Plan */}
                <div className="upgrade-pricing-card" style={{
                  background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
                  border: '2px solid #F7931A',
                  borderRadius: '20px',
                  padding: '32px',
                  textAlign: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#F7931A',
                    color: '#000',
                    padding: '4px 16px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}>
                    MOST POPULAR
                  </div>
                  <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>
                    Complete Plan
                  </h3>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '48px', fontWeight: '800', color: '#F7931A' }}>$7.99</span>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>/month</span>
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '16px' }}>
                    Cancel anytime. Billed monthly.
                  </p>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 24px 0',
                    textAlign: 'left',
                    color: '#9ca3af',
                    fontSize: '14px'
                  }}>
                    <li style={{ marginBottom: '8px' }}>✓ All {recommendations.length} recommendations</li>
                    <li style={{ marginBottom: '8px' }}>✓ Unlimited PDF downloads</li>
                    <li style={{ marginBottom: '8px' }}>✓ Complete inheritance plan</li>
                    <li style={{ marginBottom: '8px' }}>✓ Sparrow & Liana guides</li>
                    <li style={{ marginBottom: '8px' }}>✓ Unlimited re-assessments</li>
                    <li style={{ marginBottom: '8px' }}>✓ Email delivery with password</li>
                  </ul>
                  <button
                    onClick={() => onUpgrade && onUpgrade('complete')}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: '#F7931A',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#000',
                      fontSize: '16px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Subscribe Now
                  </button>
                </div>

                {/* Consultation */}
                <div className="upgrade-pricing-card" style={{
                  background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
                  border: '1px solid #3a3a3a',
                  borderRadius: '20px',
                  padding: '32px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>
                    Consultation
                  </h3>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '48px', fontWeight: '800', color: '#22c55e' }}>$99</span>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>/session</span>
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '16px' }}>
                    Additional sessions: $49/hr
                  </p>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 24px 0',
                    textAlign: 'left',
                    color: '#9ca3af',
                    fontSize: '14px'
                  }}>
                    <li style={{ marginBottom: '8px' }}>✓ Everything in Complete</li>
                    <li style={{ marginBottom: '8px' }}>✓ 1-hour video consultation</li>
                    <li style={{ marginBottom: '8px' }}>✓ Custom inheritance strategy</li>
                    <li style={{ marginBottom: '8px' }}>✓ Live multisig setup help</li>
                    <li style={{ marginBottom: '8px' }}>✓ 30-day follow-up support</li>
                    <li style={{ marginBottom: '8px' }}>✓ Priority email support</li>
                  </ul>
                  <button
                    onClick={() => onUpgrade && onUpgrade('consultation')}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'transparent',
                      border: '2px solid #22c55e',
                      borderRadius: '12px',
                      color: '#22c55e',
                      fontSize: '16px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Book Consultation
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="trust-badges" style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '32px',
                marginTop: '32px',
                flexWrap: 'wrap'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>🔒</div>
                  <div style={{ color: '#6b7280', fontSize: '12px' }}>{t.report.upgrade.trustBadges.bitcoin}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>🚫</div>
                  <div style={{ color: '#6b7280', fontSize: '12px' }}>{t.report.upgrade.trustBadges.noKyc}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>⚡</div>
                  <div style={{ color: '#6b7280', fontSize: '12px' }}>{t.report.upgrade.trustBadges.instant}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>🛡️</div>
                  <div style={{ color: '#6b7280', fontSize: '12px' }}>{t.report.upgrade.trustBadges.private}</div>
                </div>
              </div>
            </div>

            {/* Urgency Message */}
            {criticalCount > 0 && (
              <div style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <p style={{ color: '#ef4444', margin: 0, fontSize: '15px' }}>
                  <strong>⚠️ {t.report.upgrade.urgency.message} {criticalCount} {t.report.upgrade.urgency.issues}</strong>
                  <br />
                  <span style={{ color: '#9ca3af' }}>
                    {t.report.upgrade.urgency.cta}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Premium User Actions */}
        {isPremium && (
          <div style={styles.reportPremiumActions}>
            <div style={styles.reportPdfSection}>
              <div style={styles.reportPdfIcon}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect x="8" y="4" width="24" height="32" rx="3" stroke="#22c55e" strokeWidth="2" fill="rgba(34,197,94,0.1)"/>
                  <path d="M14 16H26M14 22H26M14 28H20" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M20 4V12H28" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={styles.reportPdfInfo}>
                <h4 style={styles.reportPdfTitle}>{t.report.premium.downloadPdf}</h4>
                <p style={styles.reportPdfText}>
                  {t.report.premium.pdfDescription}
                </p>
              </div>
              <button
                style={styles.reportPdfBtn}
                onClick={() => openPdfPreview(user, score, answers)}
              >
                {t.report.premium.downloadButton}
              </button>
            </div>

            <div style={styles.reportEmailSection}>
              {/* Password with blur effect */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(247,147,26,0.1)',
                border: '1px solid rgba(247,147,26,0.2)',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="#F7931A" strokeWidth="2"/>
                    <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="#F7931A" strokeWidth="2"/>
                  </svg>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>{t.report.premium.pdfPassword}</div>
                    <div
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'relative',
                        cursor: 'pointer',
                        display: 'inline-block'
                      }}
                    >
                      <span style={{
                        fontFamily: 'monospace',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#F7931A',
                        letterSpacing: '1px',
                        filter: showPassword ? 'none' : 'blur(5px)',
                        transition: 'filter 0.3s ease',
                        userSelect: showPassword ? 'text' : 'none'
                      }}>
                        {user?.pdfPassword || 'N/A'}
                      </span>
                      {!showPassword && (
                        <span style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          pointerEvents: 'none'
                        }}>
                          {[...Array(3)].map((_, i) => (
                            <span
                              key={i}
                              style={{
                                position: 'absolute',
                                left: `${-10 + i * 10}px`,
                                width: '3px',
                                height: '3px',
                                borderRadius: '50%',
                                background: '#F7931A',
                                boxShadow: '0 0 4px #F7931A',
                                animation: `starPulse ${1 + i * 0.2}s ease-in-out infinite`
                              }}
                            />
                          ))}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      padding: '6px 12px',
                      background: 'rgba(107,114,128,0.1)',
                      border: '1px solid rgba(107,114,128,0.2)',
                      borderRadius: '6px',
                      color: '#9ca3af',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {showPassword ? t.report.premium.hide : t.report.premium.show}
                  </button>
                  <button
                    onClick={handleCopyPassword}
                    style={{
                      padding: '6px 12px',
                      background: copiedPassword ? 'rgba(34,197,94,0.1)' : 'rgba(247,147,26,0.1)',
                      border: `1px solid ${copiedPassword ? 'rgba(34,197,94,0.3)' : 'rgba(247,147,26,0.2)'}`,
                      borderRadius: '6px',
                      color: copiedPassword ? '#22c55e' : '#F7931A',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedPassword ? t.report.premium.copied : t.report.premium.copy}
                  </button>
                </div>
              </div>
              <style>{`
                @keyframes starPulse {
                  0%, 100% { opacity: 0.4; transform: scale(1); }
                  50% { opacity: 1; transform: scale(1.3); }
                }
              `}</style>
              <p style={styles.reportEmailNote}>
                {t.report.premium.emailNote} <strong>{user?.email}</strong> {t.report.premium.withPassword}
              </p>
              <button
                style={{...styles.reportPdfBtn, marginTop: '16px', backgroundColor: '#3b82f6'}}
                onClick={() => previewEmail(user, score, answers)}
              >
                {t.report.premium.previewEmail}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div style={styles.reportFooter}>
        <button onClick={onBackToDashboard} style={styles.reportBackBtn}>
          ← {t.report.backToDashboard}
        </button>
      </div>

      {/* Botón Nueva Evaluación - según plan */}
      {showNewAssessmentButton && (
        <div style={{ marginTop: '48px', textAlign: 'center' }}>
          <button
            onClick={onStartAssessment}
            style={{
              padding: '16px 48px',
              background: '#F7931A',
              color: '#000',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px', 
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(247,147,26,0.3)'
            }}
          >
            {t.dashboard.cta.startNewButton}
          </button>
          {isEssential && (
            <p style={{ marginTop: '12px', color: '#F7931A', fontSize: '14px' }}>
              {t.common.oneTimeNote}
            </p>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Report;
