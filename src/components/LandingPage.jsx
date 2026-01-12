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
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>What Makes Kyward Different?</h2>
          <p style={styles.sectionSubtitle}>
            We're not trying to sell you a wallet. We're here to educate you on securing what's already yours.
          </p>
          <div style={styles.pvuGrid}>
            <div style={styles.pvuCard}>
              <div style={styles.pvuIcon}>🎯</div>
              <h3 style={styles.pvuTitle}>Personalized Assessment</h3>
              <p style={styles.pvuText}>
                Answer 10-15 questions about your current setup. Get a custom security score and actionable recommendations tailored to YOUR situation.
              </p>
            </div>
            <div style={styles.pvuCard}>
              <div style={styles.pvuIcon}>🔒</div>
              <h3 style={styles.pvuTitle}>Zero Data Storage</h3>
              <p style={styles.pvuText}>
                Your answers never leave your device. We don't store, track, or sell your data. Ever.
              </p>
            </div>
            <div style={styles.pvuCard}>
              <div style={styles.pvuIcon}>📚</div>
              <h3 style={styles.pvuTitle}>Education First</h3>
              <p style={styles.pvuText}>
                Learn WHY each recommendation matters. Understand the trade-offs. Make informed decisions.
              </p>
            </div>
            <div style={styles.pvuCard}>
              <div style={styles.pvuIcon}>🚫</div>
              <h3 style={styles.pvuTitle}>No Wallet Pushing</h3>
              <p style={styles.pvuText}>
                We're not affiliated with any wallet provider. Our recommendations are based purely on security best practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={styles.howSection}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <p style={styles.sectionSubtitle}>Three simple steps to better security</p>
          <div style={styles.stepsContainer}>
            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>01</div>
              <h3 style={styles.stepTitle}>Take the Assessment</h3>
              <p style={styles.stepText}>Answer questions about your storage method and habits. Takes 5 minutes.</p>
              <div style={styles.stepImagePlaceholder}><span style={styles.stepImageIcon}>📝</span></div>
            </div>
            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>02</div>
              <h3 style={styles.stepTitle}>Get Your Score</h3>
              <p style={styles.stepText}>Receive a personalized security score (0-100) with a detailed breakdown.</p>
              <div style={styles.stepImagePlaceholder}><span style={styles.stepImageIcon}>📊</span></div>
            </div>
            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>03</div>
              <h3 style={styles.stepTitle}>Follow the Plan</h3>
              <p style={styles.stepText}>Get a step-by-step action plan with prioritized recommendations.</p>
              <div style={styles.stepImagePlaceholder}><span style={styles.stepImageIcon}>🎯</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={styles.pricingSection}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Simple, Honest Pricing</h2>
          <div style={styles.pricingGrid}>
            <div style={styles.pricingCard}>
              <div style={styles.pricingBadge}>FREE FOREVER</div>
              <h3 style={styles.pricingTitle}>Free Plan</h3>
              <div style={styles.pricingPrice}>$0<span style={styles.pricingPeriod}>/forever</span></div>
              <ul style={styles.pricingFeatures}>
                <li style={styles.pricingFeature}>✓ 1 assessment per month</li>
                <li style={styles.pricingFeature}>✓ Basic security score</li>
                <li style={styles.pricingFeature}>✓ Simple recommendations</li>
              </ul>
              <button onClick={onSignup} style={styles.pricingButton}>Start Free</button>
            </div>
            <div style={{...styles.pricingCard, ...styles.pricingCardFeatured}}>
              <div style={{...styles.pricingBadge, backgroundColor: '#F7931A', color: '#000'}}>MOST POPULAR</div>
              <h3 style={styles.pricingTitle}>Premium</h3>
              <div style={styles.pricingPrice}>$4.99<span style={styles.pricingPeriod}>/month</span></div>
              <ul style={styles.pricingFeatures}>
                <li style={styles.pricingFeature}>✓ Unlimited assessments</li>
                <li style={styles.pricingFeature}>✓ Advanced security analysis</li>
                <li style={styles.pricingFeature}>✓ Historical tracking</li>
              </ul>
              <button onClick={onSignup} style={styles.pricingButtonFeatured}>Get Premium</button>
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