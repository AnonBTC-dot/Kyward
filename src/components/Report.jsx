import React, { useState, useEffect } from 'react';
import { styles } from '../styles/Theme';
import { kywardDB } from '../services/Database';
import { generateRecommendations, getFreeTips, getLockedTipsPreview, generateInheritancePlan } from '../services/Recommendations';
import { openPdfPreview, downloadHtmlReport } from '../services/PdfGenerator';
import Footer from './Footer';
import { useLanguage, LanguageToggle } from '../i18n';

const Report = ({ score, answers, user, setUser, onBackToDashboard, onUpgrade, onStartAssessment }) => {
  const { t, language } = useLanguage();
  const [recommendations, setRecommendations] = useState([]);
  const [freeTips, setFreeTips] = useState([]);
  const [lockedTips, setLockedTips] = useState([]);
  const [expandedTip, setExpandedTip] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [canTakeNew, setCanTakeNew] = useState(false);

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

  // Check assessment permission asynchronously
  useEffect(() => {
    const checkPermission = async () => {
      if (isSentinel || isConsultation) {
        setCanTakeNew(true);
      } else {
        try {
          const can = await kywardDB.canTakeNewAssessment();
          setCanTakeNew(can);
        } catch {
          setCanTakeNew(false);
        }
      }
    };
    checkPermission();
  }, [isSentinel, isConsultation]);

  const showNewAssessmentButton = canTakeNew;

  useEffect(() => {
    if (answers && score !== undefined) {
      const recs = generateRecommendations(answers, score);
      setRecommendations(recs);
      setFreeTips(getFreeTips(recs));
      setLockedTips(getLockedTipsPreview(recs));

      // Get comparison with global average (async)
      const fetchComparison = async () => {
        try {
          const comparisonData = await kywardDB.compareToAverage(score);
          setComparison(comparisonData);
        } catch (error) {
          console.error('Failed to fetch comparison:', error);
          // Fallback data
          setComparison({
            userScore: score,
            averageScore: 50,
            difference: score - 50,
            percentile: Math.min(99, Math.max(1, Math.round(score * 0.9))),
            isAboveAverage: score > 50,
            isBelowAverage: score < 50,
            comparison: score > 60 ? 'above' : score > 40 ? 'at' : 'below',
            distribution: { excellent: 33, moderate: 34, needsWork: 33 }
          });
        }
      };
      fetchComparison();
    }
  }, [answers, score]);

  // Guard: Wait for translations to load (MUST be after all hooks)
  if (!t?.report?.score || !t?.report?.distribution || !t?.report?.comparison) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
        color: '#F7931A'
      }}>
        Loading...
      </div>
    );
  }

  const getScoreColor = (s) => {
    if (s >= 80) return '#22c55e';
    if (s >= 50) return '#F7931A';
    return '#ef4444';
  };

  const getScoreLabel = (s) => {
    if (s >= 80) return t.report?.score?.excellent || 'Excellent';
    if (s >= 50) return t.report?.score?.good || 'Good';
    return t.report?.score?.needsWork || 'Needs Work';
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
      case 'critical': return t.report?.recommendations?.priority?.critical || 'CRITICAL';
      case 'high': return t.report?.recommendations?.priority?.high || 'HIGH';
      case 'medium': return t.report?.recommendations?.priority?.medium || 'MEDIUM';
      case 'low': return t.report?.recommendations?.priority?.low || 'LOW';
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
          <div className="score-visual" style={{
            ...styles.reportScoreVisual,
            position: 'relative',
            width: '180px',
            height: '180px',
            maxWidth: '100%',
            margin: '0 auto 24px'
          }}>
            <svg width="100%" height="100%" viewBox="0 0 180 180" style={{ display: 'block' }}>
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
            <div className="score-inner" style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div className="score-number" style={{ fontSize: '56px', fontWeight: '800', color: getScoreColor(score), lineHeight: '1' }}>{score}</div>
              <div style={{ fontSize: '18px', color: '#6b7280', fontWeight: '600', marginTop: '4px' }}>/100</div>
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
            {score >= 80 ? (t.report?.score?.excellentDesc || 'Excellent security posture. Keep up the great work!') :
             score >= 50 ? (t.report?.score?.goodDesc || 'Good foundation, but there\'s room for improvement.') :
             (t.report?.score?.needsWorkDesc || 'Your Bitcoin is at significant risk. Follow the recommendations below.')}
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
                {t.report?.distribution?.title || 'SCORE DISTRIBUTION'}
              </div>

              {/* Bar Chart */}
              <div className="distribution-bar" style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', height: '100px', marginBottom: '16px' }}>
                {/* Needs Work */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '100%',
                    background: score < 50 ? '#ef4444' : 'rgba(239,68,68,0.3)',
                    borderRadius: '8px 8px 0 0',
                    height: `${Math.max(20, comparison?.distribution?.needsWork || 33)}%`,
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
                        {t.report?.distribution?.youAreHere || "You're here"}
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
                    height: `${Math.max(20, comparison?.distribution?.moderate || 34)}%`,
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
                        {t.report?.distribution?.youAreHere || "You're here"}
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
                    height: `${Math.max(20, comparison?.distribution?.excellent || 33)}%`,
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
                        {t.report?.distribution?.youAreHere || "You're here"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Labels */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: '600' }}>{t.report?.distribution?.needsWork || 'Needs Work'}</div>
                  <div style={{ color: '#6b7280', fontSize: '11px' }}>0-49 pts</div>
                  <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>
                    {comparison?.distribution?.needsWork || 0}%
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ color: '#F7931A', fontSize: '12px', fontWeight: '600' }}>{t.report?.distribution?.average || 'Average'}</div>
                  <div style={{ color: '#6b7280', fontSize: '11px' }}>50-79 pts</div>
                  <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>
                    {comparison?.distribution?.moderate || 0}%
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ color: '#22c55e', fontSize: '12px', fontWeight: '600' }}>{t.report?.distribution?.excellent || 'Excellent'}</div>
                  <div style={{ color: '#6b7280', fontSize: '11px' }}>80-100 pts</div>
                  <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>
                    {comparison?.distribution?.excellent || 0}%
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

            {/* Locked Recommendations Preview */}
            <div style={{
              background: 'rgba(26,26,26,0.9)',
              border: '1px solid #2a2a2a',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <span style={{ fontSize: '18px' }}>🔒</span>
                <div>
                  <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: '700', margin: 0 }}>
                    +{lockedTips.length} {t.report.recommendations.locked}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '12px', margin: '2px 0 0 0' }}>
                    {t.report.recommendations.lockedDesc}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                {lockedTips.slice(0, 3).map((tip) => (
                  <div key={tip.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '8px',
                    filter: 'blur(3px)',
                    userSelect: 'none',
                    pointerEvents: 'none'
                  }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '700',
                      backgroundColor: `${getPriorityColor(tip.priority)}20`,
                      color: getPriorityColor(tip.priority),
                      flexShrink: 0
                    }}>
                      {getPriorityLabel(tip.priority)}
                    </span>
                    <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>{tip.title}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onUpgrade && onUpgrade('consultation')}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#000',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Book Consultation to Unlock — $99
              </button>
            </div>

            {/* Consultation CTA */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(247,147,26,0.05) 100%)',
              border: '2px solid #22c55e',
              borderRadius: '20px',
              padding: '32px',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', margin: '0 0 8px 0' }}>
                Book a 1:1 Bitcoin Security Consultation
              </h3>
              <div style={{ margin: '16px 0' }}>
                <span style={{ fontSize: '42px', fontWeight: '800', color: '#22c55e' }}>$99</span>
                <span style={{ color: '#6b7280', fontSize: '14px' }}> one-time</span>
              </div>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 24px 0',
                color: '#9ca3af',
                fontSize: '14px',
                textAlign: 'left',
                maxWidth: '360px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}>
                <li style={{ marginBottom: '8px' }}>✓ All {recommendations.length} recommendations unlocked</li>
                <li style={{ marginBottom: '8px' }}>✓ 1:1 expert security review of your setup</li>
                <li style={{ marginBottom: '8px' }}>✓ Actionable checklist tailored to your score</li>
                <li style={{ marginBottom: '8px' }}>✓ No KYC — pay with Bitcoin</li>
              </ul>
              <button
                onClick={() => onUpgrade && onUpgrade('consultation')}
                style={{
                  display: 'block',
                  width: '100%',
                  maxWidth: '360px',
                  margin: '0 auto',
                  padding: '16px',
                  background: '#22c55e',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#000',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Book Consultation
              </button>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '24px',
                marginTop: '20px',
                flexWrap: 'wrap'
              }}>
                <span style={{ color: '#6b7280', fontSize: '12px' }}>🔒 Bitcoin payments</span>
                <span style={{ color: '#6b7280', fontSize: '12px' }}>🚫 No KYC</span>
                <span style={{ color: '#6b7280', fontSize: '12px' }}>🛡️ Private</span>
              </div>
            </div>
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
                onClick={() => openPdfPreview(user, score, answers, language)}
              >
                {t.report.premium.downloadButton}
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
