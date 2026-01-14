// KYWARD - THEME & STYLES SYSTEM

export const styles = {
  landingContainer: { backgroundColor: '#000', color: '#E5E5E5', minHeight: '100vh', fontFamily: '"Space Grotesk", sans-serif' },
  nav: { position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #1a1a1a', zIndex: 1000, padding: '16px 0' },
  navContent: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  navLogo: { display: 'flex', alignItems: 'center', gap: '12px' },
  navLogoText: { fontSize: '24px', fontWeight: '700', color: '#F7931A' },
  navButtons: { display: 'flex', gap: '12px' },
  navButtonLogin: { padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid #3a3a3a', color: '#E5E5E5', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s' },
  navButtonSignup: { padding: '10px 24px', backgroundColor: '#F7931A', border: 'none', color: '#000', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s' },
  hero: { paddingTop: '140px', paddingBottom: '100px', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '60px', position: 'relative', overflow: 'hidden', maxWidth: '1400px', margin: '0 auto', padding: '140px 24px 100px' },
  heroBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' },
  orangeGlow: { position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(247,147,26,0.15) 0%, transparent 70%)', animation: 'pulse 4s ease-in-out infinite' },
  heroContent: { flex: '1', maxWidth: '600px', padding: '0 24px', position: 'relative', zIndex: 1 },
  heroBadge: { display: 'inline-block', padding: '8px 16px', backgroundColor: 'rgba(247,147,26,0.1)', border: '1px solid #F7931A', borderRadius: '20px', fontSize: '12px', fontWeight: '700', color: '#F7931A', marginBottom: '24px' },
  heroTitle: { fontSize: '72px', fontWeight: '800', color: '#fff', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-2px' },
  heroTitleAccent: { color: '#F7931A' },
  heroSubtitle: { fontSize: '20px', color: '#9ca3af', lineHeight: '1.6', marginBottom: '40px' },
  heroButtons: { display: 'flex', gap: '16px', marginBottom: '60px' },
  heroCTA: { padding: '18px 36px', backgroundColor: '#F7931A', border: 'none', color: '#000', borderRadius: '12px', fontSize: '18px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '12px' },
  heroCtaArrow: { fontSize: '20px' },
  heroSecondary: { padding: '18px 36px', backgroundColor: 'transparent', border: '2px solid #3a3a3a', color: '#E5E5E5', borderRadius: '12px', fontSize: '18px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s' },
  heroStats: { display: 'flex', gap: '40px', alignItems: 'center' },
  heroStat: { textAlign: 'center' },
  heroStatNumber: { fontSize: '36px', fontWeight: '800', color: '#F7931A', marginBottom: '4px' },
  heroStatLabel: { fontSize: '13px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' },
  heroStatDivider: { width: '1px', height: '40px', backgroundColor: '#2a2a2a' },
  heroImage: { flex: '0 0 auto', marginRight: '80px', zIndex: 1 },
  mockupCard: { width: '380px', backgroundColor: '#1a1a1a', borderRadius: '16px', border: '1px solid #2a2a2a', overflow: 'hidden', boxShadow: '0 20px 60px rgba(247,147,26,0.2)' },
  mockupHeader: { padding: '16px', borderBottom: '1px solid #2a2a2a' },
  mockupDots: { display: 'flex', gap: '8px' },
  mockupDot: { width: '12px', height: '12px', borderRadius: '50%' },
  mockupContent: { padding: '32px' },
  mockupTitle: { fontSize: '14px', color: '#6b7280', marginBottom: '24px', textTransform: 'uppercase', fontWeight: '600' },
  mockupScoreContainer: { position: 'relative', width: '120px', height: '120px', margin: '0 auto 32px' },
  mockupScore: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '42px', fontWeight: '800', color: '#F7931A' },
  mockupRecommendations: { display: 'flex', flexDirection: 'column', gap: '12px' },
  mockupRecItem: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#9ca3af' },
  mockupRecIcon: { width: '24px', height: '24px', borderRadius: '6px', backgroundColor: '#22c55e', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700' },
  pvuSection: { padding: '100px 0', backgroundColor: '#0a0a0a', position: 'relative', overflow: 'hidden' },
  pvuSectionGlow: { position: 'absolute', top: '30%', left: '20%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(247,147,26,0.06) 0%, transparent 70%)', pointerEvents: 'none' },
  pvuSectionGlow2: { position: 'absolute', bottom: '20%', right: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)', pointerEvents: 'none' },
  sectionContent: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 },
  sectionTitle: { fontSize: '48px', fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: '16px' },
  sectionSubtitle: { fontSize: '18px', color: '#6b7280', textAlign: 'center', maxWidth: '600px', margin: '0 auto 50px' },
  pvuGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', position: 'relative' },
  pvuCard: { background: 'linear-gradient(180deg, #1a1a1a 0%, #111111 100%)', border: '1px solid #2a2a2a', borderRadius: '20px', padding: '0', overflow: 'hidden', transition: 'all 0.4s ease', position: 'relative' },
  pvuCardVisual: { position: 'relative', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  pvuCardVisualBg1: { background: 'linear-gradient(135deg, rgba(247,147,26,0.12) 0%, rgba(247,147,26,0.02) 100%)' },
  pvuCardVisualBg2: { background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.02) 100%)' },
  pvuCardVisualBg3: { background: 'linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(168,85,247,0.02) 100%)' },
  pvuCardVisualBg4: { background: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(239,68,68,0.02) 100%)' },
  pvuCardGlow: { position: 'absolute', width: '100px', height: '100px', borderRadius: '50%', filter: 'blur(30px)', opacity: '0.5' },
  pvuCardGlow1: { backgroundColor: 'rgba(247,147,26,0.5)', top: '20%', left: '30%' },
  pvuCardGlow2: { backgroundColor: 'rgba(59,130,246,0.5)', top: '25%', left: '35%' },
  pvuCardGlow3: { backgroundColor: 'rgba(168,85,247,0.5)', top: '20%', left: '40%' },
  pvuCardGlow4: { backgroundColor: 'rgba(239,68,68,0.5)', top: '25%', left: '30%' },
  pvuIconContainer: { position: 'relative', zIndex: 2, width: '70px', height: '70px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' },
  pvuCardContent: { padding: '24px 28px 32px' },
  pvuIcon: { fontSize: '32px' },
  pvuTitle: { fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '12px' },
  pvuText: { fontSize: '15px', color: '#9ca3af', lineHeight: '1.7' },
  pvuFloatingElement: { position: 'absolute', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' },
  howSection: { padding: '100px 0', backgroundColor: '#000', position: 'relative', overflow: 'hidden' },
  howSectionGlow: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(247,147,26,0.08) 0%, transparent 70%)', pointerEvents: 'none' },
  stepsContainer: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', position: 'relative' },
  stepCard: { background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)', border: '1px solid #2a2a2a', borderRadius: '20px', padding: '0', overflow: 'hidden', position: 'relative', transition: 'all 0.4s ease' },
  stepVisual: { position: 'relative', height: '200px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  stepVisualBg1: { background: 'linear-gradient(135deg, rgba(247,147,26,0.15) 0%, rgba(247,147,26,0.02) 100%)' },
  stepVisualBg2: { background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.02) 100%)' },
  stepVisualBg3: { background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.02) 100%)' },
  stepVisualGlow: { position: 'absolute', width: '150px', height: '150px', borderRadius: '50%', filter: 'blur(40px)', opacity: '0.6' },
  stepVisualGlow1: { backgroundColor: 'rgba(247,147,26,0.4)', top: '20%', left: '30%' },
  stepVisualGlow2: { backgroundColor: 'rgba(34,197,94,0.4)', top: '30%', left: '40%' },
  stepVisualGlow3: { backgroundColor: 'rgba(59,130,246,0.4)', top: '25%', left: '35%' },
  stepIconContainer: { position: 'relative', zIndex: 2, width: '100px', height: '100px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' },
  stepFloatingElement: { position: 'absolute', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' },
  stepContent: { padding: '28px 28px 32px' },
  stepNumber: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '10px', backgroundColor: 'rgba(247,147,26,0.15)', border: '1px solid rgba(247,147,26,0.3)', fontSize: '14px', fontWeight: '800', color: '#F7931A', marginBottom: '16px' },
  stepTitle: { fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '12px' },
  stepText: { fontSize: '15px', color: '#9ca3af', lineHeight: '1.7' },
  benefitsSection: { padding: '80px 0', backgroundColor: '#0a0a0a' },
  benefitsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' },
  benefitsLeft: {},
  benefitsTitle: { fontSize: '52px', fontWeight: '800', color: '#fff', marginBottom: '24px', lineHeight: '1.1' },
  benefitsText: { fontSize: '18px', color: '#9ca3af', lineHeight: '1.6', marginBottom: '32px' },
  benefitsCTA: { padding: '16px 32px', backgroundColor: '#F7931A', border: 'none', color: '#000', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' },
  benefitsRight: { display: 'flex', flexDirection: 'column', gap: '24px' },
  benefitItem: { display: 'flex', gap: '20px', alignItems: 'flex-start', padding: '24px', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px' },
  benefitIcon: { fontSize: '32px' },
  benefitItemTitle: { fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '6px' },
  benefitItemText: { fontSize: '14px', color: '#9ca3af' },
  pricingSection: { padding: '100px 0', backgroundColor: '#000', position: 'relative', overflow: 'hidden' },
  pricingSectionGlow: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '900px', height: '900px', background: 'radial-gradient(circle, rgba(247,147,26,0.06) 0%, transparent 70%)', pointerEvents: 'none' },
  pricingGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '1100px', margin: '0 auto', position: 'relative' },
  pricingCard: { background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)', border: '1px solid #2a2a2a', borderRadius: '24px', padding: '0', overflow: 'hidden', position: 'relative', transition: 'all 0.4s ease' },
  pricingCardFeatured: { border: '2px solid #F7931A', transform: 'scale(1.02)' },
  pricingCardHeader: { position: 'relative', padding: '32px 32px 24px', overflow: 'hidden' },
  pricingCardHeaderBg: { background: 'linear-gradient(135deg, rgba(107,114,128,0.1) 0%, rgba(107,114,128,0.02) 100%)' },
  pricingCardHeaderBgFeatured: { background: 'linear-gradient(135deg, rgba(247,147,26,0.15) 0%, rgba(247,147,26,0.02) 100%)' },
  pricingCardGlow: { position: 'absolute', width: '150px', height: '150px', borderRadius: '50%', filter: 'blur(50px)', opacity: '0.4', top: '0', right: '20%' },
  pricingCardGlowFree: { backgroundColor: 'rgba(107,114,128,0.4)' },
  pricingCardGlowFeatured: { backgroundColor: 'rgba(247,147,26,0.5)' },
  pricingCardGlowPro: { backgroundColor: 'rgba(168,85,247,0.5)' },
  pricingCardHeaderBgPro: { background: 'linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(168,85,247,0.02) 100%)' },
  pricingBadgePro: { backgroundColor: 'rgba(168,85,247,0.2)', color: '#a855f7' },
  pricingPricePro: { color: '#a855f7' },
  pricingButtonPro: { width: '100%', padding: '16px', backgroundColor: '#a855f7', border: 'none', color: '#fff', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 8px 24px rgba(168,85,247,0.3)' },
  pricingCardPro: { border: '2px solid #a855f7' },
  pricingFloatingElement: { position: 'absolute', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' },
  pricingBadge: { display: 'inline-block', padding: '8px 14px', backgroundColor: 'rgba(107,114,128,0.2)', color: '#9ca3af', borderRadius: '8px', fontSize: '11px', fontWeight: '700', marginBottom: '16px', letterSpacing: '0.5px' },
  pricingBadgeFeatured: { backgroundColor: '#F7931A', color: '#000' },
  pricingTitle: { fontSize: '28px', fontWeight: '700', color: '#fff', marginBottom: '8px' },
  pricingPrice: { fontSize: '56px', fontWeight: '800', color: '#fff', marginBottom: '0', lineHeight: '1' },
  pricingPriceFeatured: { color: '#F7931A' },
  pricingPeriod: { fontSize: '16px', fontWeight: '600', color: '#6b7280', marginLeft: '4px' },
  pricingCardBody: { padding: '24px 32px 32px' },
  pricingFeatures: { listStyle: 'none', padding: 0, margin: '0 0 28px 0' },
  pricingFeature: { fontSize: '15px', color: '#9ca3af', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '12px' },
  pricingFeatureIcon: { width: '22px', height: '22px', borderRadius: '6px', backgroundColor: 'rgba(34,197,94,0.15)', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0 },
  pricingButton: { width: '100%', padding: '16px', backgroundColor: 'transparent', border: '2px solid #3a3a3a', color: '#E5E5E5', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s' },
  pricingButtonFeatured: { width: '100%', padding: '16px', backgroundColor: '#F7931A', border: 'none', color: '#000', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 8px 24px rgba(247,147,26,0.3)' },
  footerCTA: { padding: '60px 24px', textAlign: 'center', backgroundColor: '#0a0a0a' },
  footerCTATitle: { fontSize: '48px', fontWeight: '800', color: '#fff', marginBottom: '16px' },
  footerCTAText: { fontSize: '20px', color: '#6b7280', marginBottom: '40px' },
  footerCTAButton: { padding: '18px 48px', backgroundColor: '#F7931A', border: 'none', color: '#000', borderRadius: '12px', fontSize: '18px', fontWeight: '700', cursor: 'pointer' },
  footer: { padding: '40px 24px', backgroundColor: '#000', borderTop: '1px solid #1a1a1a' },
  footerContent: { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  footerLeft: {},
  footerLogo: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
  footerLogoText: { fontSize: '20px', fontWeight: '700', color: '#F7931A' },
  footerTagline: { fontSize: '14px', color: '#6b7280' },
  footerRight: {},
  footerCopyright: { fontSize: '14px', color: '#6b7280' },
  authContainer: { minHeight: '100vh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: '"Space Grotesk", sans-serif' },
  authCard: { backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '16px', padding: '48px', maxWidth: '500px', width: '100%', position: 'relative' },
  backButton: { position: 'absolute', top: '20px', left: '20px', padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid #2a2a2a', color: '#9ca3af', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
  authLogo: { textAlign: 'center', marginBottom: '32px', marginTop: '20px' },
  authTitle: { fontSize: '32px', fontWeight: '800', color: '#F7931A', marginTop: '16px', marginBottom: '8px' },
  authSubtitle: { fontSize: '16px', color: '#9ca3af' },
  successBox: { backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e', color: '#22c55e', padding: '16px', borderRadius: '10px', marginBottom: '24px', fontSize: '15px', fontWeight: '600', textAlign: 'center' },
  errorBox: { backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '16px', borderRadius: '10px', marginBottom: '24px', fontSize: '15px', fontWeight: '600', textAlign: 'center' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '14px', fontWeight: '600', color: '#E5E5E5', marginBottom: '8px' },
  input: { width: '100%', padding: '14px 16px', backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a', color: '#E5E5E5', borderRadius: '10px', fontSize: '15px', boxSizing: 'border-box' },
  passwordReqs: { backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '16px', marginBottom: '24px' },
  reqItem: { fontSize: '13px', color: '#9ca3af', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
  // Password Requirements UI
  passwordReqsContainer: { backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px' },
  passwordReqsTitle: { fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  passwordReqsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', marginBottom: '16px' },
  passwordReqItem: { fontSize: '13px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.2s' },
  passwordReqMet: { color: '#22c55e' },
  passwordReqIcon: { fontSize: '12px', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: 'rgba(107,114,128,0.2)', transition: 'all 0.2s' },
  passwordReqIconMet: { backgroundColor: 'rgba(34,197,94,0.2)', color: '#22c55e' },
  passwordStrengthContainer: { display: 'flex', alignItems: 'center', gap: '12px' },
  passwordStrengthLabel: { fontSize: '12px', color: '#6b7280', fontWeight: '600' },
  passwordStrengthBar: { flex: 1, height: '6px', backgroundColor: '#2a2a2a', borderRadius: '3px', overflow: 'hidden' },
  passwordStrengthFill: { height: '100%', borderRadius: '3px', transition: 'all 0.3s ease' },
  passwordStrengthText: { fontSize: '12px', fontWeight: '700', minWidth: '50px' },
  inputSuccess: { borderColor: '#22c55e' },
  inputError: { borderColor: '#ef4444' },
  matchSuccess: { fontSize: '12px', color: '#22c55e', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' },
  matchError: { fontSize: '12px', color: '#ef4444', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' },
  forgotPasswordLink: { textAlign: 'right', marginBottom: '20px', marginTop: '-10px' },
  authSubmit: { width: '100%', padding: '16px', backgroundColor: '#F7931A', border: 'none', color: '#000', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
  spinner: { width: '16px', height: '16px', border: '2px solid rgba(0,0,0,0.3)', borderTop: '2px solid #000', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  authFooter: { textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#6b7280' },
  authLink: { color: '#F7931A', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' },
  dashContainer: { minHeight: '100vh', backgroundColor: '#000', fontFamily: '"Space Grotesk", sans-serif' },
  dashboardContainer: { minHeight: '100vh', backgroundColor: '#000', fontFamily: '"Space Grotesk", sans-serif' },
  dashNav: { backgroundColor: '#0a0a0a', borderBottom: '1px solid #1a1a1a', padding: '16px 0' },
  logoutBtn: { padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid #2a2a2a', color: '#9ca3af', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  dashContent: { maxWidth: '1000px', margin: '0 auto', padding: '60px 24px', textAlign: 'center' },
  dashboardContent: { maxWidth: '1000px', margin: '0 auto', padding: '60px 24px' },
  dashboardHeader: { textAlign: 'center', marginBottom: '48px' },
  dashboardTitle: { fontSize: '42px', fontWeight: '800', color: '#fff', marginBottom: '12px' },
  dashboardSubtitle: { fontSize: '16px', color: '#6b7280' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' },
  dashTitle: { fontSize: '42px', fontWeight: '800', color: '#fff', marginBottom: '12px' },
  dashSubtitle: { fontSize: '16px', color: '#6b7280', marginBottom: '20px' },
  dashBadge: { display: 'inline-block', padding: '10px 20px', backgroundColor: 'rgba(247,147,26,0.1)', border: '1px solid #F7931A', borderRadius: '20px', fontSize: '14px', fontWeight: '700', color: '#F7931A', marginBottom: '40px' },
  dashStats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' },
  statCard: { backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '32px', textAlign: 'center' },
  statIcon: { fontSize: '36px', marginBottom: '16px' },
  statNum: { fontSize: '40px', fontWeight: '800', color: '#F7931A', marginBottom: '8px' },
  statLabel: { fontSize: '14px', color: '#6b7280', fontWeight: '600' },
  infoBox: { backgroundColor: '#1a1a1a', border: '1px solid #22c55e', borderRadius: '12px', padding: '32px', textAlign: 'left' },
  infoTitle: { fontSize: '22px', fontWeight: '700', color: '#22c55e', marginBottom: '16px' },
  infoText: { fontSize: '15px', color: '#E5E5E5', lineHeight: '1.6', marginBottom: '12px' },
  ctaCard: { backgroundColor: '#1a1a1a', border: '2px solid #F7931A', borderRadius: '16px', padding: '40px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px' },
  ctaInfo: { textAlign: 'left', flex: 1 },
  ctaTitle: { fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '12px' },
  ctaText: { fontSize: '16px', color: '#9ca3af', marginBottom: '0' },
  startButton: { padding: '16px 48px', backgroundColor: '#F7931A', border: 'none', color: '#000', borderRadius: '12px', fontSize: '18px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s', whiteSpace: 'nowrap' },
  upgradeText: { fontSize: '14px', color: '#9ca3af', marginTop: '16px' },
  recCard: { backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a', padding: '20px', borderRadius: '12px', marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '16px' },
  questionnaireContainer: { maxWidth: '800px', margin: '0 auto', padding: '40px 24px', position: 'relative' },
  // Progress Section
  progressSection: { marginBottom: '32px' },
  progressHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  progressLabel: { fontSize: '14px', color: '#6b7280', fontWeight: '600' },
  progressPercentage: { fontSize: '14px', color: '#F7931A', fontWeight: '700' },
  progressBar: { width: '100%', height: '10px', backgroundColor: '#1a1a1a', borderRadius: '5px', overflow: 'hidden', border: '1px solid #2a2a2a' },
  progressFill: { height: '100%', backgroundColor: '#F7931A', transition: 'width 0.4s ease', borderRadius: '5px', boxShadow: '0 0 10px rgba(247,147,26,0.5)' },
  progressText: { fontSize: '14px', color: '#9ca3af', marginBottom: '32px', textAlign: 'center' },
  progressSteps: { display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '16px' },
  progressDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2a2a2a', transition: 'all 0.3s' },
  progressDotActive: { backgroundColor: '#F7931A', boxShadow: '0 0 8px rgba(247,147,26,0.5)' },
  progressDotCompleted: { backgroundColor: '#22c55e' },
  // Question Card
  questionCard: { background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)', border: '1px solid #2a2a2a', borderRadius: '20px', padding: '40px', position: 'relative', overflow: 'hidden' },
  questionCardGlow: { position: 'absolute', top: '-50%', right: '-20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(247,147,26,0.08) 0%, transparent 70%)', pointerEvents: 'none' },
  questionNumber: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '8px 16px', backgroundColor: 'rgba(247,147,26,0.15)', border: '1px solid rgba(247,147,26,0.3)', borderRadius: '20px', fontSize: '13px', fontWeight: '700', color: '#F7931A', marginBottom: '20px' },
  questionTitle: { fontSize: '26px', fontWeight: '700', color: '#fff', marginBottom: '32px', lineHeight: '1.4', position: 'relative', zIndex: 1 },
  optionsContainer: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', position: 'relative', zIndex: 1 },
  optionItem: { backgroundColor: '#0a0a0a', border: '2px solid #2a2a2a', borderRadius: '14px', padding: '18px 20px', transition: 'all 0.3s ease', cursor: 'pointer', position: 'relative', overflow: 'hidden' },
  optionItemHover: { borderColor: '#F7931A', backgroundColor: '#111' },
  optionItemSelected: { borderColor: '#F7931A', backgroundColor: 'rgba(247,147,26,0.1)', boxShadow: '0 0 20px rgba(247,147,26,0.15)' },
  optionGlow: { position: 'absolute', top: '50%', left: '0', transform: 'translateY(-50%)', width: '4px', height: '0%', backgroundColor: '#F7931A', borderRadius: '0 4px 4px 0', transition: 'height 0.3s ease' },
  optionGlowActive: { height: '60%' },
  optionLabel: { display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', width: '100%' },
  optionRadio: { width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #3a3a3a', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', flexShrink: 0 },
  optionRadioSelected: { borderColor: '#F7931A', backgroundColor: '#F7931A' },
  optionRadioInner: { width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#000', opacity: 0, transition: 'opacity 0.2s' },
  optionRadioInnerSelected: { opacity: 1 },
  optionCheckbox: { width: '24px', height: '24px', borderRadius: '8px', border: '2px solid #3a3a3a', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', flexShrink: 0 },
  optionCheckboxSelected: { borderColor: '#F7931A', backgroundColor: '#F7931A' },
  optionCheckmark: { color: '#000', fontSize: '14px', fontWeight: '700', opacity: 0, transition: 'opacity 0.2s' },
  optionCheckmarkSelected: { opacity: 1 },
  optionInput: { display: 'none' },
  optionText: { fontSize: '16px', color: '#E5E5E5', flex: 1, lineHeight: '1.5' },
  optionTextSelected: { color: '#fff', fontWeight: '500' },
  // Navigation Buttons
  questionButtons: { display: 'flex', gap: '16px', justifyContent: 'space-between', position: 'relative', zIndex: 1 },
  prevButton: { padding: '16px 32px', backgroundColor: 'transparent', border: '2px solid #2a2a2a', color: '#E5E5E5', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '8px' },
  nextButton: { padding: '16px 32px', backgroundColor: '#F7931A', border: 'none', color: '#000', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(247,147,26,0.3)' },
  nextButtonDisabled: { opacity: 0.5, cursor: 'not-allowed', boxShadow: 'none' },
  submitButton: { padding: '16px 48px', backgroundColor: '#22c55e', border: 'none', color: '#000', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(34,197,94,0.3)' },
  cancelButton: { marginTop: '24px', padding: '14px 24px', backgroundColor: 'transparent', border: '1px solid #2a2a2a', color: '#6b7280', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s', width: '100%' },
  // Enhanced Dashboard Styles
  dashboardMain: { position: 'relative', paddingTop: '100px', minHeight: '100vh', overflow: 'hidden' },
  dashboardGlow1: { position: 'absolute', top: '10%', left: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(247,147,26,0.08) 0%, transparent 70%)', pointerEvents: 'none' },
  dashboardGlow2: { position: 'absolute', top: '40%', right: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)', pointerEvents: 'none' },
  dashboardGlow3: { position: 'absolute', bottom: '10%', left: '30%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)', pointerEvents: 'none' },
  dashFloatingElement: { position: 'absolute', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', pointerEvents: 'none' },
  dashboardWelcomeBadge: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'rgba(247,147,26,0.1)', border: '1px solid rgba(247,147,26,0.3)', borderRadius: '24px', fontSize: '14px', fontWeight: '600', color: '#F7931A', marginBottom: '20px' },
  dashboardBadgeIcon: { fontSize: '16px' },
  dashboardTitleAccent: { color: '#F7931A' },
  dashStatsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' },
  dashStatCard: { background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)', border: '1px solid #2a2a2a', borderRadius: '20px', padding: '0', overflow: 'hidden', position: 'relative', transition: 'all 0.4s ease' },
  dashStatCardScore: {},
  dashStatCardScans: {},
  dashStatCardPrivacy: {},
  dashStatCardGlow: { position: 'absolute', width: '120px', height: '120px', borderRadius: '50%', filter: 'blur(40px)', opacity: '0.4', top: '10%', right: '10%', pointerEvents: 'none' },
  dashStatCardGlow1: { backgroundColor: 'rgba(247,147,26,0.5)' },
  dashStatCardGlow2: { backgroundColor: 'rgba(34,197,94,0.5)' },
  dashStatCardGlow3: { backgroundColor: 'rgba(59,130,246,0.5)' },
  dashStatVisual: { position: 'relative', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 20px 0' },
  dashStatIconContainer: { position: 'relative', zIndex: 2, width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' },
  dashStatContent: { padding: '16px 24px 24px', textAlign: 'center' },
  dashStatNum: { fontSize: '36px', fontWeight: '800', color: '#F7931A', marginBottom: '4px' },
  dashStatLabel: { fontSize: '14px', color: '#6b7280', fontWeight: '600', marginBottom: '12px' },
  dashStatBadge: { display: 'inline-block', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700' },
  dashCtaCard: { background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)', border: '2px solid #F7931A', borderRadius: '24px', padding: '32px', marginBottom: '24px', position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px' },
  dashCtaCardGlow: { position: 'absolute', top: '-50%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(247,147,26,0.15) 0%, transparent 70%)', pointerEvents: 'none' },
  dashCtaContent: { display: 'flex', alignItems: 'center', gap: '20px', flex: 1 },
  dashCtaIcon: { flexShrink: 0 },
  dashCtaInfo: { flex: 1 },
  dashCtaTitle: { fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '8px' },
  dashCtaText: { fontSize: '15px', color: '#9ca3af', margin: 0, lineHeight: '1.5' },
  dashCtaButton: { padding: '16px 32px', backgroundColor: '#F7931A', border: 'none', color: '#000', borderRadius: '14px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '10px', whiteSpace: 'nowrap', boxShadow: '0 8px 24px rgba(247,147,26,0.3)' },
  dashCtaLimited: { textAlign: 'right' },
  dashCtaButtonDisabled: { padding: '16px 32px', backgroundColor: '#3a3a3a', border: 'none', color: '#6b7280', borderRadius: '14px', fontSize: '16px', fontWeight: '700', cursor: 'not-allowed' },
  dashCtaUpgrade: { fontSize: '13px', color: '#F7931A', marginTop: '12px' },
  dashTipCard: { background: 'linear-gradient(180deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.02) 100%)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'flex-start', gap: '16px', position: 'relative', overflow: 'hidden', marginBottom: '32px' },
  dashTipCardGlow: { position: 'absolute', top: '-30%', right: '10%', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(34,197,94,0.2) 0%, transparent 70%)', pointerEvents: 'none' },
  dashTipIcon: { flexShrink: 0 },
  dashTipContent: { flex: 1 },
  dashTipTitle: { fontSize: '18px', fontWeight: '700', color: '#22c55e', marginBottom: '8px' },
  dashTipText: { fontSize: '14px', color: '#E5E5E5', lineHeight: '1.6', margin: 0 },
  dashHistorySection: { marginTop: '16px' },
  dashHistoryTitle: { fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '16px' },
  dashHistoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  dashHistoryCard: { background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)', border: '1px solid #2a2a2a', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.3s' },
  dashHistoryScore: { fontSize: '28px', fontWeight: '800' },
  dashHistoryInfo: { flex: 1 },
  dashHistoryDate: { fontSize: '14px', color: '#6b7280', marginBottom: '4px' },
  dashHistoryStatus: { fontSize: '13px', fontWeight: '600' },
  // Enhanced Report Styles
  reportContainer2: { minHeight: '100vh', backgroundColor: '#000', fontFamily: '"Space Grotesk", sans-serif', position: 'relative', overflow: 'hidden', padding: '60px 24px' },
  reportGlow1: { position: 'absolute', top: '5%', left: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(247,147,26,0.08) 0%, transparent 70%)', pointerEvents: 'none' },
  reportGlow2: { position: 'absolute', bottom: '10%', right: '5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)', pointerEvents: 'none' },
  reportHeader: { textAlign: 'center', marginBottom: '48px', position: 'relative', zIndex: 1 },
  reportBadge: { display: 'inline-block', padding: '10px 20px', backgroundColor: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '24px', fontSize: '14px', fontWeight: '600', color: '#22c55e', marginBottom: '20px' },
  reportTitle: { fontSize: '42px', fontWeight: '800', color: '#fff', marginBottom: '12px' },
  reportSubtitle: { fontSize: '16px', color: '#6b7280', maxWidth: '500px', margin: '0 auto' },
  reportScoreSection: { maxWidth: '500px', margin: '0 auto 48px', position: 'relative', zIndex: 1 },
  reportScoreCard: { background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)', border: '1px solid #2a2a2a', borderRadius: '24px', padding: '40px', textAlign: 'center', position: 'relative', overflow: 'hidden' },
  reportScoreCardGlow: { position: 'absolute', top: '-30%', right: '-10%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(247,147,26,0.15) 0%, transparent 70%)', pointerEvents: 'none' },
  reportScoreVisual: { position: 'relative', width: '180px', height: '180px', margin: '0 auto 24px' },
  reportScoreInner: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' },
  reportScoreNumber: { fontSize: '56px', fontWeight: '800', lineHeight: '1' },
  reportScoreOf: { fontSize: '18px', color: '#6b7280', fontWeight: '600' },
  reportScoreLabel: { fontSize: '24px', fontWeight: '700', marginBottom: '16px' },
  reportScoreDesc: { fontSize: '15px', color: '#9ca3af', lineHeight: '1.6', maxWidth: '350px', margin: '0 auto' },
  reportRecsSection: { maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 },
  reportRecsHeader: { textAlign: 'center', marginBottom: '32px' },
  reportRecsTitle: { fontSize: '28px', fontWeight: '700', color: '#fff', marginBottom: '8px' },
  reportRecsSubtitle: { fontSize: '14px', color: '#6b7280' },
  reportTipsList: { display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' },
  reportTipCard: { background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)', border: '1px solid #2a2a2a', borderRadius: '16px', padding: '24px', transition: 'all 0.3s', cursor: 'pointer' },
  reportTipHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  reportTipLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  reportTipPriority: { padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px' },
  reportTipCategory: { fontSize: '13px', color: '#6b7280', fontWeight: '500' },
  reportTipNumber: { fontSize: '14px', color: '#3a3a3a', fontWeight: '700' },
  reportTipTitle: { fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '8px' },
  reportTipShort: { fontSize: '14px', color: '#9ca3af', lineHeight: '1.5' },
  reportTipExpand: { fontSize: '12px', color: '#F7931A', marginTop: '12px', fontWeight: '600' },
  reportTipExpanded: { marginTop: '16px' },
  reportTipDivider: { height: '1px', backgroundColor: '#2a2a2a', marginBottom: '16px' },
  reportTipFull: { fontSize: '14px', color: '#E5E5E5', lineHeight: '1.7' },
  reportTipFullHeading: { fontSize: '15px', fontWeight: '700', color: '#F7931A', marginTop: '16px', marginBottom: '8px' },
  reportTipFullList: { marginLeft: '20px', marginBottom: '6px', color: '#9ca3af' },
  reportTipFullText: { marginBottom: '8px' },
  reportLockedSection: { background: 'linear-gradient(180deg, rgba(107,114,128,0.1) 0%, rgba(107,114,128,0.02) 100%)', border: '1px solid #2a2a2a', borderRadius: '16px', padding: '24px', marginBottom: '32px' },
  reportLockedHeader: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px', fontWeight: '700', color: '#6b7280', marginBottom: '16px' },
  reportLockedIcon: { fontSize: '18px' },
  reportLockedList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  reportLockedTip: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '10px' },
  reportLockedTipLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  reportLockedTipTitle: { fontSize: '14px', color: '#6b7280' },
  reportLockedBadge: { fontSize: '14px' },
  reportUpgradeCard: { background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)', border: '2px solid #F7931A', borderRadius: '20px', padding: '32px', position: 'relative', overflow: 'hidden' },
  reportUpgradeCardGlow: { position: 'absolute', top: '-50%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(247,147,26,0.2) 0%, transparent 70%)', pointerEvents: 'none' },
  reportUpgradeContent: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', position: 'relative', zIndex: 1 },
  reportUpgradeIcon: { flexShrink: 0 },
  reportUpgradeInfo: { flex: 1 },
  reportUpgradeTitle: { fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '8px' },
  reportUpgradeText: { fontSize: '14px', color: '#9ca3af', lineHeight: '1.5' },
  reportUpgradeButtons: { display: 'flex', gap: '12px', position: 'relative', zIndex: 1 },
  reportUpgradeBtn: { flex: 1, padding: '16px 24px', backgroundColor: '#F7931A', border: 'none', color: '#000', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 8px 24px rgba(247,147,26,0.3)' },
  reportUpgradeBtnAlt: { flex: 1, padding: '16px 24px', backgroundColor: 'transparent', border: '2px solid #a855f7', color: '#a855f7', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s' },
  reportPremiumActions: { marginTop: '32px' },
  reportPdfSection: { background: 'linear-gradient(180deg, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.02) 100%)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' },
  reportPdfIcon: { flexShrink: 0 },
  reportPdfInfo: { flex: 1 },
  reportPdfTitle: { fontSize: '16px', fontWeight: '700', color: '#22c55e', marginBottom: '4px' },
  reportPdfText: { fontSize: '13px', color: '#9ca3af' },
  reportPdfBtn: { padding: '12px 24px', backgroundColor: '#22c55e', border: 'none', color: '#000', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s', whiteSpace: 'nowrap' },
  reportEmailSection: { textAlign: 'center', padding: '20px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '12px' },
  reportEmailText: { fontSize: '14px', color: '#9ca3af', marginBottom: '8px' },
  reportEmailPassword: { color: '#F7931A', fontFamily: 'monospace', fontSize: '16px' },
  reportEmailNote: { fontSize: '13px', color: '#6b7280' },
  reportFooter: { maxWidth: '800px', margin: '48px auto 0', textAlign: 'center', position: 'relative', zIndex: 1 },
  reportBackBtn: { padding: '14px 32px', backgroundColor: 'transparent', border: '1px solid #2a2a2a', color: '#9ca3af', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s' },
  // Legacy report styles
  reportContainer: { maxWidth: '900px', margin: '0 auto', padding: '60px 24px' },
  reportCard: { backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '16px', padding: '48px', textAlign: 'center' },
  scoreCircle: { position: 'relative', width: '200px', height: '200px', margin: '0 auto 24px' },
  scoreNumber: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '64px', fontWeight: '800', color: '#F7931A' },
  scoreLabel: { fontSize: '24px', fontWeight: '700', marginBottom: '48px' },
  recsSection: { textAlign: 'left', marginBottom: '48px' },
  recsTitle: { fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '24px' },
  recItem: { backgroundColor: '#0a0a0a', padding: '16px', borderRadius: '10px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '16px' },
  recIcon: { fontSize: '24px' },
  recText: { fontSize: '16px', color: '#E5E5E5', flex: 1 },
  planSection: { textAlign: 'left', marginBottom: '48px' },
  planTitle: { fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '24px' },
  planCategory: { marginBottom: '24px' },
  planCategoryTitle: { fontSize: '18px', fontWeight: '700', color: '#F7931A', marginBottom: '12px' },
  planItem: { fontSize: '15px', color: '#E5E5E5', marginBottom: '8px', paddingLeft: '8px' },
  reportButton: { padding: '16px 48px', backgroundColor: '#F7931A', border: 'none', color: '#000', borderRadius: '12px', fontSize: '18px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s' },
};

// Lógica de inyección de estilos globales (Fonts y Animaciones)
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap');
    @keyframes pulse { 0%, 100% { opacity: 0.15; transform: scale(1); } 50% { opacity: 0.25; transform: scale(1.05); } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes float { 0%, 100% { transform: translateY(0px) rotate(var(--rotate, 0deg)); } 50% { transform: translateY(-10px) rotate(var(--rotate, 0deg)); } }
    @keyframes floatSlow { 0%, 100% { transform: translateY(0px) rotate(var(--rotate, 0deg)); } 50% { transform: translateY(-6px) rotate(var(--rotate, 0deg)); } }
    @keyframes glowPulse { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.1); } }
    .step-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(247,147,26,0.15); }
    .pvu-card:hover { transform: translateY(-6px); box-shadow: 0 16px 32px rgba(247,147,26,0.12); }
    .pricing-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
    .pricing-card-featured:hover { transform: scale(1.02) translateY(-6px); box-shadow: 0 24px 48px rgba(247,147,26,0.25); }
    .floating-element { animation: float 4s ease-in-out infinite; }
    .floating-element-slow { animation: floatSlow 5s ease-in-out infinite; }
    .glow-element { animation: glowPulse 3s ease-in-out infinite; }
    .option-item:hover { border-color: rgba(247,147,26,0.5); background-color: #111; }
    .option-item.selected { border-color: #F7931A; background-color: rgba(247,147,26,0.1); box-shadow: 0 0 20px rgba(247,147,26,0.15); }
    .prev-button:hover { border-color: #3a3a3a; background-color: rgba(255,255,255,0.05); }
    .cancel-button:hover { border-color: #3a3a3a; color: #9ca3af; }
    button:hover:not(:disabled) { transform: translateY(-2px); }
    input:focus { outline: none; border-color: #F7931A !important; }
    .dash-stat-card:hover { transform: translateY(-6px); box-shadow: 0 16px 32px rgba(0,0,0,0.4); }
    .dash-history-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.3); border-color: #3a3a3a; }
    .dash-cta-button:hover { box-shadow: 0 12px 32px rgba(247,147,26,0.4); }
    .report-tip-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.3); border-color: #3a3a3a; }

    /* Footer Styles */
    .social-icon:hover { background-color: #2a2a2a !important; border-color: #F7931A !important; transform: translateY(-3px); box-shadow: 0 8px 20px rgba(247,147,26,0.2); }
    .social-icon:hover svg { stroke: #F7931A; fill: #F7931A; }
    .footer-link:hover { color: #F7931A !important; }
    .site-footer { font-family: "Space Grotesk", sans-serif; }

    /* Mobile Responsive Styles */
    @media (max-width: 768px) {
      /* Hero Section - Stack vertically on mobile */
      .hero-section {
        flex-direction: column-reverse !important;
        padding-top: 100px !important;
        padding-bottom: 60px !important;
        gap: 40px !important;
        min-height: auto !important;
      }
      .hero-content {
        max-width: 100% !important;
        text-align: center !important;
        padding: 0 16px !important;
      }
      .hero-title {
        font-size: 36px !important;
        letter-spacing: -1px !important;
      }
      .hero-subtitle {
        font-size: 16px !important;
      }
      .hero-buttons {
        flex-direction: column !important;
        gap: 12px !important;
      }
      .hero-stats {
        flex-direction: column !important;
        gap: 20px !important;
      }
      .hero-stat-divider {
        display: none !important;
      }
      .hero-image {
        margin-right: 0 !important;
        width: 100% !important;
        display: flex !important;
        justify-content: center !important;
      }
      .mockup-card {
        width: 90% !important;
        max-width: 340px !important;
      }

      /* Navigation */
      .nav-content {
        padding: 0 16px !important;
      }
      .nav-logo-text {
        font-size: 20px !important;
      }
      .nav-buttons {
        gap: 6px !important;
        flex-direction: row !important;
        flex-wrap: nowrap !important;
      }
      .nav-button {
        padding: 6px 10px !important;
        font-size: 11px !important;
        white-space: nowrap !important;
      }

      /* Section Titles */
      .section-title {
        font-size: 28px !important;
      }
      .section-subtitle {
        font-size: 15px !important;
        padding: 0 16px !important;
      }

      /* PVU Grid - Single column on mobile */
      .pvu-grid {
        grid-template-columns: 1fr !important;
        gap: 16px !important;
      }

      /* Steps Grid - Single column on mobile */
      .steps-grid {
        grid-template-columns: 1fr !important;
        gap: 16px !important;
      }

      /* Pricing Grid - Single column on mobile */
      .pricing-grid {
        grid-template-columns: 1fr !important;
        gap: 16px !important;
      }
      .pricing-card-featured {
        transform: none !important;
      }

      /* Auth Card */
      .auth-card {
        padding: 24px 20px !important;
        margin: 0 16px !important;
      }
      .auth-title {
        font-size: 24px !important;
      }
    }

    @media (max-width: 480px) {
      .hero-title {
        font-size: 28px !important;
      }
      .mockup-card {
        width: 95% !important;
      }
    }

    /* Footer responsive */
    @media (max-width: 768px) {
      .site-footer .footer-top-section {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 32px !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}