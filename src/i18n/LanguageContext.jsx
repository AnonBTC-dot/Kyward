import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

// Create context
const LanguageContext = createContext();

// Language provider component
export const LanguageProvider = ({ children }) => {
  // Get initial language from localStorage or browser preference
  const getInitialLanguage = () => {
    const saved = localStorage.getItem('kyward_language');
    if (saved && (saved === 'en' || saved === 'es')) {
      return saved;
    }
    // Check browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('es')) {
      return 'es';
    }
    return 'en';
  };

  const [language, setLanguage] = useState(getInitialLanguage);

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('kyward_language', language);
    // Also set html lang attribute for accessibility
    document.documentElement.lang = language;
  }, [language]);

  // Toggle between languages
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
  };

  // Set specific language
  const setLang = (lang) => {
    if (lang === 'en' || lang === 'es') {
      setLanguage(lang);
    }
  };

  // Get current translations
  const t = translations[language];

  // Translation helper function with nested key support
  // Usage: translate('landing.heroTitle') or translate('auth.errors.invalidCredentials')
  const translate = (key) => {
    const keys = key.split('.');
    let value = t;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key; // Return key if translation not found
      }
    }

    return value;
  };

  const value = {
    language,
    setLanguage: setLang,
    toggleLanguage,
    t, // Direct access to translations object
    translate, // Helper function for nested keys
    isSpanish: language === 'es',
    isEnglish: language === 'en'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Language toggle button component
export const LanguageToggle = ({ style = {} }) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="language-toggle"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 12px',
        background: 'rgba(247,147,26,0.1)',
        border: '1px solid rgba(247,147,26,0.3)',
        borderRadius: '8px',
        color: '#F7931A',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        flexShrink: 0,
        ...style
      }}
      onMouseEnter={(e) => {
        e.target.style.background = 'rgba(247,147,26,0.2)';
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'rgba(247,147,26,0.1)';
      }}
      title={language === 'en' ? 'Cambiar a Español' : 'Switch to English'}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
      <span>{language === 'en' ? 'ES' : 'EN'}</span>
    </button>
  );
};

export default LanguageContext;
