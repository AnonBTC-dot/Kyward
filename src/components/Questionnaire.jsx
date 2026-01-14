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

  // Question structure with points - labels come from translations
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

  // Build questions array with translated text
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
      const currentAnswers = answers[questionId] || [];
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter(v => v !== value)
        : [...currentAnswers, value];
      setAnswers({ ...answers, [questionId]: newAnswers });
    } else {
      setAnswers({ ...answers, [questionId]: value });
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    let maxPossibleScore = 0;
    questions.forEach(q => {
      const answer = answers[q.id];
      if (q.type === 'radio' && answer) {
        const selectedOption = q.options.find(opt => opt.value === answer);
        if (selectedOption) totalScore += selectedOption.points;
        maxPossibleScore += Math.max(...q.options.map(opt => opt.points));
      } else if (q.type === 'checkbox' && answer && answer.length > 0) {
        answer.forEach(val => {
          const selectedOption = q.options.find(opt => opt.value === val);
          if (selectedOption) totalScore += selectedOption.points;
        });
        maxPossibleScore += Math.max(...q.options.map(opt => opt.points));
      }
    });
    return Math.max(0, Math.min(100, Math.round((totalScore / maxPossibleScore) * 100)));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    const canTake = kywardDB.canTakeAssessment(user.email);
    if (!canTake.canTake) {
      setError(t.questionnaire.errors.limitReached);
      setLoading(false);
      return;
    }

    const score = calculateScore();
    const assessment = {
      userId: user.email,
      responses: answers,
      score: score,
      timestamp: new Date().toISOString()
    };

    try {
      kywardDB.saveAssessment(user.email, assessment);
      const updatedUser = kywardDB.getUser(user.email);
      setUser(updatedUser); 
      onComplete(assessment);
    } catch (e) {
      setError(t.questionnaire.errors.savingError);
    } finally {
      setLoading(false);
    }
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const progressPercent = Math.round(progress);
  const isAnswered = currentQ.type === 'checkbox' ?
    (answers[currentQ.id] && answers[currentQ.id].length > 0) :
    !!answers[currentQ.id];

  // Check if option is selected
  const isOptionSelected = (optionValue) => {
    if (currentQ.type === 'checkbox') {
      return (answers[currentQ.id] || []).includes(optionValue);
    }
    return answers[currentQ.id] === optionValue;
  };

  return (
    <div style={styles.dashContainer}>
      <div className="questionnaire-container" style={styles.questionnaireContainer}>
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Language Toggle */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <LanguageToggle />
        </div>

        {/* Enhanced Progress Section */}
        <div style={styles.progressSection}>
          <div style={styles.progressHeader}>
            <span style={styles.progressLabel}>{t.questionnaire.progress} {currentQuestion + 1} {t.questionnaire.of} {questions.length}</span>
            <span style={styles.progressPercentage}>{progressPercent}% {t.questionnaire.complete}</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{...styles.progressFill, width: `${progress}%`}} />
          </div>
          {/* Progress dots */}
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

        {/* Question Card with Glow */}
        <div className="question-card" style={styles.questionCard}>
          <div style={styles.questionCardGlow} />

          {/* Question Number Badge */}
          <div style={styles.questionNumber}>
            {currentQ.type === 'checkbox' ? `☑ ${t.questionnaire.selectAll}` : `${t.questionnaire.progress} ${currentQuestion + 1}`}
          </div>

          <h2 className="question-title" style={styles.questionTitle}>{currentQ.question}</h2>

          <div style={styles.optionsContainer}>
            {currentQ.options.map(option => {
              const selected = isOptionSelected(option.value);
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
                  {/* Glow bar on left */}
                  <div style={{
                    ...styles.optionGlow,
                    ...(selected ? styles.optionGlowActive : {})
                  }} />

                  <label style={styles.optionLabel} onClick={(e) => e.stopPropagation()}>
                    {/* Hidden input */}
                    <input
                      type={currentQ.type}
                      name={currentQ.id}
                      value={option.value}
                      checked={selected}
                      onChange={() => handleAnswerChange(currentQ.id, option.value, currentQ.type === 'checkbox')}
                      style={styles.optionInput}
                    />

                    {/* Custom Radio/Checkbox */}
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
                className="prev-button"
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                style={styles.prevButton}
              >
                ← {t.questionnaire.previous}
              </button>
            )}
            <div style={{flex: 1}} />
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
                style={{...styles.submitButton, ...(loading || !isAnswered ? {opacity: 0.6} : {})}}
                disabled={loading || !isAnswered}
              >
                {loading ? t.questionnaire.calculating : `${t.questionnaire.getScore} ✓`}
              </button>
            )}
          </div>
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