import React, { useState } from 'react';
import { styles } from '../styles/Theme'; 
import { kywardDB } from '../services/Database'; 

const Questionnaire = ({ user, setUser, onComplete, onCancel }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 15 Bitcoin Security Questions - COMPLETAS
  const questions = [
    {
      id: 'q1',
      question: 'Do you use a hardware wallet to store your Bitcoin?',
      type: 'radio',
      options: [
        { value: 'yes', label: 'Yes, I use a hardware wallet', points: 15 },
        { value: 'sometimes', label: 'Sometimes, for larger amounts', points: 8 },
        { value: 'no', label: 'No, I use software/mobile wallet', points: 0 }
      ]
    },
    {
      id: 'q2',
      question: 'How often do you back up your wallet seed phrase?',
      type: 'radio',
      options: [
        { value: 'multiple', label: 'Multiple secure locations', points: 10 },
        { value: 'single', label: 'One secure location', points: 6 },
        { value: 'digital', label: 'Digitally (cloud/photo)', points: -5 },
        { value: 'none', label: 'No backup yet', points: -10 }
      ]
    },
    {
      id: 'q3',
      question: 'Where do you store your seed phrase backup?',
      type: 'checkbox',
      options: [
        { value: 'metal', label: 'Metal backup (fireproof)', points: 12 },
        { value: 'paper', label: 'Paper in safe location', points: 8 },
        { value: 'bank_vault', label: 'Bank safety deposit box', points: 10 },
        { value: 'home_safe', label: 'Home safe', points: 6 },
        { value: 'memorized', label: 'Memorized only', points: -8 }
      ]
    },
    {
      id: 'q4',
      question: 'Do you use a passphrase (25th word) with your seed?',
      type: 'radio',
      options: [
        { value: 'yes_separate', label: 'Yes, stored separately', points: 12 },
        { value: 'yes_together', label: 'Yes, stored with seed', points: 4 },
        { value: 'no', label: 'No passphrase', points: 0 }
      ]
    },
    {
      id: 'q5',
      question: 'Have you tested your wallet recovery process?',
      type: 'radio',
      options: [
        { value: 'yes_multiple', label: 'Yes, multiple times', points: 10 },
        { value: 'yes_once', label: 'Yes, once', points: 6 },
        { value: 'no', label: 'No, never tested', points: -5 }
      ]
    },
    {
      id: 'q6',
      question: 'Do you use multi-signature (multisig) setup?',
      type: 'radio',
      options: [
        { value: 'yes_3of5', label: 'Yes, 3-of-5 or higher', points: 15 },
        { value: 'yes_2of3', label: 'Yes, 2-of-3', points: 12 },
        { value: 'considering', label: 'Considering it', points: 3 },
        { value: 'no', label: 'No, single signature', points: 0 }
      ]
    },
    {
      id: 'q7',
      question: 'How do you verify receiving addresses?',
      type: 'radio',
      options: [
        { value: 'hardware', label: 'On hardware wallet screen', points: 10 },
        { value: 'multiple_sources', label: 'Compare multiple sources', points: 7 },
        { value: 'copy_paste', label: 'Copy-paste only', points: -3 },
        { value: 'dont_verify', label: 'Don\'t verify', points: -8 }
      ]
    },
    {
      id: 'q8',
      question: 'How much of your Bitcoin is in cold storage?',
      type: 'radio',
      options: [
        { value: 'all', label: '90-100% (only spending money hot)', points: 12 },
        { value: 'most', label: '50-90%', points: 8 },
        { value: 'some', label: '10-50%', points: 3 },
        { value: 'none', label: 'All in hot wallets/exchanges', points: -10 }
      ]
    },
    {
      id: 'q9',
      question: 'Do you reuse Bitcoin addresses?',
      type: 'radio',
      options: [
        { value: 'never', label: 'Never, always use new addresses', points: 8 },
        { value: 'rarely', label: 'Rarely', points: 4 },
        { value: 'often', label: 'Often reuse addresses', points: -5 }
      ]
    },
    {
      id: 'q10',
      question: 'How do you handle software updates for your wallets?',
      type: 'radio',
      options: [
        { value: 'verify_signatures', label: 'Verify signatures, read release notes', points: 10 },
        { value: 'official_only', label: 'Only from official sources', points: 6 },
        { value: 'auto_update', label: 'Auto-update enabled', points: 2 },
        { value: 'rarely_update', label: 'Rarely update', points: -3 }
      ]
    },
    {
      id: 'q11',
      question: 'Have you shared your seed phrase with anyone?',
      type: 'radio',
      options: [
        { value: 'never', label: 'Never, not even family', points: 10 },
        { value: 'trusted_person', label: 'Only trusted family member', points: 3 },
        { value: 'multiple', label: 'Multiple people know', points: -10 },
        { value: 'online', label: 'Stored digitally/online', points: -20 }
      ]
    },
    {
      id: 'q12',
      question: 'Do you use a dedicated device for Bitcoin transactions?',
      type: 'radio',
      options: [
        { value: 'yes_airgapped', label: 'Yes, air-gapped device', points: 12 },
        { value: 'yes_dedicated', label: 'Yes, dedicated but online', points: 8 },
        { value: 'separate_phone', label: 'Separate phone/tablet', points: 5 },
        { value: 'main_device', label: 'No, use main device', points: 0 }
      ]
    },
    {
      id: 'q13',
      question: 'How do you plan to pass Bitcoin to heirs?',
      type: 'radio',
      options: [
        { value: 'documented_plan', label: 'Documented inheritance plan', points: 10 },
        { value: 'family_knows', label: 'Family knows where to find info', points: 6 },
        { value: 'no_plan', label: 'No plan yet', points: -5 },
        { value: 'not_considered', label: 'Haven\'t considered it', points: -8 }
      ]
    },
    {
      id: 'q14',
      question: 'Do you use coin control and UTXO management?',
      type: 'radio',
      options: [
        { value: 'advanced', label: 'Yes, actively manage UTXOs', points: 8 },
        { value: 'basic', label: 'Basic understanding, sometimes use', points: 4 },
        { value: 'heard', label: 'Heard of it, don\'t use', points: 0 },
        { value: 'unfamiliar', label: 'Unfamiliar with concept', points: -3 }
      ]
    },
    {
      id: 'q15',
      question: 'How often do you review your security setup?',
      type: 'radio',
      options: [
        { value: 'quarterly', label: 'Every 3 months', points: 10 },
        { value: 'yearly', label: 'Once a year', points: 6 },
        { value: 'rarely', label: 'Rarely review', points: 0 },
        { value: 'never', label: 'Never reviewed', points: -5 }
      ]
    }
  ];

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
      setError('Monthly limit reached. Upgrade to premium.');
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
      setError('Error saving assessment');
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
      <div style={styles.questionnaireContainer}>
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Enhanced Progress Section */}
        <div style={styles.progressSection}>
          <div style={styles.progressHeader}>
            <span style={styles.progressLabel}>Question {currentQuestion + 1} of {questions.length}</span>
            <span style={styles.progressPercentage}>{progressPercent}% Complete</span>
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
        <div style={styles.questionCard}>
          <div style={styles.questionCardGlow} />

          {/* Question Number Badge */}
          <div style={styles.questionNumber}>
            {currentQ.type === 'checkbox' ? '☑ Select all that apply' : `Question ${currentQuestion + 1}`}
          </div>

          <h2 style={styles.questionTitle}>{currentQ.question}</h2>

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

          <div style={styles.questionButtons}>
            {currentQuestion > 0 && (
              <button
                className="prev-button"
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                style={styles.prevButton}
              >
                ← Previous
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
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                style={{...styles.submitButton, ...(loading || !isAnswered ? {opacity: 0.6} : {})}}
                disabled={loading || !isAnswered}
              >
                {loading ? 'Calculating...' : 'Get My Score ✓'}
              </button>
            )}
          </div>
        </div>

        <button
          className="cancel-button"
          onClick={onCancel}
          style={styles.cancelButton}
        >
          Cancel Assessment
        </button>
      </div>
    </div>
  );
};

export default Questionnaire;