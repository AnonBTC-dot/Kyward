import React from 'react';
import { styles } from '../styles/Theme';

const Report = ({ score, answers, onBackToDashboard }) => {
  
  // Lógica para determinar el color del score
  const getScoreColor = (s) => {
    if (s >= 80) return '#27C93F'; // Verde
    if (s >= 50) return '#F7931A'; // Naranja
    return '#FF5F56'; // Rojo
  };

  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.dashboardContent}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={styles.dashboardTitle}>Security Assessment Report</h1>
          <p style={styles.dashboardSubtitle}>Based on your current Bitcoin storage practices.</p>
        </header>

        {/* SCORE CIRCLE */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <div style={{ position: 'relative', width: '200px', height: '200px' }}>
            <svg width="200" height="200" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#2A2A2A" strokeWidth="8"/>
              <circle 
                cx="60" cy="60" r="54" 
                fill="none" 
                stroke={getScoreColor(score)}
                strokeWidth="8"
                strokeDasharray="339.292"
                strokeDashoffset={339.292 - (339.292 * score) / 100}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px', transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', fontWeight: '800', color: '#fff' }}>{score}</div>
              <div style={{ fontSize: '14px', color: '#888', marginTop: '-5px' }}>SCORE</div>
            </div>
          </div>
        </div>

        {/* RECOMMENDATIONS SECTION */}
        <div style={styles.planSection}>
          <h2 style={styles.planTitle}>Action Plan</h2>
          
          <div style={styles.planCategory}>
            <h3 style={styles.planCategoryTitle}>Critical Improvements</h3>
            {score < 70 ? (
              <div style={styles.recCard}>
                <span style={{...styles.recIcon, color: '#FF5F56'}}>⚠️</span>
                <p style={styles.recText}>Consider moving your funds to a Hardware Wallet for better security.</p>
              </div>
            ) : null}
            
            <div style={styles.recCard}>
              <span style={{...styles.recIcon, color: '#F7931A'}}>🛡️</span>
              <p style={styles.recText}>Verify your seed phrase backup exists in physical form (metal/paper).</p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button onClick={onBackToDashboard} style={styles.startButton}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Report;