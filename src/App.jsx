import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import Questionnaire from './components/Questionnaire';
import Report from './components/Report';
import PaymentModal from './components/PaymentModal';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import { kywardDB } from './services/Database';
import { LanguageProvider } from './i18n';
import { Analytics } from '@vercel/analytics/react';

const KywardApp = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [lastResults, setLastResults] = useState(null);
  const [paymentModal, setPaymentModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Clear any existing session on app load - always start fresh on landing page
  useEffect(() => {
    const clearSessionOnLoad = async () => {
      try {
        // Always logout and clear session - users should start fresh
        await kywardDB.logout();
        setUser(null);
      } catch (error) {
        console.error('Failed to clear session:', error);
      }
    };

    clearSessionOnLoad();
  }, []);

  const handleAssessmentComplete = (results) => {
    setLastResults(results);
    setCurrentPage('report');
  };

  const handleUpgrade = (level) => {
    // Show payment modal
    setPaymentModal({ plan: level });
  };

  const handlePaymentSuccess = async (pdfPassword) => {
    // Refresh user data (force refresh from API)
    const updatedUser = await kywardDB.getUser(true);
    if (updatedUser) {
      // Also load user's assessments
      const assessments = await kywardDB.getUserAssessments();
      updatedUser.assessments = assessments;
      setUser(updatedUser);
    }
    setPaymentModal(null);

    // Show success message
    alert(`Upgrade successful!\n\nYour PDF password is: ${pdfPassword}\n\nYou can now download your complete security plan.`);
  };

  const handleLogout = async () => {
    await kywardDB.logout();
    setUser(null);
    setLastResults(null);
    setCurrentPage('landing');
  };

  // Render payment modal if active
  const renderPaymentModal = () => {
    if (!paymentModal || !user) return null;

    return (
      <PaymentModal
        plan={paymentModal.plan}
        user={user}
        onSuccess={handlePaymentSuccess}
        onClose={() => setPaymentModal(null)}
      />
    );
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage
            onLogin={() => setCurrentPage('login')}
            onSignup={() => setCurrentPage('signup')}
            onPrivacyPolicy={() => setCurrentPage('privacy')}
            onTermsOfService={() => setCurrentPage('terms')}
          />
        );

      case 'privacy':
        return <PrivacyPolicy onBack={() => setCurrentPage('landing')} />;

      case 'terms':
        return <TermsOfService onBack={() => setCurrentPage('landing')} />;

      case 'login':
      case 'signup':
        return (
          <AuthForm
            initialMode={currentPage}
            onAuthSuccess={(u) => { setUser(u); setCurrentPage('dashboard'); }}
            onBack={() => setCurrentPage('landing')}
          />
        );

      case 'dashboard':
        return (
          <Dashboard
            user={user}
            setUser={setUser}
            onStartAssessment={() => setCurrentPage('questionnaire')}
            onLogout={handleLogout}
            onUpgrade={handleUpgrade}
            onViewReport={(assessment) => {
              setLastResults({ score: assessment.score, responses: assessment.responses });
              setCurrentPage('report');
            }}
          />
        );

      case 'questionnaire':
        return (
          <Questionnaire
            user={user}
            setUser={setUser}
            onComplete={handleAssessmentComplete}
            onCancel={() => setCurrentPage('dashboard')}
          />
        );

      case 'report':
        return (
          <Report
            score={lastResults?.score}
            answers={lastResults?.answers || lastResults?.responses}
            user={user}
            setUser={setUser}
            onBackToDashboard={() => setCurrentPage('dashboard')}
            onUpgrade={handleUpgrade}
            onStartAssessment={() => setCurrentPage('questionnaire')}
          />
        );

      default:
        return <LandingPage onLogin={() => setCurrentPage('login')} onSignup={() => setCurrentPage('signup')} />;
    }
  };

  // Show loading while checking session
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
        color: '#F7931A',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <LanguageProvider>
      {renderPage()}
      {renderPaymentModal()}
      <Analytics />
    </LanguageProvider>
  );
};

export default KywardApp;
