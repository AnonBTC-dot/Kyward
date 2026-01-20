import React from 'react';
import { styles } from '../styles/Theme';
import { useLanguage, LanguageToggle } from '../i18n';
import Footer from './Footer';

const LandingPage = ({ onLogin, onSignup }) => {
  const { t } = useLanguage();
  return (
    <div style={styles.landingContainer}>
      {/* NAVIGATION */}
      <nav style={styles.nav}>
        <div className="nav-content" style={styles.navContent}>
          <div style={styles.navLogo}>
            <img src="/vite.svg" alt="Kyward" style={{ width: '40px', height: '40px' }} />
            <span className="nav-logo-text" style={styles.navLogoText}>Kyward</span>
          </div>
          <div className="nav-buttons" style={styles.navButtons}>
            <LanguageToggle />
            <button onClick={onLogin} className="nav-button" style={styles.navButtonLogin}>{t.nav.login}</button>
            <button onClick={onSignup} className="nav-button" style={styles.navButtonSignup}>{t.nav.getStarted}</button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section" style={styles.hero}>
        <div style={styles.heroBackground}>
          <div style={{...styles.orangeGlow, top: '10%', left: '10%'}} />
          <div style={{...styles.orangeGlow, bottom: '20%', right: '15%', animationDelay: '1s'}} />
        </div>

        <div className="hero-content" style={styles.heroContent}>
          <div style={styles.heroBadge}>{t.landing.heroBadge}</div>
          <h1 className="hero-title" style={styles.heroTitle}>
            {t.landing.heroLine1}<br />
            <span style={styles.heroTitleAccent}>{t.landing.heroLine2}</span><br />
            {t.landing.heroLine3}
          </h1>
          <p className="hero-subtitle" style={styles.heroSubtitle}>
            {t.landing.heroSubtitle}
          </p>
          <div className="hero-buttons" style={styles.heroButtons}>
            <button onClick={onSignup} style={styles.heroCTA}>
              {t.landing.heroCta}
              <span style={styles.heroCtaArrow}>→</span>
            </button>
            <button onClick={() => {
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }} style={styles.heroSecondary}>
              {t.landing.heroSecondaryCta}
            </button>
          </div>
          <div className="hero-stats" style={styles.heroStats}>
            <div style={styles.heroStat}>
              <div style={styles.heroStatNumber}>{t.landing.heroStats.nonCustodialValue}</div>
              <div style={styles.heroStatLabel}>{t.landing.heroStats.nonCustodial}</div>
            </div>
            <div className="hero-stat-divider" style={styles.heroStatDivider} />
            <div style={styles.heroStat}>
              <div style={styles.heroStatNumber}>{t.landing.heroStats.dataStoredValue}</div>
              <div style={styles.heroStatLabel}>{t.landing.heroStats.dataStored}</div>
            </div>
            <div className="hero-stat-divider" style={styles.heroStatDivider} />
            <div style={styles.heroStat}>
              <div style={styles.heroStatNumber}>{t.landing.heroStats.privacyFirstValue}</div>
              <div style={styles.heroStatLabel}>{t.landing.heroStats.privacyFirst}</div>
            </div>
          </div>
        </div>

        <div className="hero-image" style={styles.heroImage}>
          <div className="mockup-card" style={styles.mockupCard}>
            <div style={styles.mockupHeader}>
              <div style={styles.mockupDots}>
                <div style={{...styles.mockupDot, backgroundColor: '#FF5F56'}} />
                <div style={{...styles.mockupDot, backgroundColor: '#FFBD2E'}} />
                <div style={{...styles.mockupDot, backgroundColor: '#27C93F'}} />
              </div>
            </div>
            <div style={styles.mockupContent}>
              <div style={styles.mockupTitle}>{t.landing.mockup.title}</div>
              <div style={styles.mockupScoreContainer}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#2A2A2A" strokeWidth="8"/>
                  <circle
                    cx="60" cy="60" r="54"
                    fill="none"
                    stroke="#F7931A"
                    strokeWidth="8"
                    strokeDasharray="339.292"
                    strokeDashoffset="84.823"
                    strokeLinecap="round"
                    style={{transform: 'rotate(-90deg)', transformOrigin: '60px 60px'}}
                  />
                </svg>
                <div style={styles.mockupScore}>75</div>
              </div>
              <div style={styles.mockupRecommendations}>
                <div style={styles.mockupRecItem}>
                  <span style={styles.mockupRecIcon}>✓</span> {t.landing.mockup.rec1}
                </div>
                <div style={styles.mockupRecItem}>
                  <span style={{...styles.mockupRecIcon, backgroundColor: '#F7931A'}}>!</span> {t.landing.mockup.rec2}
                </div>
                <div style={styles.mockupRecItem}>
                  <span style={styles.mockupRecIcon}>✓</span> {t.landing.mockup.rec3}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PVU SECTION */}
      <section style={styles.pvuSection}>
        <div style={styles.pvuSectionGlow} />
        <div style={styles.pvuSectionGlow2} />
        <div style={styles.sectionContent}>
          <h2 className="section-title" style={styles.sectionTitle}>{t.landing.whyTitle}</h2>
          <p className="section-subtitle" style={styles.sectionSubtitle}>
            {t.landing.whySubtitle}
          </p>
          <div className="pvu-grid" style={styles.pvuGrid}>
            {/* Card 1 - Personalized Assessment */}
            <div className="pvu-card" style={styles.pvuCard}>
              <div style={{...styles.pvuCardVisual, ...styles.pvuCardVisualBg1}}>
                <div className="glow-element" style={{...styles.pvuCardGlow, ...styles.pvuCardGlow1}} />
                <div className="floating-element" style={{...styles.pvuFloatingElement, width: '40px', height: '30px', top: '15px', right: '25px', '--rotate': '10deg'}} />
                <div className="floating-element-slow" style={{...styles.pvuFloatingElement, width: '30px', height: '25px', bottom: '20px', left: '20px', '--rotate': '-5deg'}} />
                <div style={styles.pvuIconContainer}>
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <circle cx="18" cy="18" r="14" stroke="#F7931A" strokeWidth="2" fill="none" opacity="0.3"/>
                    <circle cx="18" cy="18" r="8" stroke="#F7931A" strokeWidth="2" fill="none"/>
                    <circle cx="18" cy="18" r="3" fill="#F7931A"/>
                    <line x1="18" y1="4" x2="18" y2="8" stroke="#F7931A" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="18" y1="28" x2="18" y2="32" stroke="#F7931A" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="4" y1="18" x2="8" y2="18" stroke="#F7931A" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="28" y1="18" x2="32" y2="18" stroke="#F7931A" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <div style={styles.pvuCardContent}>
                <h3 style={styles.pvuTitle}>{t.landing.whyCards.personalized.title}</h3>
                <p style={styles.pvuText}>{t.landing.whyCards.personalized.description}</p>
              </div>
            </div>

            {/* Card 2 - Zero Data Storage */}
            <div className="pvu-card" style={styles.pvuCard}>
              <div style={{...styles.pvuCardVisual, ...styles.pvuCardVisualBg2}}>
                <div className="glow-element" style={{...styles.pvuCardGlow, ...styles.pvuCardGlow2}} />
                <div className="floating-element-slow" style={{...styles.pvuFloatingElement, width: '35px', height: '35px', top: '18px', left: '22px', borderRadius: '50%'}} />
                <div className="floating-element" style={{...styles.pvuFloatingElement, width: '28px', height: '38px', bottom: '15px', right: '30px', '--rotate': '12deg'}} />
                <div style={styles.pvuIconContainer}>
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <rect x="8" y="10" width="20" height="18" rx="3" stroke="#3b82f6" strokeWidth="2" fill="none"/>
                    <path d="M14 10V7C14 5.34315 15.3431 4 17 4H19C20.6569 4 22 5.34315 22 7V10" stroke="#3b82f6" strokeWidth="2"/>
                    <circle cx="18" cy="19" r="3" stroke="#3b82f6" strokeWidth="2" fill="none"/>
                    <line x1="18" y1="22" x2="18" y2="25" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <div style={styles.pvuCardContent}>
                <h3 style={styles.pvuTitle}>{t.landing.whyCards.zeroData.title}</h3>
                <p style={styles.pvuText}>{t.landing.whyCards.zeroData.description}</p>
              </div>
            </div>

            {/* Card 3 - Education First */}
            <div className="pvu-card" style={styles.pvuCard}>
              <div style={{...styles.pvuCardVisual, ...styles.pvuCardVisualBg3}}>
                <div className="glow-element" style={{...styles.pvuCardGlow, ...styles.pvuCardGlow3}} />
                <div className="floating-element" style={{...styles.pvuFloatingElement, width: '38px', height: '28px', top: '20px', right: '20px', '--rotate': '-8deg'}} />
                <div className="floating-element-slow" style={{...styles.pvuFloatingElement, width: '32px', height: '32px', bottom: '18px', left: '25px', borderRadius: '8px'}} />
                <div style={styles.pvuIconContainer}>
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <path d="M6 10L18 4L30 10V14L18 20L6 14V10Z" stroke="#a855f7" strokeWidth="2" fill="none"/>
                    <path d="M6 18V24L18 30L30 24V18" stroke="#a855f7" strokeWidth="2" fill="none" opacity="0.5"/>
                    <circle cx="18" cy="12" r="2" fill="#a855f7"/>
                  </svg>
                </div>
              </div>
              <div style={styles.pvuCardContent}>
                <h3 style={styles.pvuTitle}>{t.landing.whyCards.education.title}</h3>
                <p style={styles.pvuText}>{t.landing.whyCards.education.description}</p>
              </div>
            </div>

            {/* Card 4 - No Wallet Pushing */}
            <div className="pvu-card" style={styles.pvuCard}>
              <div style={{...styles.pvuCardVisual, ...styles.pvuCardVisualBg4}}>
                <div className="glow-element" style={{...styles.pvuCardGlow, ...styles.pvuCardGlow4}} />
                <div className="floating-element-slow" style={{...styles.pvuFloatingElement, width: '36px', height: '26px', top: '16px', left: '28px', '--rotate': '6deg'}} />
                <div className="floating-element" style={{...styles.pvuFloatingElement, width: '30px', height: '30px', bottom: '22px', right: '24px', borderRadius: '50%'}} />
                <div style={styles.pvuIconContainer}>
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <circle cx="18" cy="18" r="12" stroke="#ef4444" strokeWidth="2" fill="none"/>
                    <line x1="10" y1="10" x2="26" y2="26" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M14 15H22V23C22 24.1046 21.1046 25 20 25H16C14.8954 25 14 24.1046 14 23V15Z" stroke="#ef4444" strokeWidth="1.5" fill="none" opacity="0.5"/>
                    <path d="M13 15L14.5 11H21.5L23 15" stroke="#ef4444" strokeWidth="1.5" fill="none" opacity="0.5"/>
                  </svg>
                </div>
              </div>
              <div style={styles.pvuCardContent}>
                <h3 style={styles.pvuTitle}>{t.landing.whyCards.noWallet.title}</h3>
                <p style={styles.pvuText}>{t.landing.whyCards.noWallet.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={styles.howSection}>
        <div style={styles.howSectionGlow} />
        <div style={styles.sectionContent}>
          <h2 className="section-title" style={styles.sectionTitle}>{t.landing.howTitle}</h2>
          <p className="section-subtitle" style={styles.sectionSubtitle}>{t.landing.howSubtitle}</p>
          <div className="steps-grid" style={styles.stepsContainer}>
            {/* Step 1 - Take Assessment */}
            <div className="step-card" style={styles.stepCard}>
              <div style={{...styles.stepVisual, ...styles.stepVisualBg1}}>
                <div className="glow-element" style={{...styles.stepVisualGlow, ...styles.stepVisualGlow1}} />
                <div className="floating-element" style={{...styles.stepFloatingElement, width: '60px', height: '40px', top: '20px', right: '30px', '--rotate': '12deg'}} />
                <div className="floating-element-slow" style={{...styles.stepFloatingElement, width: '40px', height: '30px', bottom: '30px', left: '20px', '--rotate': '-8deg'}} />
                <div style={styles.stepIconContainer}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <rect x="8" y="6" width="32" height="36" rx="4" stroke="#F7931A" strokeWidth="2.5" fill="none"/>
                    <line x1="14" y1="16" x2="34" y2="16" stroke="#F7931A" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="14" y1="24" x2="28" y2="24" stroke="#F7931A" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
                    <line x1="14" y1="32" x2="24" y2="32" stroke="#F7931A" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
                    <circle cx="32" cy="32" r="8" fill="#F7931A" opacity="0.2"/>
                    <path d="M29 32L31 34L35 30" stroke="#F7931A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div style={styles.stepContent}>
                <div style={styles.stepNumber}>{t.landing.howSteps.step1.number}</div>
                <h3 style={styles.stepTitle}>{t.landing.howSteps.step1.title}</h3>
                <p style={styles.stepText}>{t.landing.howSteps.step1.description}</p>
              </div>
            </div>

            {/* Step 2 - Get Score */}
            <div className="step-card" style={styles.stepCard}>
              <div style={{...styles.stepVisual, ...styles.stepVisualBg2}}>
                <div className="glow-element" style={{...styles.stepVisualGlow, ...styles.stepVisualGlow2}} />
                <div className="floating-element-slow" style={{...styles.stepFloatingElement, width: '50px', height: '50px', top: '25px', left: '25px', borderRadius: '50%'}} />
                <div className="floating-element" style={{...styles.stepFloatingElement, width: '30px', height: '45px', bottom: '25px', right: '35px', '--rotate': '15deg'}} />
                <div style={styles.stepIconContainer}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="18" stroke="#22c55e" strokeWidth="2.5" fill="none" opacity="0.3"/>
                    <path d="M24 6 A18 18 0 0 1 42 24" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" fill="none"/>
                    <circle cx="24" cy="24" r="10" stroke="#22c55e" strokeWidth="2" fill="none" opacity="0.5"/>
                    <text x="24" y="28" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="800">85</text>
                  </svg>
                </div>
              </div>
              <div style={styles.stepContent}>
                <div style={styles.stepNumber}>{t.landing.howSteps.step2.number}</div>
                <h3 style={styles.stepTitle}>{t.landing.howSteps.step2.title}</h3>
                <p style={styles.stepText}>{t.landing.howSteps.step2.description}</p>
              </div>
            </div>

            {/* Step 3 - Follow Plan */}
            <div className="step-card" style={styles.stepCard}>
              <div style={{...styles.stepVisual, ...styles.stepVisualBg3}}>
                <div className="glow-element" style={{...styles.stepVisualGlow, ...styles.stepVisualGlow3}} />
                <div className="floating-element" style={{...styles.stepFloatingElement, width: '45px', height: '35px', top: '30px', right: '25px', '--rotate': '-10deg'}} />
                <div className="floating-element-slow" style={{...styles.stepFloatingElement, width: '35px', height: '35px', bottom: '20px', left: '30px', borderRadius: '50%'}} />
                <div style={styles.stepIconContainer}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M12 12L24 6L36 12V28L24 42L12 28V12Z" stroke="#3b82f6" strokeWidth="2.5" fill="none"/>
                    <path d="M18 20L22 24L30 16" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="24" cy="30" r="4" fill="#3b82f6" opacity="0.3"/>
                    <path d="M24 28V32M22 30H26" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <div style={styles.stepContent}>
                <div style={styles.stepNumber}>{t.landing.howSteps.step3.number}</div>
                <h3 style={styles.stepTitle}>{t.landing.howSteps.step3.title}</h3>
                <p style={styles.stepText}>{t.landing.howSteps.step3.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

{/* PRICING SECTION */}
<section style={styles.pricingSection}>
  <div style={styles.pricingSectionGlow} />
  <div style={styles.sectionContent}>
    <h2 className="section-title" style={styles.sectionTitle}>{t.landing.pricingTitle}</h2>
    <p className="section-subtitle" style={styles.sectionSubtitle}>{t.landing.pricingSubtitle}</p>

    {/* Pricing grid - responsive for desktop and mobile */}
    <div
      className="pricing-grid-horizontal"
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '16px',
        maxWidth: '1200px',
        margin: '48px auto 0',
        padding: '0 24px 20px',
        overflowX: 'auto',
        overflowY: 'hidden',
        WebkitOverflowScrolling: 'touch',
        scrollSnapType: 'x mandatory',
        scrollbarWidth: 'thin',
        scrollbarColor: '#F7931A #1a1a1a',
        justifyContent: 'center'
      }}
    >
      {/* Free */}
      <div className="pricing-card" style={{...styles.pricingCard, minWidth: '240px', maxWidth: '280px', flex: '1 1 240px', scrollSnapAlign: 'start'}}>
        <div style={{...styles.pricingCardHeader, ...styles.pricingCardHeaderBg}}>
          <div className="glow-element" style={{...styles.pricingCardGlow, ...styles.pricingCardGlowFree, top: '-10%'}} />
          <div style={styles.pricingBadge}>{t.landing.plans.free.badge}</div>
          <h3 style={styles.pricingTitle}>{t.landing.plans.free.name}</h3>
          <div style={{...styles.pricingPrice, fontSize: '44px'}}>
            {t.landing.plans.free.price}
            <span style={{...styles.pricingPeriod, fontSize: '15px'}}>{t.landing.plans.free.period}</span>
          </div>
        </div>
        <div style={styles.pricingCardBody}>
          <ul style={styles.pricingFeatures}>
            {t.landing.plans.free.features.map((feature, idx) => (
              <li key={idx} style={styles.pricingFeature}>
                <span style={styles.pricingFeatureIcon}>✓</span>
                {feature}
              </li>
            ))}
          </ul>
          <button onClick={onSignup} style={styles.pricingButton}>
            {t.landing.plans.free.cta}
          </button>
        </div>
      </div>

      {/* Essential - destacada */}
      <div
        className="pricing-card-featured"
        style={{
          ...styles.pricingCard,
          ...styles.pricingCardFeatured,
          minWidth: '260px',
          maxWidth: '300px',
          flex: '1 1 260px',
          scrollSnapAlign: 'start',
          transform: 'scale(1.03)',
          zIndex: 2,
          boxShadow: '0 20px 50px rgba(247,147,26,0.35)'
        }}
      >
        <div style={{...styles.pricingCardHeader, ...styles.pricingCardHeaderBgFeatured, minHeight: '200px'}}>
          <div className="glow-element" style={{
            ...styles.pricingCardGlow,
            ...styles.pricingCardGlowFeatured,
            top: '-20%',
            right: '10%',
            width: '200px',
            height: '200px'
          }} />
          <div style={styles.pricingBadge}>{t.landing.plans.essential.badge}</div>
          <h3 style={styles.pricingTitle}>{t.landing.plans.essential.name}</h3>
          <div style={{...styles.pricingPrice, ...styles.pricingPriceFeatured, fontSize: '52px'}}>
            {t.landing.plans.essential.price}
            <span style={{...styles.pricingPeriod, fontSize: '16px'}}>{t.landing.plans.essential.period}</span>
          </div>
        </div>
        <div style={{...styles.pricingCardBody, padding: '28px'}}>
          <ul style={styles.pricingFeatures}>
            {t.landing.plans.essential.features.map((feature, idx) => (
              <li key={idx} style={styles.pricingFeature}>
                <span style={styles.pricingFeatureIcon}>✓</span>
                {feature}
              </li>
            ))}
          </ul>
          <button onClick={onSignup} style={{...styles.pricingButtonFeatured, padding: '16px 32px', fontSize: '16px'}}>
            {t.landing.plans.essential.cta.split(' ($')[0] || t.landing.plans.essential.cta}
          </button>
        </div>
      </div>

      {/* Sentinel - with green border like Consultation has purple */}
      <div className="pricing-card" style={{...styles.pricingCard, minWidth: '240px', maxWidth: '280px', flex: '1 1 240px', scrollSnapAlign: 'start', border: '2px solid #22c55e'}}>
        <div style={{
          ...styles.pricingCardHeader,
          background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(59,130,246,0.12) 100%)',
        }}>
          <div className="glow-element" style={{
            ...styles.pricingCardGlow,
            backgroundColor: 'rgba(34,197,94,0.5)',
            top: '-10%',
            right: '20%',
            width: '180px',
            height: '180px'
          }} />
          <div style={styles.pricingBadge}>{t.landing.plans.sentinel.badge}</div>
          <h3 style={{ ...styles.pricingTitle, color: '#22c55e' }}>
            {t.landing.plans.sentinel.name}
          </h3>
          <div style={{ ...styles.pricingPrice, color: '#a5f3fc', fontSize: '44px' }}>
            {t.landing.plans.sentinel.price}
            <span style={{...styles.pricingPeriod, fontSize: '15px'}}>{t.landing.plans.sentinel.period}</span>
          </div>
        </div>
        <div style={styles.pricingCardBody}>
          <ul style={styles.pricingFeatures}>
            {t.landing.plans.sentinel.features.map((feature, idx) => (
              <li key={idx} style={styles.pricingFeature}>
                <span style={{ 
                  ...styles.pricingFeatureIcon, 
                  backgroundColor: 'rgba(34,197,94,0.2)', 
                  color: '#22c55e' 
                }}>✓</span>
                {feature}
              </li>
            ))}
          </ul>
          <button 
            onClick={onSignup} 
            style={{
              ...styles.pricingButton,
              backgroundColor: '#22c55e',
              color: '#000',
              boxShadow: '0 8px 24px rgba(34,197,94,0.3)'
            }}
          >
            {t.landing.plans.sentinel.cta}
          </button>
        </div>
      </div>

      {/* Consultation */}
      <div className="pricing-card" style={{...styles.pricingCard, ...styles.pricingCardPro, minWidth: '240px', maxWidth: '280px', flex: '1 1 240px', scrollSnapAlign: 'start'}}>
        <div style={{...styles.pricingCardHeader, ...styles.pricingCardHeaderBgPro}}>
          <div className="glow-element" style={{...styles.pricingCardGlow, ...styles.pricingCardGlowPro, top: '-10%'}} />
          <div style={{...styles.pricingBadge, ...styles.pricingBadgePro}}>
            {t.landing.plans.consultation.badge}
          </div>
          <h3 style={styles.pricingTitle}>{t.landing.plans.consultation.name}</h3>
          <div style={{...styles.pricingPrice, ...styles.pricingPricePro, fontSize: '44px'}}>
            {t.landing.plans.consultation.price}
            <span style={{...styles.pricingPeriod, fontSize: '15px'}}>{t.landing.plans.consultation.period}</span>
          </div>
        </div>
        <div style={styles.pricingCardBody}>
          <ul style={styles.pricingFeatures}>
            {t.landing.plans.consultation.features.map((feature, idx) => (
              <li key={idx} style={styles.pricingFeature}>
                <span style={styles.pricingFeatureIcon}>✓</span>
                {feature}
              </li>
            ))}
          </ul>
          <button onClick={onSignup} style={styles.pricingButtonPro}>
            {t.landing.plans.consultation.cta}
          </button>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default LandingPage;