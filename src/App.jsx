import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import Questionnaire from './components/Questionnaire';
import Report from './components/Report';

const KywardApp = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [lastResults, setLastResults] = useState(null); // Para guardar el score temporalmente

  const handleAssessmentComplete = (results) => {
    setLastResults(results);
    setCurrentPage('report');
  };

  // El SWITCH de navegación
  switch (currentPage) {
    case 'landing':
      return <LandingPage onLogin={() => setCurrentPage('login')} onSignup={() => setCurrentPage('signup')} />;
    
    case 'login':
    case 'signup':
      return <AuthForm initialMode={currentPage} onAuthSuccess={(u) => { setUser(u); setCurrentPage('dashboard'); }} onBack={() => setCurrentPage('landing')} />;

    case 'dashboard':
      return <Dashboard user={user} onStartAssessment={() => setCurrentPage('questionnaire')} onLogout={() => setCurrentPage('landing')} />;

    case 'questionnaire':
      return <Questionnaire onComplete={handleAssessmentComplete} onCancel={() => setCurrentPage('dashboard')} />;

    case 'report':
      return <Report score={lastResults?.score} answers={lastResults?.answers} onBackToDashboard={() => setCurrentPage('dashboard')} />;

    default:
      return <LandingPage />;
  }
};

export default KywardApp;