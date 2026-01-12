import React from 'react';
import { styles } from '../styles/Theme';

const LandingPage = ({ onLogin, onSignup }) => {
  return (
    <div style={styles.landingContainer}>
      {/* NAVIGATION */}
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <div style={styles.navLogo}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" fill="#F7931A" opacity="0.2"/>
              <path d="M20 8L28 13V27L20 32L12 27V13L20 8Z" stroke="#F7931A" strokeWidth="2.5" strokeLinejoin="round"/>
              <circle cx="20" cy="20" r="4" fill="#F7931A"/>
            </svg>
            <span style={styles.navLogoText}>Kyward</span>
          </div>
          <div style={styles.navButtons}>
            <button onClick={onLogin} style={styles.navButtonLogin}>Login</button>
            <button onClick={onSignup} style={styles.navButtonSignup}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={styles.hero}>
        <div style={styles.heroBackground}>
          <div style={{...styles.orangeGlow, top: '10%', left: '10%'}} />
          <div style={{...styles.orangeGlow, bottom: '20%', right: '15%', animationDelay: '1s'}} />
        </div>
        
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>₿ITCOIN SECURITY MADE SIMPLE</div>
          <h1 style={styles.heroTitle}>
            Stop Guessing.<br />
            <span style={styles.heroTitleAccent}>Secure Your Sats</span><br />
            The Right Way.
          </h1>
          <p style={styles.heroSubtitle}>
            A questionnaire-based assessment that shows you exactly how to protect your private keys. 
            No BS. No wallet recommendations. Just honest security advice from fellow Bitcoiners.
          </p>
          <div style={styles.heroButtons}>
            <button onClick={onSignup} style={styles.heroCTA}>
              Start Free Assessment
              <span style={styles.heroCtaArrow}>→</span>
            </button>
            <button onClick={() => {
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }} style={styles.heroSecondary}>
              See How It Works
            </button>
          </div>
          <div style={styles.heroStats}>
            <div style={styles.heroStat}>
              <div style={styles.heroStatNumber}>100%</div>
              <div style={styles.heroStatLabel}>Non-Custodial</div>
            </div>
            <div style={styles.heroStatDivider} />
            <div style={styles.heroStat}>
              <div style={styles.heroStatNumber}>0</div>
              <div style={styles.heroStatLabel}>Data Stored</div>
            </div>
            <div style={styles.heroStatDivider} />
            <div style={styles.heroStat}>
              <div style={styles.heroStatNumber}>∞</div>
              <div style={styles.heroStatLabel}>Privacy First</div>
            </div>
          </div>
        </div>

        <div style={styles.heroImage}>
          <div style={styles.mockupCard}>
            <div style={styles.mockupHeader}>
              <div style={styles.mockupDots}>
                <div style={{...styles.mockupDot, backgroundColor: '#FF5F56'}} />
                <div style={{...styles.mockupDot, backgroundColor: '#FFBD2E'}} />
                <div style={{...styles.mockupDot, backgroundColor: '#27C93F'}} />
              </div>
            </div>
            <div style={styles.mockupContent}>
              <div style={styles.mockupTitle}>Your Security Score</div>
              <div style={styles.mockupScoreContainer}>
                <svg width="x" height="120" viewBox="0 0 120 120">
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
                  <span style={styles.mockupRecIcon}>✓</span> Hardware wallet detected
                </div>
                <div style={styles.mockupRecItem}>
                  <span style={{...styles.mockupRecIcon, backgroundColor: '#F7931A'}}>!</span> Consider multi-sig setup
                </div>
                <div style={styles.mockupRecItem}>
                  <span style={styles.mockupRecIcon}>✓</span> Backup strategy solid
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
          <h2 style={styles.sectionTitle}>What Makes Kyward Different?</h2>
          <p style={styles.sectionSubtitle}>
            We're not trying to sell you a wallet. We're here to educate you on securing what's already yours.
          </p>
          <div style={styles.pvuGrid}>
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
                <h3 style={styles.pvuTitle}>Personalized Assessment</h3>
                <p style={styles.pvuText}>Answer 10-15 questions about your current setup. Get a custom security score and actionable recommendations tailored to YOUR situation.</p>
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
                <h3 style={styles.pvuTitle}>Zero Data Storage</h3>
                <p style={styles.pvuText}>Your answers never leave your device. We don't store, track, or sell your data. Ever.</p>
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
                <h3 style={styles.pvuTitle}>Education First</h3>
                <p style={styles.pvuText}>Learn WHY each recommendation matters. Understand the trade-offs. Make informed decisions.</p>
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
                <h3 style={styles.pvuTitle}>No Wallet Pushing</h3>
                <p style={styles.pvuText}>We're not affiliated with any wallet provider. Our recommendations are based purely on security best practices.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={styles.howSection}>
        <div style={styles.howSectionGlow} />
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <p style={styles.sectionSubtitle}>Three simple steps to better security</p>
          <div style={styles.stepsContainer}>
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
                <div style={styles.stepNumber}>01</div>
                <h3 style={styles.stepTitle}>Take the Assessment</h3>
                <p style={styles.stepText}>Answer questions about your current Bitcoin storage methods and security habits. Takes just 5 minutes.</p>
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
                <div style={styles.stepNumber}>02</div>
                <h3 style={styles.stepTitle}>Get Your Score</h3>
                <p style={styles.stepText}>Receive a personalized security score from 0-100 with a detailed breakdown of your strengths and weaknesses.</p>
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
                <div style={styles.stepNumber}>03</div>
                <h3 style={styles.stepTitle}>Follow the Plan</h3>
                <p style={styles.stepText}>Get a step-by-step action plan with prioritized recommendations tailored to your security level.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={styles.pricingSection}>
        <div style={styles.pricingSectionGlow} />
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Simple, Honest Pricing</h2>
          <p style={styles.sectionSubtitle}>No hidden fees. No surprises. Just honest pricing for honest security.</p>
          <div style={styles.pricingGrid}>
            {/* Free Plan */}
            <div className="pricing-card" style={styles.pricingCard}>
              <div style={{...styles.pricingCardHeader, ...styles.pricingCardHeaderBg}}>
                <div className="glow-element" style={{...styles.pricingCardGlow, ...styles.pricingCardGlowFree}} />
                <div className="floating-element-slow" style={{...styles.pricingFloatingElement, width: '50px', height: '35px', top: '20px', right: '30px', '--rotate': '8deg'}} />
                <div className="floating-element" style={{...styles.pricingFloatingElement, width: '35px', height: '35px', bottom: '10px', left: '25px', borderRadius: '50%'}} />
                <div style={styles.pricingBadge}>FREE FOREVER</div>
                <h3 style={styles.pricingTitle}>Free Plan</h3>
                <div style={styles.pricingPrice}>$0<span style={styles.pricingPeriod}>/forever</span></div>
              </div>
              <div style={styles.pricingCardBody}>
                <ul style={styles.pricingFeatures}>
                  <li style={styles.pricingFeature}>
                    <span style={styles.pricingFeatureIcon}>✓</span>
                    1 assessment per month
                  </li>
                  <li style={styles.pricingFeature}>
                    <span style={styles.pricingFeatureIcon}>✓</span>
                    Basic security score
                  </li>
                  <li style={styles.pricingFeature}>
                    <span style={styles.pricingFeatureIcon}>✓</span>
                    Simple recommendations
                  </li>
                </ul>
                <button onClick={onSignup} style={styles.pricingButton}>Start Free</button>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="pricing-card-featured" style={{...styles.pricingCard, ...styles.pricingCardFeatured}}>
              <div style={{...styles.pricingCardHeader, ...styles.pricingCardHeaderBgFeatured}}>
                <div className="glow-element" style={{...styles.pricingCardGlow, ...styles.pricingCardGlowFeatured}} />
                <div className="floating-element" style={{...styles.pricingFloatingElement, width: '55px', height: '40px', top: '15px', right: '25px', '--rotate': '-10deg'}} />
                <div className="floating-element-slow" style={{...styles.pricingFloatingElement, width: '40px', height: '40px', bottom: '15px', left: '20px', borderRadius: '50%'}} />
                <div style={{...styles.pricingBadge, ...styles.pricingBadgeFeatured}}>MOST POPULAR</div>
                <h3 style={styles.pricingTitle}>Premium</h3>
                <div style={{...styles.pricingPrice, ...styles.pricingPriceFeatured}}>$4.99<span style={styles.pricingPeriod}>/month</span></div>
              </div>
              <div style={styles.pricingCardBody}>
                <ul style={styles.pricingFeatures}>
                  <li style={styles.pricingFeature}>
                    <span style={styles.pricingFeatureIcon}>✓</span>
                    Unlimited assessments
                  </li>
                  <li style={styles.pricingFeature}>
                    <span style={styles.pricingFeatureIcon}>✓</span>
                    Advanced security analysis
                  </li>
                  <li style={styles.pricingFeature}>
                    <span style={styles.pricingFeatureIcon}>✓</span>
                    Historical tracking
                  </li>
                  <li style={styles.pricingFeature}>
                    <span style={styles.pricingFeatureIcon}>✓</span>
                    Priority support
                  </li>
                </ul>
                <button onClick={onSignup} style={styles.pricingButtonFeatured}>Get Premium</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLeft}>
            <div style={styles.footerLogo}>
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" fill="#F7931A" opacity="0.2"/>
                <path d="M20 8L28 13V27L20 32L12 27V13L20 8Z" stroke="#F7931A" strokeWidth="2.5" strokeLinejoin="round"/>
              </svg>
              <span style={styles.footerLogoText}>Kyward</span>
            </div>
            <p style={styles.footerTagline}>Empowering Bitcoiners with honest security advice.</p>
          </div>
          <p style={styles.footerCopyright}>© 2025 Kyward. Built by Bitcoiners.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;