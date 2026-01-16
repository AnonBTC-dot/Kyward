import React, { useState } from 'react';
import { styles } from '../styles/Theme';
import { kywardDB } from '../services/Database';
import { useLanguage, LanguageToggle } from '../i18n';

const Questionnaire = ({ user, setUser, onComplete, onCancel }) => {
  const { t } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [canStart, setCanStart] = useState(null); // null = cargando, true/false = resultado

  // Verificar si el usuario puede empezar el cuestionario
  useState(() => {
    const checkPermission = async () => {
      try {
        const can = await kywardDB.canTakeNewAssessment(user?.email);
        setCanStart(can);
        if (!can) {
          setError(t.questionnaire.errors.limitReached);
        }
      } catch (err) {
        setError('Error al verificar permisos');
        setCanStart(false);
      }
    };
    checkPermission();
  }, [user]);

  // Question structure with points
  const questionData = [
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
      const canTake = await kywardDB.canTakeNewAssessment();
      if (!canTake) {
        setError(t.questionnaire.errors.limitReached);
        return;
      }

      const score = calculateScore();
      const assessment = {
        userId: user.email,
        responses: answers,
        score,
        timestamp: new Date().toISOString()
      };

      const result = await kywardDB.saveAssessment(user.email, score, answers);
      if (result.success) {
        const updatedUser = await kywardDB.getUser(user.email);
        setUser(updatedUser);
        onComplete({ score, answers });
      } else {
        setError(t.questionnaire.errors.savingError);
      }
    } catch (err) {
      setError('Error al guardar la evaluación');
    } finally {
      setLoading(false);
    }
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const progressPercent = Math.round(progress);
  const isAnswered = currentQ.type === 'checkbox' ?
    (answers[currentQ.id]?.length > 0) :
    !!answers[currentQ.id];

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
            {currentQ.type === 'checkbox' ? `☑ ${t.questionnaire.selectAll}` : `${t.questionnaire.progress} ${currentQuestion + 1}`}
          </div>

          <h2 className="question-title" style={styles.questionTitle}>{currentQ.question}</h2>

          <div style={styles.optionsContainer}>
            {currentQ.options.map(option => {
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
                    ...(selected ? styles.optionGlowActive : {})
                  }} />

                  <label style={styles.optionLabel} onClick={e => e.stopPropagation()}>
                    <input
                      type={currentQ.type}
                      name={currentQ.id}
                      value={option.value}
                      checked={selected}
                      onChange={() => {}}
                      style={styles.optionInput}
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
            })}
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
                onClick={handleSubmit}
                style={{
                  ...styles.submitButton,
                  ...(loading || !isAnswered || !canStart ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
                  backgroundColor: !canStart ? '#ef4444' : '#22c55e'
                }}
                disabled={loading || !isAnswered || !canStart}
              >
                {loading ? t.questionnaire.calculating : `${t.questionnaire.getScore} ✓`}
              </button>
            )}
          </div>

          {/* Mensaje si no puede empezar (Essential ya usado) */}
          {!canStart && !loading && (
            <p style={{
              color: '#ef4444',
              fontSize: '14px',
              textAlign: 'center',
              marginTop: '16px'
            }}>
              {t.questionnaire.errors.limitReached}
            </p>
          )}
        </div>

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