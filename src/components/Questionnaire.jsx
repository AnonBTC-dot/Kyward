import React, { useState } from 'react';
import { styles } from '../styles/Theme';
import { kywardDB } from '../services/Database';
import { useLanguage, LanguageToggle } from '../i18n';

const Questionnaire = ({ user, setUser, onComplete, onCancel, onUpgrade }) => {
  const { t } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEmailStep, setShowEmailStep] = useState(false);
  const [capturedEmail, setCapturedEmail] = useState('');
  const [limitReached, setLimitReached] = useState(false);

  // Question structure with points
  const questionData = [
    { id: 'q0', type: 'path', options: [
      { value: 'beginner', points: 0, icon: '🟡' },
      { value: 'intermediate', points: 0, icon: '🟠' },
      { value: 'advanced', points: 0, icon: '🔴' }
    ]},
    { id: 'q1', type: 'radio', options: [
      { value: 'yes', points: 15 },
      { value: 'sometimes', points: 8 },
      { value: 'no', points: 0 }
    ]},
    { id: 'q2', type: 'radio', options: [
      { value: 'multiple', points: 10 },
      { value: 'single', points: 6 },
      { value: 'digital', points: -5 },
      { value: 'none', points: -10 }
    ]},
    { id: 'q3', type: 'checkbox', options: [
      { value: 'metal', points: 12 },
      { value: 'paper', points: 8 },
      { value: 'bank_vault', points: 10 },
      { value: 'home_safe', points: 6 },
      { value: 'memorized', points: -8 }
    ]},
    { id: 'q4', type: 'radio', options: [
      { value: 'yes_separate', points: 12 },
      { value: 'yes_together', points: 4 },
      { value: 'no', points: 0 }
    ]},
    { id: 'q5', type: 'radio', options: [
      { value: 'yes_multiple', points: 10 },
      { value: 'yes_once', points: 6 },
      { value: 'no', points: -5 }
    ]},
    { id: 'q6', type: 'radio', options: [
      { value: 'yes_3of5', points: 15 },
      { value: 'yes_2of3', points: 12 },
      { value: 'considering', points: 3 },
      { value: 'no', points: 0 }
    ]},
    { id: 'q7', type: 'radio', options: [
      { value: 'hardware', points: 10 },
      { value: 'multiple_sources', points: 7 },
      { value: 'copy_paste', points: -3 },
      { value: 'dont_verify', points: -8 }
    ]},
    { id: 'q8', type: 'radio', options: [
      { value: 'all', points: 12 },
      { value: 'most', points: 8 },
      { value: 'some', points: 3 },
      { value: 'none', points: -10 }
    ]},
    { id: 'q9', type: 'radio', options: [
      { value: 'never', points: 8 },
      { value: 'rarely', points: 4 },
      { value: 'often', points: -5 }
    ]},
    { id: 'q10', type: 'radio', options: [
      { value: 'verify_signatures', points: 10 },
      { value: 'official_only', points: 6 },
      { value: 'auto_update', points: 2 },
      { value: 'rarely_update', points: -3 }
    ]},
    { id: 'q11', type: 'radio', options: [
      { value: 'never', points: 10 },
      { value: 'trusted_person', points: 3 },
      { value: 'multiple', points: -10 },
      { value: 'online', points: -20 }
    ]},
    { id: 'q12', type: 'radio', options: [
      { value: 'yes_airgapped', points: 12 },
      { value: 'yes_dedicated', points: 8 },
      { value: 'separate_phone', points: 5 },
      { value: 'main_device', points: 0 }
    ]},
    { id: 'q13', type: 'radio', options: [
      { value: 'documented_plan', points: 10 },
      { value: 'family_knows', points: 6 },
      { value: 'no_plan', points: -5 },
      { value: 'not_considered', points: -8 }
    ]},
    { id: 'q14', type: 'radio', options: [
      { value: 'advanced', points: 8 },
      { value: 'basic', points: 4 },
      { value: 'heard', points: 0 },
      { value: 'unfamiliar', points: -3 }
    ]},
    { id: 'q15', type: 'radio', options: [
      { value: 'quarterly', points: 10 },
      { value: 'yearly', points: 6 },
      { value: 'rarely', points: 0 },
      { value: 'never', points: -5 }
    ]}
  ];

  // Build questions with translated text
  const questions = questionData.map(q => ({
    ...q,
    question: t.questionnaire.questions[q.id],
    options: q.options.map(opt => ({
      ...opt,
      label: t.questionnaire.answers[q.id][opt.value]
    }))
  }));

  // Path descriptions shown under each q0 option
  const pathDescriptions = {
    en: {
      beginner: 'Simple setup: 1 hardware wallet + secure backup. ~$80–130 total.',
      intermediate: 'Fill the gaps in your existing setup. Cost depends on what you have.',
      advanced: 'Multisig 2-of-3 + inheritance plan. Built for serious long-term security.'
    },
    es: {
      beginner: 'Setup simple: 1 hardware wallet + respaldo seguro. ~$80–130 en total.',
      intermediate: 'Cubre los huecos de tu setup actual. Costo depende de lo que ya tienes.',
      advanced: 'Multisig 2-de-3 + plan de herencia. Para seguridad máxima a largo plazo.'
    }
  };

  const handleAnswerChange = (questionId, value, isCheckbox = false) => {
    if (isCheckbox) {
      const current = answers[questionId] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      setAnswers({ ...answers, [questionId]: updated });
    } else {
      setAnswers({ ...answers, [questionId]: value });
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    let maxPossible = 0;

    questions.forEach(q => {
      const answer = answers[q.id];
      if (q.type === 'radio' && answer) {
        const opt = q.options.find(o => o.value === answer);
        if (opt) totalScore += opt.points;
        maxPossible += Math.max(...q.options.map(o => o.points));
      } else if (q.type === 'checkbox' && answer?.length) {
        answer.forEach(val => {
          const opt = q.options.find(o => o.value === val);
          if (opt) totalScore += opt.points;
        });
        maxPossible += Math.max(...q.options.map(o => o.points));
      }
    });

    return Math.max(0, Math.min(100, Math.round((totalScore / maxPossible) * 100)));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const score = calculateScore();

      if (user) {
        const can = await kywardDB.canTakeNewAssessment(user.email);
        if (!can) {
          setLimitReached(true);
          setShowEmailStep(true);
          return;
        }
        const result = await kywardDB.saveAssessment({ score, responses: answers });
        if (result.success) {
          const updatedUser = await kywardDB.getUser(true);
          setUser(updatedUser);
          localStorage.removeItem('kyward_user_cache');
          const freshUser = await kywardDB.getUser(true);
          setUser(freshUser);
          onComplete({ score, answers });
        } else {
          setError(result.message || 'Failed to save assessment');
        }
      } else {
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
        const response = await fetch(`${apiBase}/assessments/anonymous`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ score, responses: answers, email: capturedEmail })
        });
        const data = await response.json();
        if (!response.ok) {
          if (data.error === 'assessment_limit_reached') {
            if (data.token) kywardDB.setToken(data.token);
            if (data.user) {
              const normalizedUser = kywardDB.normalizeUser(data.user);
              kywardDB.setCachedUser(normalizedUser);
              setUser(normalizedUser);
            }
            setLimitReached(true);
            return;
          }
          setError(data.reason || data.error || 'Failed to save assessment');
          return;
        }
        if (data.token) {
          kywardDB.setToken(data.token);
        }
        if (data.user) {
          const normalizedUser = kywardDB.normalizeUser(data.user);
          kywardDB.setCachedUser(normalizedUser);
          setUser(normalizedUser);
        }
        onComplete({ score, answers });
      }
    } catch (err) {
      setError(err.message || 'Error al guardar la evaluación');
    } finally {
      setLoading(false);
    }
  };

  const currentQ = questions[currentQuestion];
  // q0 is the path selector — don't count it in visible progress
  const technicalQuestionIndex = currentQuestion === 0 ? 0 : currentQuestion;
  const progress = currentQuestion === 0 ? 0 : (currentQuestion / (questions.length - 1)) * 100;
  const progressPercent = Math.round(progress);
  const isAnswered = currentQ.type === 'checkbox'
    ? (answers[currentQ.id]?.length > 0)
    : !!answers[currentQ.id];

  return (
    <div style={styles.dashContainer}>
      <div className="questionnaire-container" style={styles.questionnaireContainer}>
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Language Toggle */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <LanguageToggle />
        </div>

        {/* Progress */}
        <div style={styles.progressSection}>
          <div style={styles.progressHeader}>
            <span style={styles.progressLabel}>
              {t.questionnaire.progress} {currentQuestion + 1} {t.questionnaire.of} {questions.length}
            </span>
            <span style={styles.progressPercentage}>{progressPercent}% {t.questionnaire.complete}</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{...styles.progressFill, width: `${progress}%`}} />
          </div>
          <div style={styles.progressSteps}>
            {questions.map((_, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.progressDot,
                  ...(idx < currentQuestion ? styles.progressDotCompleted : {}),
                  ...(idx === currentQuestion ? styles.progressDotActive : {})
                }}
              />
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div className="question-card" style={styles.questionCard}>
          <div style={styles.questionCardGlow} />

          <div style={styles.questionNumber}>
            {currentQ.type === 'path'
              ? '📍 Setup Profile'
              : currentQ.type === 'checkbox'
                ? `☑ ${t.questionnaire.selectAll}`
                : `${t.questionnaire.progress} ${currentQuestion}`}
          </div>

          <h2 className="question-title" style={styles.questionTitle}>{currentQ.question}</h2>

          <div style={styles.optionsContainer}>
            {currentQ.type === 'path' ? (
              // Special path selector — larger cards with description
              currentQ.options.map(option => {
                const selected = answers[currentQ.id] === option.value;
                const lang = typeof window !== 'undefined' && document.documentElement.lang === 'es' ? 'es' : 'en';
                const desc = pathDescriptions[lang]?.[option.value] || pathDescriptions.en[option.value];
                return (
                  <div
                    key={option.value}
                    onClick={() => handleAnswerChange(currentQ.id, option.value)}
                    style={{
                      ...styles.optionItem,
                      ...(selected ? styles.optionItemSelected : {}),
                      padding: '20px 24px',
                      cursor: 'pointer',
                      marginBottom: '12px'
                    }}
                  >
                    <div style={{
                      ...styles.optionGlow,
                      ...(selected ? styles.optionGlowActive : {}),
                      pointerEvents: 'none'
                    }} />
                    <div style={{ pointerEvents: 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '20px' }}>{option.icon}</span>
                        <span style={{
                          ...styles.optionText,
                          ...(selected ? styles.optionTextSelected : {}),
                          fontWeight: 600,
                          fontSize: '15px'
                        }}>
                          {option.label}
                        </span>
                      </div>
                      <p style={{
                        margin: 0,
                        fontSize: '13px',
                        color: selected ? 'rgba(247,147,26,0.8)' : '#6b7280',
                        paddingLeft: '30px'
                      }}>
                        {desc}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              currentQ.options.map(option => {
                const selected = currentQ.type === 'checkbox'
                  ? (answers[currentQ.id] || []).includes(option.value)
                  : answers[currentQ.id] === option.value;

                return (
                  <div
                    key={option.value}
                    className={`option-item ${selected ? 'selected' : ''}`}
                    style={{
                      ...styles.optionItem,
                      ...(selected ? styles.optionItemSelected : {})
                    }}
                    onClick={() => handleAnswerChange(currentQ.id, option.value, currentQ.type === 'checkbox')}
                  >
                    <div style={{
                      ...styles.optionGlow,
                      ...(selected ? styles.optionGlowActive : {}),
                      pointerEvents: 'none'
                    }} />

                    <label style={{...styles.optionLabel, pointerEvents: 'none'}}>
                      <input
                        type={currentQ.type}
                        name={currentQ.id}
                        value={option.value}
                        checked={selected}
                        onChange={() => handleAnswerChange(currentQ.id, option.value, currentQ.type === 'checkbox')}
                        style={{...styles.optionInput, pointerEvents: 'none'}}
                      />

                      {currentQ.type === 'radio' ? (
                        <div style={{
                          ...styles.optionRadio,
                          ...(selected ? styles.optionRadioSelected : {})
                        }}>
                          <div style={{
                            ...styles.optionRadioInner,
                            ...(selected ? styles.optionRadioInnerSelected : {})
                          }} />
                        </div>
                      ) : (
                        <div style={{
                          ...styles.optionCheckbox,
                          ...(selected ? styles.optionCheckboxSelected : {})
                        }}>
                          <span style={{
                            ...styles.optionCheckmark,
                            ...(selected ? styles.optionCheckmarkSelected : {})
                          }}>✓</span>
                        </div>
                      )}

                      <span style={{
                        ...styles.optionText,
                        ...(selected ? styles.optionTextSelected : {})
                      }}>
                        {option.label}
                      </span>
                    </label>
                  </div>
                );
              })
            )}
          </div>

          <div className="question-buttons" style={styles.questionButtons}>
            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                style={styles.prevButton}
              >
                ← {t.questionnaire.previous}
              </button>
            )}
            <div style={{ flex: 1 }} />
            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={() => isAnswered && setCurrentQuestion(currentQuestion + 1)}
                style={{
                  ...styles.nextButton,
                  ...(isAnswered ? {} : styles.nextButtonDisabled)
                }}
                disabled={!isAnswered}
              >
                {t.questionnaire.next} →
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!isAnswered) return;
                  if (user) {
                    handleSubmit();
                  } else {
                    setShowEmailStep(true);
                  }
                }}
                style={{
                  ...styles.submitButton,
                  ...(!isAnswered || loading ? { opacity: 0.6, cursor: 'not-allowed' } : {})
                }}
                disabled={!isAnswered || loading}
              >
                {loading ? t.questionnaire.calculating : `${t.questionnaire.getScore} ✓`}
              </button>
            )}
          </div>
        </div>

        {showEmailStep && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              background: '#111',
              border: '1px solid #2a2a2a',
              borderRadius: '20px',
              padding: '40px 32px',
              maxWidth: '440px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 24px 80px rgba(0,0,0,0.8)'
            }}>
              {limitReached ? (
                <>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔒</div>
                  <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', margin: '0 0 8px 0' }}>
                    {t.questionnaire.errors.limitReachedTitle}
                  </h2>
                  <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0 0 28px 0', lineHeight: '1.6' }}>
                    {t.questionnaire.errors.limitReachedDesc}
                  </p>
                  <button
                    onClick={() => onUpgrade ? onUpgrade('consultation') : null}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: '#F7931A',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#000',
                      fontSize: '15px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      marginBottom: '12px'
                    }}
                  >
                    {t.questionnaire.errors.bookConsultation}
                  </button>
                  <button
                    onClick={onCancel}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'none',
                      border: '1px solid #3a3a3a',
                      borderRadius: '12px',
                      color: '#9ca3af',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    {t.questionnaire.errors.viewResults}
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>📥</div>
                  <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', margin: '0 0 8px 0' }}>
                    Get your results by email
                  </h2>
                  <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0 0 24px 0', lineHeight: '1.6' }}>
                    We'll send your score and top recommendations — no password, no KYC.
                  </p>
                  <input
                    type="email"
                    value={capturedEmail}
                    onChange={(e) => setCapturedEmail(e.target.value)}
                    placeholder="satoshi@blockmail.com"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && capturedEmail.trim() && !loading && handleSubmit()}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: '#1a1a1a',
                      border: '1px solid #3a3a3a',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '16px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      marginBottom: '12px'
                    }}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !capturedEmail.trim()}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: capturedEmail.trim() && !loading ? '#22c55e' : '#1e1e1e',
                      border: 'none',
                      borderRadius: '12px',
                      color: capturedEmail.trim() && !loading ? '#000' : '#4b5563',
                      fontSize: '15px',
                      fontWeight: '700',
                      cursor: capturedEmail.trim() && !loading ? 'pointer' : 'not-allowed',
                      marginBottom: '14px',
                      transition: 'background 0.2s, color 0.2s'
                    }}
                  >
                    {loading ? t.questionnaire.calculating : `${t.questionnaire.getScore} ✓`}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        <button
          className="cancel-button"
          onClick={onCancel}
          style={styles.cancelButton}
        >
          {t.questionnaire.cancel}
        </button>
      </div>
    </div>
  );
};

export default Questionnaire;