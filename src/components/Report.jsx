import React, { useState, useEffect } from 'react';
import { styles } from '../styles/Theme';
import { kywardDB } from '../services/Database';
import { generateRecommendations, getFreeTips, getLockedTipsPreview, generateInheritancePlan } from '../services/Recommendations';
import { openPdfPreview, downloadHtmlReport } from '../services/PdfGenerator';
import { previewEmail, sendSecurityPlanEmail } from '../services/EmailService';
import TelegramBlur from './TelegramBlur';

const Report = ({ score, answers, user, setUser, onBackToDashboard, onUpgrade }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [freeTips, setFreeTips] = useState([]);
  const [lockedTips, setLockedTips] = useState([]);
  const [expandedTip, setExpandedTip] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  const isPremium = user && kywardDB.hasPremiumAccess(user.email);

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
    if (s >= 80) return 'Excellent Security';
    if (s >= 50) return 'Moderate Security';
    return 'Needs Improvement';
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
      case 'critical': return 'CRITICAL';
      case 'high': return 'HIGH';
      case 'medium': return 'MEDIUM';
      case 'low': return 'LOW';
      default: return 'INFO';
    }
  };

  // Tips to display based on subscription
  const displayTips = isPremium ? recommendations : freeTips;

  // Calculate critical/high priority count for urgency
  const criticalCount = recommendations.filter(r => r.priority === 'critical' || r.priority === 'high').length;

  return (
    <div style={styles.reportContainer2}>
      {/* Background Effects */}
      <div style={styles.reportGlow1} />
      <div style={styles.reportGlow2} />

      {/* Header */}
      <header style={styles.reportHeader}>
        <div style={styles.reportBadge}>
          Security Assessment Complete
        </div>
        <h1 style={styles.reportTitle}>Your Security Report</h1>
        <p style={styles.reportSubtitle}>
          Based on your answers, here's your personalized Bitcoin security analysis.
        </p>
      </header>

      {/* Score Section */}
      <div style={styles.reportScoreSection}>
        <div style={styles.reportScoreCard}>
          <div style={styles.reportScoreCardGlow} />
          <div style={styles.reportScoreVisual}>
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
              <div style={{...styles.reportScoreNumber, color: getScoreColor(score)}}>{score}</div>
              <div style={styles.reportScoreOf}>/100</div>
            </div>
          </div>
          <div style={{...styles.reportScoreLabel, color: getScoreColor(score)}}>
            {getScoreLabel(score)}
          </div>
          <p style={styles.reportScoreDesc}>
            {score >= 80 ? 'Your Bitcoin security practices are excellent. Focus on optimization and inheritance planning.' :
             score >= 50 ? 'You have a solid foundation, but there are important areas to improve.' :
             'Your Bitcoin is at significant risk. Follow the recommendations below immediately.'}
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
                  Compare with Bitcoin Community
                </span>
              </div>
              <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', margin: 0 }}>
                How You Compare to Other Bitcoiners
              </h3>
            </div>

            {/* Main Comparison */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
              marginBottom: '32px'
            }}>
              {/* Your Score */}
              <div style={{
                background: `${getScoreColor(score)}10`,
                border: `1px solid ${getScoreColor(score)}40`,
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <div style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '8px' }}>YOUR SCORE</div>
                <div style={{ fontSize: '48px', fontWeight: '800', color: getScoreColor(score) }}>
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
              <div style={{
                background: 'rgba(107,114,128,0.1)',
                border: '1px solid rgba(107,114,128,0.3)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <div style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '8px' }}>COMMUNITY AVERAGE</div>
                <div style={{ fontSize: '48px', fontWeight: '800', color: '#6b7280' }}>
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
                    {comparison.isAboveAverage ? '+' : ''}{comparison.difference} pts
                  </span>
                  <span style={{ color: '#6b7280', fontSize: '13px' }}>
                    {comparison.isAboveAverage ? 'above avg' : comparison.isBelowAverage ? 'below avg' : 'at avg'}
                  </span>
                </div>
              </div>

              {/* Percentile */}
              <div style={{
                background: 'rgba(168,85,247,0.1)',
                border: '1px solid rgba(168,85,247,0.3)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <div style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '8px' }}>YOUR PERCENTILE</div>
                <div style={{ fontSize: '48px', fontWeight: '800', color: '#a855f7' }}>
                  {comparison.percentile}%
                </div>
                <div style={{ color: '#9ca3af', fontSize: '13px', marginTop: '8px' }}>
                  Better than {comparison.percentile}% of users
                </div>
              </div>
            </div>

            {/* Distribution Chart */}
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <div style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
                SCORE DISTRIBUTION AMONG BITCOIN HOLDERS
              </div>

              {/* Bar Chart */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', height: '100px', marginBottom: '16px' }}>
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
                        You're here
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
                        You're here
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
                        You're here
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Labels */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: '600' }}>Needs Work</div>
                  <div style={{ color: '#6b7280', fontSize: '11px' }}>0-49 pts</div>
                  <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>
                    {comparison.distribution.needsWork}%
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ color: '#F7931A', fontSize: '12px', fontWeight: '600' }}>Moderate</div>
                  <div style={{ color: '#6b7280', fontSize: '11px' }}>50-79 pts</div>
                  <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>
                    {comparison.distribution.moderate}%
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ color: '#22c55e', fontSize: '12px', fontWeight: '600' }}>Excellent</div>
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
                    <strong>Great job!</strong> Your security score is {comparison.comparison} the average Bitcoin holder.
                    {score < 80 && ' Keep improving to reach the top tier.'}
                  </>
                ) : comparison.isBelowAverage ? (
                  <>
                    <strong>Room for improvement!</strong> Your score is {Math.abs(comparison.difference)} points below the average.
                    Follow the recommendations below to improve your security.
                  </>
                ) : (
                  <>
                    <strong>Right at average!</strong> You're on par with most Bitcoin holders.
                    Take action on the recommendations to stand out from the crowd.
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
          padding: '24px',
          margin: '0 auto 40px',
          maxWidth: '800px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#F7931A', marginBottom: '8px', fontWeight: '600' }}>
            YOUR ASSESSMENT FOUND
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#ef4444' }}>{criticalCount}</div>
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>Critical Issues</div>
            </div>
            <div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#F7931A' }}>{recommendations.length}</div>
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>Total Recommendations</div>
            </div>
            <div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#22c55e' }}>3</div>
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>Free Tips Below</div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Section */}
      <div style={styles.reportRecsSection}>
        <div style={styles.reportRecsHeader}>
          <h2 style={styles.reportRecsTitle}>
            {isPremium ? 'Your Complete Action Plan' : 'Your Free Security Tips'}
          </h2>
          <p style={styles.reportRecsSubtitle}>
            {isPremium
              ? `${recommendations.length} personalized recommendations based on your answers`
              : `Here are 3 tips to get you started. Upgrade to unlock all ${recommendations.length} recommendations.`
            }
          </p>
        </div>

        {/* Tips List */}
        <div style={styles.reportTipsList}>
          {displayTips.map((tip, index) => (
            <div
              key={tip.id}
              className="report-tip-card"
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
                  {expandedTip === tip.id ? 'Click to collapse' : 'Click to expand'}
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
                    {lockedTips.length} More Recommendations Locked
                  </h3>
                  <p style={{ color: '#9ca3af', fontSize: '14px', margin: '4px 0 0 0' }}>
                    Upgrade to unlock all personalized security recommendations
                  </p>
                </div>
              </div>

              {/* Premium Locked Tips with Telegram Blur */}
              <TelegramBlur
                isRevealed={false}
                showLockIcon={true}
                showStars={true}
                accentColor="#F7931A"
                revealText={`Unlock ${lockedTips.length} recommendations`}
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
                  + {lockedTips.length - 5} more personalized recommendations...
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
                Unlock All Recommendations - $10
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
                  Unlock Your Complete Security & Inheritance Plan
                </h2>
                <p style={{ color: '#9ca3af', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
                  Don't just know your score - know exactly how to fix every issue and protect your Bitcoin for generations.
                </p>
              </div>

              {/* Benefits Grid */}
              <div style={{
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
                    All {recommendations.length} Recommendations
                  </h4>
                  <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                    Detailed step-by-step instructions for every security improvement, prioritized by urgency.
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
                    Password-Protected PDF
                  </h4>
                  <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                    Download or receive by email a secure document you can save offline and reference anytime.
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
                    Complete Inheritance Plan
                  </h4>
                  <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                    Step-by-step guide to ensure your Bitcoin passes to your heirs safely using Liana time-locks.
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
                    Multi-Signature Setup Guide
                  </h4>
                  <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                    Learn how to set up 2-of-3 multisig for maximum security with Sparrow Wallet.
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
                    Sparrow Wallet Tutorial
                  </h4>
                  <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                    Complete guide to setting up and using Sparrow Wallet for maximum sovereignty.
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
                    Unlimited Re-Assessments
                  </h4>
                  <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                    Track your progress over time. Retake the assessment whenever you want.
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
                      Your Personal Security & Inheritance Plan
                    </div>
                    <div style={{ color: '#666', fontSize: '13px' }}>
                      Password-protected document ready for download
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
                    <span>✓ Executive Summary</span>
                    <span>✓ Security Score Breakdown</span>
                    <span>✓ All Recommendations</span>
                    <span>✓ Sparrow Setup Guide</span>
                    <span>✓ Multisig Instructions</span>
                    <span>✓ Liana Inheritance Setup</span>
                    <span>✓ Backup Strategies</span>
                    <span>✓ Action Plan Checklist</span>
                  </div>
                </div>
              </div>

              {/* Pricing Options */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '20px'
              }}>
                {/* Complete Plan */}
                <div style={{
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
                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '48px', fontWeight: '800', color: '#F7931A' }}>$10</span>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}> one-time</span>
                  </div>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 24px 0',
                    textAlign: 'left',
                    color: '#9ca3af',
                    fontSize: '14px'
                  }}>
                    <li style={{ marginBottom: '8px' }}>✓ All {recommendations.length} recommendations</li>
                    <li style={{ marginBottom: '8px' }}>✓ Downloadable PDF report</li>
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
                    Pay with Bitcoin
                  </button>
                </div>

                {/* Consultation */}
                <div style={{
                  background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
                  border: '1px solid #3a3a3a',
                  borderRadius: '20px',
                  padding: '32px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>
                    Consultation
                  </h3>
                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '48px', fontWeight: '800', color: '#22c55e' }}>$100</span>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}> one-time</span>
                  </div>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 24px 0',
                    textAlign: 'left',
                    color: '#9ca3af',
                    fontSize: '14px'
                  }}>
                    <li style={{ marginBottom: '8px' }}>✓ Everything in Complete</li>
                    <li style={{ marginBottom: '8px' }}>✓ 60-min video consultation</li>
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
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '32px',
                marginTop: '32px',
                flexWrap: 'wrap'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>🔒</div>
                  <div style={{ color: '#6b7280', fontSize: '12px' }}>Pay with Bitcoin</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>🚫</div>
                  <div style={{ color: '#6b7280', fontSize: '12px' }}>No KYC Required</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>⚡</div>
                  <div style={{ color: '#6b7280', fontSize: '12px' }}>Instant Access</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>🛡️</div>
                  <div style={{ color: '#6b7280', fontSize: '12px' }}>100% Private</div>
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
                  <strong>⚠️ You have {criticalCount} critical/high priority issues.</strong>
                  <br />
                  <span style={{ color: '#9ca3af' }}>
                    Get your complete plan now to protect your Bitcoin before it's too late.
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
                <h4 style={styles.reportPdfTitle}>Download Your Inheritance Plan (PDF)</h4>
                <p style={styles.reportPdfText}>
                  Complete plan with Sparrow, Liana, multisig setup guides, and step-by-step instructions.
                </p>
              </div>
              <button
                style={styles.reportPdfBtn}
                onClick={() => openPdfPreview(user, score, answers)}
              >
                Download PDF
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
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>PDF Password</div>
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
                    {showPassword ? 'Hide' : 'Show'}
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
                    {copiedPassword ? 'Copied!' : 'Copy'}
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
                The PDF will be sent to <strong>{user?.email}</strong> with this password.
              </p>
              <button
                style={{...styles.reportPdfBtn, marginTop: '16px', backgroundColor: '#3b82f6'}}
                onClick={() => previewEmail(user, score, answers)}
              >
                Preview Email
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div style={styles.reportFooter}>
        <button onClick={onBackToDashboard} style={styles.reportBackBtn}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Report;
