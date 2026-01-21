// KYWARD TRANSLATIONS
// English and Spanish translations for the entire application

export const translations = {
  en: {
    // Navigation
    nav: {
      dashboard: 'Dashboard',
      logout: 'Logout',
      login: 'Login',
      signup: 'Sign Up',
      getStarted: 'Get Started',
      learnMore: 'Learn More'
    },

    // Landing Page
    landing: {
      // Hero Section
      heroBadge: '₿ITCOIN SECURITY MADE SIMPLE',
      heroLine1: 'Stop Guessing.',
      heroLine2: 'Secure Your Sats',
      heroLine3: 'The Right Way.',
      heroSubtitle: 'A questionnaire-based assessment that shows you exactly how to protect your private keys. No BS. No wallet recommendations. Just honest security advice from fellow Bitcoiners.',
      heroCta: 'Start Free Assessment',
      heroSecondaryCta: 'See How It Works',
      heroStats: {
        nonCustodial: 'Non-Custodial',
        nonCustodialValue: '100%',
        dataStored: 'Data Stored',
        dataStoredValue: '0',
        privacyFirst: 'Privacy First',
        privacyFirstValue: '∞'
      },

      // Mockup Card
      mockup: {
        title: 'Your Security Score',
        rec1: 'Hardware wallet detected',
        rec2: 'Consider multi-sig setup',
        rec3: 'Backup strategy solid'
      },

      // Why Kyward Section (PVU)
      whyTitle: 'What Makes Kyward Different?',
      whySubtitle: "We're not trying to sell you a wallet. We're here to educate you on securing what's already yours.",
      whyCards: {
        personalized: {
          title: 'Personalized Assessment',
          description: 'Answer 10-15 questions about your current setup. Get a custom security score and actionable recommendations tailored to YOUR situation.'
        },
        zeroData: {
          title: 'Zero Data Storage',
          description: 'Your answers never leave your device. We don\'t store, track, or sell your data. Ever.'
        },
        education: {
          title: 'Education First',
          description: 'Learn WHY each recommendation matters. Understand the trade-offs. Make informed decisions.'
        },
        noWallet: {
          title: 'No Wallet Pushing',
          description: 'We\'re not affiliated with any wallet provider. Our recommendations are based purely on security best practices.'
        }
      },

      // How It Works Section
      howTitle: 'How It Works',
      howSubtitle: 'Three simple steps to better security',
      howSteps: {
        step1: {
          number: '01',
          title: 'Take the Assessment',
          description: 'Answer questions about your current Bitcoin storage methods and security habits. Takes just 5 minutes.'
        },
        step2: {
          number: '02',
          title: 'Get Your Score',
          description: 'Receive a personalized security score from 0-100 with a detailed breakdown of your strengths and weaknesses.'
        },
        step3: {
          number: '03',
          title: 'Follow the Plan',
          description: 'Get a step-by-step action plan with prioritized recommendations tailored to your security level.'
        }
      },

      // Pricing Section
      pricingTitle: 'Simple, Honest Pricing',
      pricingSubtitle: 'No hidden fees. No subscriptions. Pay once, own forever.',
      plans: {
        subtitle: 'Choose the plan that fits your security needs', // en /es → ver abajo

        free: {
          badge: 'FREE',
          name: 'Free',
          price: '$0',
          period: '/forever',
          features: [
            'Security Questionnaire',
            'Your Security Score',
            '1 Most Critical Security Tip'
          ],
          cta: 'Start Free Assessment'
        },

        essential: {
          badge: 'RECOMMENDED',
          name: 'Essential',
          price: '$7.99',
          period: '/one-time',
          features: [
            'Full PDF Report Download',
            'All Personalized Recommendations',
            'Inheritance Planning Guide',
            'Unlimited Re-downloads of your report',
            'One assessment only (repurchase to retake)'
          ],
          cta: 'Get Essential ($7.99)'
        },

        sentinel: {
          badge: 'ADVANCED',
          name: 'Sentinel',
          price: '$14.99',
          period: '/month',
          features: [
            'Unlimited Assessments',
            'Email Alerts (security news & hacks)',
            'Daily Security Tips by email',
            'All Essential features',
            'Cancel anytime'
          ],
          cta: 'Subscribe to Sentinel'
        },

        consultation: {
          badge: 'EXPERT',
          name: 'Consultation',
          price: '$99',
          period: '+ $49/hr additional',
          features: [
            '1-hour private audit (video call)',
            'All Sentinel features',
            'Personalized deep-dive recommendations',
            'Priority support',
            'Additional hours available'
          ],
          cta: 'Book Your Consultation'
        }
      },

      // Footer
      footer: {
        tagline: 'Empowering Bitcoiners with honest security advice.',
        copyright: '© 2025 Kyward. Built by Bitcoiners.'
      }
    },

    // Auth Form
    auth: {
      loginTitle: 'Welcome Back',
      loginSubtitle: 'Enter your details to access your dashboard',
      signupTitle: 'Create Account',
      signupSubtitle: 'Join Kyward and secure your Bitcoin legacy',
      signupSuccess: 'Account created successfully! Welcome to the Free tier. You can upgrade to Essential, Sentinel or Consultation anytime from your Dashboard.',
      forgotTitle: 'Forgot Password',
      forgotSubtitle: 'Enter your email to reset your password',
      resetTitle: 'Reset Password',
      resetSubtitle: 'Create a new password for',

      email: 'Email Address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      newPassword: 'New Password',
      confirmNewPassword: 'Confirm New Password',

      loginButton: 'Login',
      signupButton: 'Create Account',
      verifyEmail: 'Verify Email',
      resetButton: 'Reset Password',

      forgotLink: 'Forgot password?',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      backToLogin: 'Back to Login',
      back: 'Back',

      passwordRequirements: {
        title: 'Password must have:',
        minLength: '8+ characters',
        uppercase: 'Uppercase letter',
        lowercase: 'Lowercase letter',
        number: 'Number'
      },
      passwordStrength: {
        weak: 'Weak',
        fair: 'Fair',
        good: 'Good',
        strong: 'Strong'
      },
      passwordsMatch: 'Passwords match',
      passwordsNoMatch: 'Passwords do not match',

      errors: {
        invalidCredentials: 'Invalid email or password',
        emailExists: 'Email already exists',
        emailNotFound: 'No account found with this email address',
        passwordRequirements: 'Please meet all password requirements'
      },

      success: {
        accountCreated: 'Account created! Logging you in...',
        passwordReset: 'Password reset successfully! You can now login.',
        emailVerified: 'Email verified! Create your new password.'
      },

      footer: 'Free tier included. Upgrade later to unlock full reports, unlimited assessments & more.',

      statement: {
        part1: 'Start Free – No credit card required.',
        part2: 'All users start on Free tier. Upgrade anytime to Essential ($7.99 one-time), Sentinel ($14.99/month) or Consultation.',
      }

    },

    // Dashboard
    dashboard: {
      welcome: 'Welcome back,',
      welcomeUser: 'Bitcoiner',
      subtitle: 'Track your Bitcoin security progress',

      stats: {
        securityScore: 'Security Score',
        assessments: 'Assessments',
        plan: 'Plan',
        status: 'Status',
        active: 'Active',
        noScore: 'No score yet'
      },

      comparison: {
        you: 'YOU',
        avg: 'AVG',
        top: 'TOP'
      },

      quickActions: {
        title: 'Quick Actions',
        downloadPdf: 'Download PDF',
        downloadDesc: 'Get your security plan',
        emailReport: 'Email Report',
        emailDesc: 'Send to your inbox',
        viewReport: 'View Report',
        viewDesc: 'See full analysis',
        takeAssessment: 'New Assessment',
        assessmentDesc: 'Check your progress'
      },

      pdfPassword: {
        label: 'PDF Password',
        show: 'Show',
        hide: 'Hide',
        copy: 'Copy',
        copied: 'Copied!'
      },

      upgrade: {
        title: 'Unlock Your Full Security Plan',
        description: 'Get unlimited assessments, download your personalized PDF report, and access your complete inheritance plan.',
        features: {
          pdf: 'Download PDF Report',
          email: 'Email Report',
          recommendations: 'All Recommendations',
          inheritance: 'Inheritance Plan'
        },
        essentialButton: 'Get Essential - $7.99 one-time',
        sentinelButton: 'Subscribe Sentinel - $14.99/month',
        cancelNote: 'Cancel anytime',
        consultButton: 'Book Consultation - $99',
        sessionNote: '1-hour session',
        limitReached: 'Assessment limit reached for your current plan.',
        upgradeForUnlimited: 'Upgrade to Sentinel for unlimited assessments.',
        essentialNote: 'With Essential you get one assessment. Repurchase to take a new one.'
      },

      cta: {
        firstAssessment: 'Take Your First Assessment',
        newAssessment: 'Ready for a new assessment?',
        firstDesc: 'Answer 15 questions about your Bitcoin security to get your personalized score and recommendations.',
        newDesc: 'Check if your security practices have improved since your last assessment.',
        startButton: 'Start Assessment',
        startNewButton: 'Start New Assessment',
        limitButton: 'Limit Reached',
        unlimitedNote: 'You have unlimited assessments',
        upgradeNote: 'Upgrade to Premium for unlimited assessments'
      },

      dailyTip: 'Daily Tip',

      history: {
        title: 'Assessment History',
        viewAll: 'View All',
        showLess: 'Show Less',
        score: 'Score',
        date: 'Date',
        viewReport: 'View Report',
        premiumOnly: 'Premium feature'
      },

      emailPreferences: 'Email Preferences',
      dailyTips: 'Daily Security Tips',
      securityAlerts: 'Security Alerts & hack notifications',
      monthlyReviews: 'Monthly wallet review reminders',
    },

    // Questionnaire
    questionnaire: {
      progress: 'Question',
      of: 'of',
      complete: 'Complete',
      selectAll: 'Select all that apply',

      previous: 'Previous',
      next: 'Next',
      getScore: 'Get My Score',
      calculating: 'Calculating...',
      cancel: 'Cancel Assessment',

      questions: {
        q1: 'Do you use a hardware wallet to store your Bitcoin?',
        q2: 'How often do you back up your wallet seed phrase?',
        q3: 'Where do you store your seed phrase backup?',
        q4: 'Do you use a passphrase (25th word) with your seed?',
        q5: 'Have you tested your wallet recovery process?',
        q6: 'Do you use multi-signature (multisig) setup?',
        q7: 'How do you verify receiving addresses?',
        q8: 'How much of your Bitcoin is in cold storage?',
        q9: 'Do you reuse Bitcoin addresses?',
        q10: 'How do you handle software updates for your wallets?',
        q11: 'Have you shared your seed phrase with anyone?',
        q12: 'Do you use a dedicated device for Bitcoin transactions?',
        q13: 'How do you plan to pass Bitcoin to heirs?',
        q14: 'Do you use coin control and UTXO management?',
        q15: 'How often do you review your security setup?'
      },

      // Answer options for each question
      answers: {
        q1: {
          yes: 'Yes, I use a hardware wallet',
          sometimes: 'Sometimes, for larger amounts',
          no: 'No, I use software/mobile wallet'
        },
        q2: {
          multiple: 'Multiple secure locations',
          single: 'One secure location',
          digital: 'Digitally (cloud/photo)',
          none: 'No backup yet'
        },
        q3: {
          metal: 'Metal backup (fireproof)',
          paper: 'Paper in safe location',
          bank_vault: 'Bank safety deposit box',
          home_safe: 'Home safe',
          memorized: 'Memorized only'
        },
        q4: {
          yes_separate: 'Yes, stored separately',
          yes_together: 'Yes, stored with seed',
          no: 'No passphrase'
        },
        q5: {
          yes_multiple: 'Yes, multiple times',
          yes_once: 'Yes, once',
          no: 'No, never tested'
        },
        q6: {
          yes_3of5: 'Yes, 3-of-5 or higher',
          yes_2of3: 'Yes, 2-of-3',
          considering: 'Considering it',
          no: 'No, single signature'
        },
        q7: {
          hardware: 'On hardware wallet screen',
          multiple_sources: 'Compare multiple sources',
          copy_paste: 'Copy-paste only',
          dont_verify: "Don't verify"
        },
        q8: {
          all: '90-100% (only spending money hot)',
          most: '50-90%',
          some: '10-50%',
          none: 'All in hot wallets/exchanges'
        },
        q9: {
          never: 'Never, always use new addresses',
          rarely: 'Rarely',
          often: 'Often reuse addresses'
        },
        q10: {
          verify_signatures: 'Verify signatures, read release notes',
          official_only: 'Only from official sources',
          auto_update: 'Auto-update enabled',
          rarely_update: 'Rarely update'
        },
        q11: {
          never: 'Never, not even family',
          trusted_person: 'Only trusted family member',
          multiple: 'Multiple people know',
          online: 'Stored digitally/online'
        },
        q12: {
          yes_airgapped: 'Yes, air-gapped device',
          yes_dedicated: 'Yes, dedicated but online',
          separate_phone: 'Separate phone/tablet',
          main_device: 'No, use main device'
        },
        q13: {
          documented_plan: 'Documented inheritance plan',
          family_knows: 'Family knows where to find info',
          no_plan: 'No plan yet',
          not_considered: "Haven't considered it"
        },
        q14: {
          advanced: 'Yes, actively manage UTXOs',
          basic: 'Basic understanding, sometimes use',
          heard: "Heard of it, don't use",
          unfamiliar: 'Unfamiliar with concept'
        },
        q15: {
          quarterly: 'Every 3 months',
          yearly: 'Once a year',
          rarely: 'Rarely review',
          never: 'Never reviewed'
        }
      },

      errors: {
        limitReached: 'Monthly limit reached. Upgrade to premium.',
        savingError: 'Error saving assessment'
      }
    },

    // Report
    report: {
      title: 'Your Security Report',
      subtitle: "Based on your answers, here's your personalized Bitcoin security analysis.",
      badge: 'Security Assessment Complete',

      score: {
        label: 'Security Score',
        outOf: '/100',
        excellent: 'Excellent Security',
        good: 'Moderate Security',
        needsWork: 'Needs Improvement',
        critical: 'Critical',
        excellentDesc: 'Your Bitcoin security practices are excellent. Focus on optimization and inheritance planning.',
        goodDesc: 'You have a solid foundation, but there are important areas to improve.',
        needsWorkDesc: 'Your Bitcoin is at significant risk. Follow the recommendations below immediately.'
      },

      comparison: {
        title: 'How You Compare to Other Bitcoiners',
        badge: 'Compare with Bitcoin Community',
        yourScore: 'YOUR SCORE',
        communityAvg: 'COMMUNITY AVERAGE',
        percentile: 'YOUR PERCENTILE',
        betterThan: 'Better than',
        ofUsers: '% of users',
        aboveAvg: 'above avg',
        belowAvg: 'below avg',
        atAvg: 'at avg',
        points: 'pts',
        greatJob: 'Great job!',
        roomForImprovement: 'Room for improvement!',
        rightAtAverage: 'Right at average!',
        yourScoreIs: 'Your security score is',
        theAverage: 'the average Bitcoin holder.',
        keepImproving: 'Keep improving to reach the top tier.',
        pointsBelow: 'Your score is',
        pointsBelowAvg: 'points below the average.',
        followRecs: 'Follow the recommendations below to improve your security.',
        onParWith: "You're on par with most Bitcoin holders.",
        takeAction: 'Take action on the recommendations to stand out from the crowd.'
      },

      distribution: {
        title: 'SCORE DISTRIBUTION AMONG BITCOIN HOLDERS',
        needsWork: 'Needs Work',
        average: 'Average',
        good: 'Good',
        excellent: 'Excellent',
        youAreHere: "You're here"
      },

      freeUserSummary: {
        found: 'YOUR ASSESSMENT FOUND',
        criticalIssues: 'Critical Issues',
        totalRecs: 'Total Recommendations',
        freeTips: 'Free Tips Below'
      },

      recommendations: {
        freeTitle: 'Your Free Security Tips',
        premiumTitle: 'Your Complete Action Plan',
        freeSubtitle: 'Here are 3 tips to get you started. Upgrade to unlock all',
        freeSubtitle2: 'recommendations.',
        premiumSubtitle: 'personalized recommendations based on your answers',
        clickExpand: 'Click to expand',
        clickCollapse: 'Click to collapse',

        priority: {
          critical: 'CRITICAL',
          high: 'HIGH',
          medium: 'MEDIUM',
          low: 'LOW'
        },

        locked: 'More Recommendations Locked',
        lockedDesc: 'Upgrade to unlock all personalized security recommendations',
        unlock: 'Unlock',
        recommendations: 'recommendations',
        moreRecommendations: 'more personalized recommendations...'
      },

      upgrade: {
        title: 'Unlock Your Complete Security & Inheritance Plan',
        subtitle: "Don't just know your score - know exactly how to fix every issue and protect your Bitcoin for generations.",

        benefits: {
          recommendations: {
            title: 'All Recommendations',
            description: 'Detailed step-by-step instructions for every security improvement, prioritized by urgency.'
          },
          pdf: {
            title: 'Password-Protected PDF',
            description: 'Download or receive by email a secure document you can save offline and reference anytime.'
          },
          inheritance: {
            title: 'Complete Inheritance Plan',
            description: 'Step-by-step guide to ensure your Bitcoin passes to your heirs safely using Liana time-locks.'
          },
          multisig: {
            title: 'Multi-Signature Setup Guide',
            description: 'Learn how to set up 2-of-3 multisig for maximum security with Sparrow Wallet.'
          },
          sparrow: {
            title: 'Sparrow Wallet Tutorial',
            description: 'Complete guide to setting up and using Sparrow Wallet for maximum sovereignty.'
          },
          unlimited: {
            title: 'Unlimited Re-Assessments',
            description: 'Track your progress over time. Retake the assessment whenever you want.'
          }
        },

        pdfPreview: {
          title: 'Your Personal Security & Inheritance Plan',
          subtitle: 'Password-protected document ready for download',
          contents: [
            'Executive Summary',
            'Security Score Breakdown',
            'All Recommendations',
            'Sparrow Setup Guide',
            'Multisig Instructions',
            'Liana Inheritance Setup',
            'Backup Strategies',
            'Action Plan Checklist'
          ]
        },

        urgency: {
          message: 'You have',
          issues: 'critical/high priority issues.',
          cta: 'Get your complete plan now to protect your Bitcoin before it\'s too late.'
        },

        trustBadges: {
          bitcoin: 'Pay with Bitcoin',
          noKyc: 'No KYC Required',
          instant: 'Instant Access',
          private: '100% Private'
        }
      },

      premium: {
        downloadPdf: 'Download Your Inheritance Plan (PDF)',
        pdfDescription: 'Complete plan with Sparrow, Liana, multisig setup guides, and step-by-step instructions.',
        downloadButton: 'Download PDF',
        pdfPassword: 'PDF Password',
        show: 'Show',
        hide: 'Hide',
        copy: 'Copy',
        copied: 'Copied!',
        emailNote: 'The PDF will be sent to',
        withPassword: 'with this password.',
        previewEmail: 'Preview Email',
        sendingEmail: 'Sending...',
        emailSent: 'Email Sent!',
        sendEmail: 'Send Report via Email'
      },

      backToDashboard: 'Back to Dashboard'
    },

    // Payment Modal
    payment: {
      generating: 'Generating Payment...',
      generatingDesc: 'Creating your Bitcoin payment address',

      title: 'Pay with Bitcoin',
      subtitle: 'Scan QR code or copy address below',

      amount: 'Amount',
      address: 'Bitcoin Address',

      priceUpdates: 'Price updates in:',
      priceExpired: 'Price expired',
      updatingPrice: 'Updating price...',
      refreshNow: 'Refresh Now',

      waiting: 'Waiting for payment...',
      expiresIn: 'Payment expires in:',

      copyAddress: 'Copy Address',
      copied: 'Copied!',
      simulateDemo: 'Simulate Payment (Demo)',
      cancel: 'Cancel',

      // Success
      confirmed: 'Payment Confirmed!',
      planActive: 'Your {plan} is now active',
      yourPassword: 'YOUR PDF PASSWORD',
      savePassword: "Save this password! You'll need it to open your security plan PDF.",
      continueToReport: 'Continue to Report',
      paymentActivatedSubscription: 'Your monthly subscription is now active.<br/>You now have unlimited assessments, email alerts, and all advanced features.<br/>You can cancel anytime from your dashboard.',
      paymentActivatedOneTime: 'Your one-time payment is complete.<br/>You now have full access to your PDF report and recommendations.',
      essentialRepurchaseNote: '<strong>Note:</strong> To take a new assessment, you will need to purchase Essential again ($7.99).',
      consultationBooked: 'Your consultation session has been booked.<br/>You will receive the details and link in your email soon.',

      // Expired
      expired: 'Payment Expired',
      expiredDesc: 'The payment window has closed. Please try again.',

      // Error
      error: 'Payment Error',
      errorDesc: 'Something went wrong. Please try again.',

      tryAgain: 'Try Again',
      close: 'Close'
    },

    // Daily Tips
    tips: {
      seedPhrase: {
        title: 'Seed Phrase Security',
        text: 'Never share your 24-word seed phrase with anyone, including us. Kyward will never ask for your keys or private information.'
      },
      hardwareWallet: {
        title: 'Hardware Wallet Best Practice',
        text: "Always verify receiving addresses on your hardware wallet's screen before sending Bitcoin. Never trust addresses shown only on your computer."
      },
      backupRedundancy: {
        title: 'Backup Redundancy',
        text: 'Store your seed phrase backup in at least 2 geographically separate locations. Consider using metal backup plates for fire and water resistance.'
      },
      passphrase: {
        title: 'Passphrase Protection',
        text: 'Consider using a 25th word (passphrase) with your seed phrase. Store it separately from your seed for maximum security.'
      },
      testRecovery: {
        title: 'Test Your Recovery',
        text: 'Periodically test your wallet recovery process with a small amount. Better to discover issues now than during an emergency.'
      },
      multisig: {
        title: 'Multisig Security',
        text: 'For significant holdings, consider a 2-of-3 multisig setup. It protects against single points of failure and physical threats.'
      },
      coldStorage: {
        title: 'Cold Storage Priority',
        text: 'Keep 90%+ of your Bitcoin in cold storage. Only maintain small amounts in hot wallets for regular transactions.'
      },
      addressPrivacy: {
        title: 'Address Privacy',
        text: 'Never reuse Bitcoin addresses. Using fresh addresses for each transaction improves your financial privacy significantly.'
      },
      softwareUpdates: {
        title: 'Software Updates',
        text: 'Always verify software signatures before updating your wallet. Download only from official sources and check GPG signatures.'
      },
      inheritance: {
        title: 'Inheritance Planning',
        text: 'Document your Bitcoin inheritance plan. Your heirs should know how to access your Bitcoin if something happens to you.'
      },
      dedicatedDevice: {
        title: 'Dedicated Device',
        text: 'Use a dedicated device for Bitcoin transactions. Air-gapped computers provide the highest security for signing transactions.'
      },
      utxoManagement: {
        title: 'UTXO Management',
        text: 'Learn coin control and UTXO management. Consolidate small UTXOs during low-fee periods to save on future transaction costs.'
      },
      securityReview: {
        title: 'Security Review',
        text: 'Review your security setup quarterly. Technology and best practices evolve - make sure your setup stays current.'
      },
      phishing: {
        title: 'Phishing Awareness',
        text: 'Be vigilant about phishing attacks. Bookmark official wallet websites and never click links in emails claiming to be from Bitcoin services.'
      },
      physicalSecurity: {
        title: 'Physical Security',
        text: "Consider physical security threats. Don't publicly disclose your Bitcoin holdings, and be cautious about who knows you own Bitcoin."
      }
    },

    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      continue: 'Continue',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      download: 'Download',
      email: 'Email',
      copy: 'Copy',
      copied: 'Copied!',
      show: 'Show',
      hide: 'Hide',
      upgrade: 'Upgrade',
      free: 'Free',
      premium: 'Premium',
      month: 'month',
      year: 'year',
      oneTime: 'one-time',
      perSession: 'per session',
      assessmentLimitEssential: 'You have already used your one Essential assessment. Purchase again to create a new one.',
      subscriptionExpired: 'Your subscription has expired. Renew to continue with full access.',
      oneTimePayment: 'One-time payment',
      monthlySubscription: 'Monthly subscription',
      saving: 'Saving...',
      saveChanges : 'Save Preferences'
    }
  },

  // SPANISH TRANSLATIONS
  es: {
    // Navigation
    nav: {
      dashboard: 'Panel',
      logout: 'Cerrar Sesión',
      login: 'Iniciar Sesión',
      signup: 'Registrarse',
      getStarted: 'Comenzar',
      learnMore: 'Saber Más'
    },

    // Landing Page
    landing: {
      // Hero Section
      heroBadge: 'SEGURIDAD ₿ITCOIN SIMPLIFICADA',
      heroLine1: 'Deja de Adivinar.',
      heroLine2: 'Asegura Tus Sats',
      heroLine3: 'De la Forma Correcta.',
      heroSubtitle: 'Una evaluación basada en cuestionario que te muestra exactamente cómo proteger tus llaves privadas. Sin tonterías. Sin recomendaciones de wallets. Solo consejos honestos de seguridad de compañeros Bitcoiners.',
      heroCta: 'Iniciar Evaluación Gratis',
      heroSecondaryCta: 'Ver Cómo Funciona',
      heroStats: {
        nonCustodial: 'Sin Custodia',
        nonCustodialValue: '100%',
        dataStored: 'Datos Almacenados',
        dataStoredValue: '0',
        privacyFirst: 'Privacidad Primero',
        privacyFirstValue: '∞'
      },

      // Mockup Card
      mockup: {
        title: 'Tu Puntuación de Seguridad',
        rec1: 'Hardware wallet detectada',
        rec2: 'Considera configuración multi-sig',
        rec3: 'Estrategia de respaldo sólida'
      },

      // Why Kyward Section (PVU)
      whyTitle: '¿Qué Hace Diferente a Kyward?',
      whySubtitle: 'No intentamos venderte una wallet. Estamos aquí para educarte sobre cómo asegurar lo que ya es tuyo.',
      whyCards: {
        personalized: {
          title: 'Evaluación Personalizada',
          description: 'Responde 10-15 preguntas sobre tu configuración actual. Obtén una puntuación de seguridad personalizada y recomendaciones adaptadas a TU situación.'
        },
        zeroData: {
          title: 'Cero Almacenamiento de Datos',
          description: 'Tus respuestas nunca salen de tu dispositivo. No almacenamos, rastreamos ni vendemos tus datos. Nunca.'
        },
        education: {
          title: 'Educación Primero',
          description: 'Aprende POR QUÉ cada recomendación importa. Entiende las compensaciones. Toma decisiones informadas.'
        },
        noWallet: {
          title: 'Sin Promoción de Wallets',
          description: 'No estamos afiliados a ningún proveedor de wallets. Nuestras recomendaciones se basan únicamente en las mejores prácticas de seguridad.'
        }
      },

      // How It Works Section
      howTitle: 'Cómo Funciona',
      howSubtitle: 'Tres simples pasos hacia mejor seguridad',
      howSteps: {
        step1: {
          number: '01',
          title: 'Toma la Evaluación',
          description: 'Responde preguntas sobre tus métodos actuales de almacenamiento de Bitcoin y hábitos de seguridad. Solo toma 5 minutos.'
        },
        step2: {
          number: '02',
          title: 'Obtén Tu Puntuación',
          description: 'Recibe una puntuación de seguridad personalizada del 0-100 con un desglose detallado de tus fortalezas y debilidades.'
        },
        step3: {
          number: '03',
          title: 'Sigue el Plan',
          description: 'Obtén un plan de acción paso a paso con recomendaciones priorizadas adaptadas a tu nivel de seguridad.'
        }
      },

      // Pricing Section
      pricingTitle: 'Precios Simples y Honestos',
      pricingSubtitle: 'Sin cargos ocultos. Sin suscripciones sorpresa. Paga una vez, tuyo para siempre.',
      plans: {
        subtitle: 'Elige el plan que mejor se adapta a tus necesidades de seguridad',

        free: {
          badge: 'GRATIS',
          name: 'Gratis',
          price: '$0',
          period: '/siempre',
          features: [
            'Cuestionario de Seguridad',
            'Tu Puntaje de Seguridad',
            '1 Consejo de Seguridad Más Crítico'
          ],
          cta: 'Comenzar Evaluación Gratis'
        },

        essential: {
          badge: 'RECOMENDADO',
          name: 'Essential',
          price: '$7.99',
          period: '/pago único',
          features: [
            'Descarga completa del Informe en PDF',
            'Todas las Recomendaciones Personalizadas',
            'Guía de Planificación de Herencia',
            'Descargas ilimitadas de tu informe',
            'Solo una evaluación (recomprar para repetir)'
          ],
          cta: 'Obtener Essential ($7.99)'
        },

        sentinel: {
          badge: 'AVANZADO',
          name: 'Sentinel',
          price: '$14.99',
          period: '/mes',
          features: [
            'Evaluaciones Ilimitadas',
            'Alertas por email (noticias de seguridad y hacks)',
            'Consejos diarios de seguridad por email',
            'Todas las características de Essential',
            'Cancelar cuando quieras'
          ],
          cta: 'Suscribirse a Sentinel'
        },

        consultation: {
          badge: 'EXPERTO',
          name: 'Consulta',
          price: '$99',
          period: '+ $49/hora adicional',
          features: [
            'Auditoría privada de 1 hora (videollamada)',
            'Todas las características de Sentinel',
            'Recomendaciones personalizadas en profundidad',
            'Soporte prioritario',
            'Horas adicionales disponibles'
          ],
          cta: 'Reservar tu Consulta'
        }
      },

      footer: {
        tagline: 'Empoderando a Bitcoiners con consejos de seguridad honestos.',
        copyright: '© 2025 Kyward. Creado por Bitcoiners.'
      }
    },

    // Auth Form
    auth: {
      loginTitle: 'Bienvenido de Nuevo',
      loginSubtitle: 'Ingresa tus datos para acceder a tu panel',
      signupTitle: 'Crear Cuenta',
      signupSubtitle: 'Únete a Kyward y asegura tu legado Bitcoin',
      signupSuccess: '¡Cuenta creada exitosamente! Bienvenido al nivel Gratis. Puedes mejorar a Essential, Sentinel o Consulta en cualquier momento desde tu Panel.',
      forgotTitle: 'Olvidé mi Contraseña',
      forgotSubtitle: 'Ingresa tu email para restablecer tu contraseña',
      resetTitle: 'Restablecer Contraseña',
      resetSubtitle: 'Crea una nueva contraseña para',

      email: 'Correo Electrónico',
      password: 'Contraseña',
      confirmPassword: 'Confirmar Contraseña',
      newPassword: 'Nueva Contraseña',
      confirmNewPassword: 'Confirmar Nueva Contraseña',

      loginButton: 'Iniciar Sesión',
      signupButton: 'Crear Cuenta',
      verifyEmail: 'Verificar Email',
      resetButton: 'Restablecer Contraseña',

      forgotLink: '¿Olvidaste tu contraseña?',
      noAccount: '¿No tienes una cuenta?',
      hasAccount: '¿Ya tienes una cuenta?',
      backToLogin: 'Volver al Login',
      back: 'Volver',

      passwordRequirements: {
        title: 'La contraseña debe tener:',
        minLength: '8+ caracteres',
        uppercase: 'Letra mayúscula',
        lowercase: 'Letra minúscula',
        number: 'Número'
      },
      passwordStrength: {
        weak: 'Débil',
        fair: 'Regular',
        good: 'Buena',
        strong: 'Fuerte'
      },
      passwordsMatch: 'Las contraseñas coinciden',
      passwordsNoMatch: 'Las contraseñas no coinciden',

      errors: {
        invalidCredentials: 'Email o contraseña inválidos',
        emailExists: 'El email ya existe',
        emailNotFound: 'No se encontró una cuenta con este email',
        passwordRequirements: 'Por favor cumple todos los requisitos de contraseña'
      },

      success: {
        accountCreated: '¡Cuenta creada! Iniciando sesión...',
        passwordReset: '¡Contraseña restablecida! Ya puedes iniciar sesión.',
        emailVerified: '¡Email verificado! Crea tu nueva contraseña.'
      },

      footer: 'Nivel gratuito incluido. Mejora más tarde para desbloquear reportes completos, evaluaciones ilimitadas y más.',

      statement: {
        part1: 'Comienza Gratis – No se requiere tarjeta de crédito.',
        part2: 'Todos los usuarios comienzan en el nivel gratuito. Mejora en cualquier momento a Essential ($7.99 pago único), Sentinel ($14.99/mes) o Consulta.',
      }
    },

    // Dashboard
    dashboard: {
      welcome: 'Bienvenido de nuevo,',
      welcomeUser: 'Bitcoiner',
      subtitle: 'Sigue tu progreso de seguridad Bitcoin',

      stats: {
        securityScore: 'Puntuación de Seguridad',
        assessments: 'Evaluaciones',
        plan: 'Plan',
        status: 'Estado',
        active: 'Activo',
        noScore: 'Sin puntuación aún'
      },

      comparison: {
        you: 'TÚ',
        avg: 'PROM',
        top: 'TOP'
      },

      quickActions: {
        title: 'Acciones Rápidas',
        downloadPdf: 'Descargar PDF',
        downloadDesc: 'Obtén tu plan de seguridad',
        emailReport: 'Enviar por Email',
        emailDesc: 'Enviar a tu correo',
        viewReport: 'Ver Reporte',
        viewDesc: 'Ver análisis completo',
        takeAssessment: 'Nueva Evaluación',
        assessmentDesc: 'Revisa tu progreso'
      },

      pdfPassword: {
        label: 'Contraseña PDF',
        show: 'Mostrar',
        hide: 'Ocultar',
        copy: 'Copiar',
        copied: '¡Copiado!'
      },

      upgrade: {
        title: 'Desbloquea Tu Plan Completo de Seguridad',
        description: 'Obtén evaluaciones ilimitadas, descarga tu reporte PDF personalizado y accede a tu plan completo de herencia.',
        features: {
          pdf: 'Descargar Reporte PDF',
          email: 'Enviar Reporte por Email',
          recommendations: 'Todas las Recomendaciones',
          inheritance: 'Plan de Herencia'
        },
        essentialButton: 'Obtener Essential - $7.99 pago único',
        sentinelButton: 'Suscribirse a Sentinel - $14.99/mes',
        cancelNote: 'Cancela cuando quieras',
        consultButton: 'Reservar Consulta - $99',
        sessionNote: 'Sesión de 1 hora',
        limitReached: 'Límite de evaluaciones alcanzado en tu plan actual.',
        upgradeForUnlimited: 'Mejora a Sentinel para evaluaciones ilimitadas.',
        essentialNote: 'Con Essential obtienes una sola evaluación. Recompra para hacer una nueva.'
      },

      cta: {
        firstAssessment: 'Toma Tu Primera Evaluación',
        newAssessment: '¿Listo para una nueva evaluación?',
        firstDesc: 'Responde 15 preguntas sobre tu seguridad Bitcoin para obtener tu puntuación personalizada y recomendaciones.',
        newDesc: 'Verifica si tus prácticas de seguridad han mejorado desde tu última evaluación.',
        startButton: 'Iniciar Evaluación',
        startNewButton: 'Iniciar Nueva Evaluación',
        limitButton: 'Límite Alcanzado',
        unlimitedNote: 'Tienes evaluaciones ilimitadas',
        upgradeNote: 'Mejora a Premium para evaluaciones ilimitadas'
      },

      dailyTip: 'Consejo del Día',

      history: {
        title: 'Historial de Evaluaciones',
        viewAll: 'Ver Todo',
        showLess: 'Ver Menos',
        score: 'Puntuación',
        date: 'Fecha',
        viewReport: 'Ver Reporte',
        premiumOnly: 'Función premium'
      },

      emailPreferences: 'Preferencias de Email',
      dailyTips: 'Consejos Diarios de Seguridad',
      securityAlerts: 'Alertas de Seguridad y notificaciones de hacks',
      monthlyReviews: 'Recordatorios mensuales de revisión de wallets'
    },

    // Questionnaire
    questionnaire: {
      progress: 'Pregunta',
      of: 'de',
      complete: 'Completado',
      selectAll: 'Selecciona todas las que apliquen',

      previous: 'Anterior',
      next: 'Siguiente',
      getScore: 'Obtener Mi Puntuación',
      calculating: 'Calculando...',
      cancel: 'Cancelar Evaluación',

      questions: {
        q1: '¿Usas una hardware wallet para almacenar tu Bitcoin?',
        q2: '¿Con qué frecuencia haces respaldo de tu frase semilla?',
        q3: '¿Dónde guardas el respaldo de tu frase semilla?',
        q4: '¿Usas una frase de paso (palabra 25) con tu semilla?',
        q5: '¿Has probado el proceso de recuperación de tu wallet?',
        q6: '¿Usas configuración multi-firma (multisig)?',
        q7: '¿Cómo verificas las direcciones de recepción?',
        q8: '¿Cuánto de tu Bitcoin está en almacenamiento frío?',
        q9: '¿Reutilizas direcciones de Bitcoin?',
        q10: '¿Cómo manejas las actualizaciones de software de tus wallets?',
        q11: '¿Has compartido tu frase semilla con alguien?',
        q12: '¿Usas un dispositivo dedicado para transacciones Bitcoin?',
        q13: '¿Cómo planeas pasar tu Bitcoin a herederos?',
        q14: '¿Usas control de monedas y gestión de UTXOs?',
        q15: '¿Con qué frecuencia revisas tu configuración de seguridad?'
      },

      answers: {
        q1: {
          yes: 'Sí, uso una hardware wallet',
          sometimes: 'A veces, para cantidades grandes',
          no: 'No, uso wallet de software/móvil'
        },
        q2: {
          multiple: 'Múltiples ubicaciones seguras',
          single: 'Una ubicación segura',
          digital: 'Digitalmente (nube/foto)',
          none: 'Sin respaldo aún'
        },
        q3: {
          metal: 'Respaldo en metal (resistente al fuego)',
          paper: 'Papel en lugar seguro',
          bank_vault: 'Caja de seguridad bancaria',
          home_safe: 'Caja fuerte en casa',
          memorized: 'Solo memorizado'
        },
        q4: {
          yes_separate: 'Sí, guardada por separado',
          yes_together: 'Sí, guardada con la semilla',
          no: 'Sin frase de paso'
        },
        q5: {
          yes_multiple: 'Sí, múltiples veces',
          yes_once: 'Sí, una vez',
          no: 'No, nunca lo he probado'
        },
        q6: {
          yes_3of5: 'Sí, 3-de-5 o superior',
          yes_2of3: 'Sí, 2-de-3',
          considering: 'Lo estoy considerando',
          no: 'No, firma única'
        },
        q7: {
          hardware: 'En la pantalla de la hardware wallet',
          multiple_sources: 'Comparo múltiples fuentes',
          copy_paste: 'Solo copiar-pegar',
          dont_verify: 'No verifico'
        },
        q8: {
          all: '90-100% (solo dinero para gastar en hot)',
          most: '50-90%',
          some: '10-50%',
          none: 'Todo en hot wallets/exchanges'
        },
        q9: {
          never: 'Nunca, siempre uso direcciones nuevas',
          rarely: 'Raramente',
          often: 'Frecuentemente reutilizo direcciones'
        },
        q10: {
          verify_signatures: 'Verifico firmas, leo notas de versión',
          official_only: 'Solo de fuentes oficiales',
          auto_update: 'Actualización automática activada',
          rarely_update: 'Raramente actualizo'
        },
        q11: {
          never: 'Nunca, ni siquiera familia',
          trusted_person: 'Solo un familiar de confianza',
          multiple: 'Múltiples personas saben',
          online: 'Guardada digitalmente/online'
        },
        q12: {
          yes_airgapped: 'Sí, dispositivo air-gapped',
          yes_dedicated: 'Sí, dedicado pero conectado',
          separate_phone: 'Teléfono/tablet separado',
          main_device: 'No, uso mi dispositivo principal'
        },
        q13: {
          documented_plan: 'Plan de herencia documentado',
          family_knows: 'La familia sabe dónde encontrar info',
          no_plan: 'Sin plan aún',
          not_considered: 'No lo he considerado'
        },
        q14: {
          advanced: 'Sí, gestiono activamente UTXOs',
          basic: 'Entendimiento básico, a veces uso',
          heard: 'He oído de ello, no uso',
          unfamiliar: 'No conozco el concepto'
        },
        q15: {
          quarterly: 'Cada 3 meses',
          yearly: 'Una vez al año',
          rarely: 'Raramente reviso',
          never: 'Nunca he revisado'
        }
      },

      errors: {
        limitReached: 'Límite mensual alcanzado. Mejora a premium.',
        savingError: 'Error al guardar la evaluación'
      }
    },

    // Report
    report: {
      title: 'Tu Reporte de Seguridad',
      subtitle: 'Basado en tus respuestas, aquí está tu análisis personalizado de seguridad Bitcoin.',
      badge: 'Evaluación de Seguridad Completada',

      score: {
        label: 'Puntuación de Seguridad',
        outOf: '/100',
        excellent: 'Seguridad Excelente',
        good: 'Seguridad Moderada',
        needsWork: 'Necesita Mejoras',
        critical: 'Crítico',
        excellentDesc: 'Tus prácticas de seguridad Bitcoin son excelentes. Enfócate en optimización y planificación de herencia.',
        goodDesc: 'Tienes una base sólida, pero hay áreas importantes por mejorar.',
        needsWorkDesc: 'Tu Bitcoin está en riesgo significativo. Sigue las recomendaciones a continuación inmediatamente.'
      },

      comparison: {
        title: 'Cómo Te Comparas con Otros Bitcoiners',
        badge: 'Compara con la Comunidad Bitcoin',
        yourScore: 'TU PUNTUACIÓN',
        communityAvg: 'PROMEDIO COMUNIDAD',
        percentile: 'TU PERCENTIL',
        betterThan: 'Mejor que el',
        ofUsers: '% de usuarios',
        aboveAvg: 'sobre prom.',
        belowAvg: 'bajo prom.',
        atAvg: 'en prom.',
        points: 'pts',
        greatJob: '¡Buen trabajo!',
        roomForImprovement: '¡Hay espacio para mejorar!',
        rightAtAverage: '¡Justo en el promedio!',
        yourScoreIs: 'Tu puntuación de seguridad está',
        theAverage: 'el Bitcoin holder promedio.',
        keepImproving: 'Sigue mejorando para alcanzar el nivel superior.',
        pointsBelow: 'Tu puntuación está',
        pointsBelowAvg: 'puntos bajo el promedio.',
        followRecs: 'Sigue las recomendaciones a continuación para mejorar tu seguridad.',
        onParWith: 'Estás a la par con la mayoría de Bitcoin holders.',
        takeAction: 'Toma acción en las recomendaciones para destacar del resto.'
      },

      distribution: {
        title: 'DISTRIBUCIÓN DE PUNTUACIONES ENTRE BITCOINERS',
        needsWork: 'Necesita Mejoras',
        average: 'Promedio',
        good: 'Bueno',
        excellent: 'Excelente',
        youAreHere: 'Estás aquí'
      },

      freeUserSummary: {
        found: 'TU EVALUACIÓN ENCONTRÓ',
        criticalIssues: 'Problemas Críticos',
        totalRecs: 'Recomendaciones Totales',
        freeTips: 'Consejos Gratis Abajo'
      },

      recommendations: {
        freeTitle: 'Tus Consejos de Seguridad Gratuitos',
        premiumTitle: 'Tu Plan de Acción Completo',
        freeSubtitle: 'Aquí hay 3 consejos para comenzar. Mejora para desbloquear todas las',
        freeSubtitle2: 'recomendaciones.',
        premiumSubtitle: 'recomendaciones personalizadas basadas en tus respuestas',
        clickExpand: 'Clic para expandir',
        clickCollapse: 'Clic para colapsar',

        priority: {
          critical: 'CRÍTICO',
          high: 'ALTO',
          medium: 'MEDIO',
          low: 'BAJO'
        },

        locked: 'Más Recomendaciones Bloqueadas',
        lockedDesc: 'Mejora para desbloquear todas las recomendaciones personalizadas de seguridad',
        unlock: 'Desbloquear',
        recommendations: 'recomendaciones',
        moreRecommendations: 'más recomendaciones personalizadas...'
      },

      upgrade: {
        title: 'Desbloquea Tu Plan Completo de Seguridad y Herencia',
        subtitle: 'No solo conozcas tu puntuación - aprende exactamente cómo solucionar cada problema y proteger tu Bitcoin por generaciones.',

        benefits: {
          recommendations: {
            title: 'Todas las Recomendaciones',
            description: 'Instrucciones detalladas paso a paso para cada mejora de seguridad, priorizadas por urgencia.'
          },
          pdf: {
            title: 'PDF Protegido con Contraseña',
            description: 'Descarga o recibe por email un documento seguro que puedes guardar offline y consultar cuando quieras.'
          },
          inheritance: {
            title: 'Plan de Herencia Completo',
            description: 'Guía paso a paso para asegurar que tu Bitcoin pase a tus herederos de forma segura usando Liana time-locks.'
          },
          multisig: {
            title: 'Guía de Configuración Multi-Firma',
            description: 'Aprende a configurar multisig 2-de-3 para máxima seguridad con Sparrow Wallet.'
          },
          sparrow: {
            title: 'Tutorial de Sparrow Wallet',
            description: 'Guía completa para configurar y usar Sparrow Wallet para máxima soberanía.'
          },
          unlimited: {
            title: 'Re-Evaluaciones Ilimitadas',
            description: 'Sigue tu progreso a lo largo del tiempo. Repite la evaluación cuando quieras.'
          }
        },

        pdfPreview: {
          title: 'Tu Plan Personal de Seguridad y Herencia',
          subtitle: 'Documento protegido con contraseña listo para descargar',
          contents: [
            'Resumen Ejecutivo',
            'Desglose de Puntuación',
            'Todas las Recomendaciones',
            'Guía de Sparrow',
            'Instrucciones Multisig',
            'Configuración de Herencia Liana',
            'Estrategias de Respaldo',
            'Lista de Acciones'
          ]
        },

        urgency: {
          message: 'Tienes',
          issues: 'problemas de prioridad crítica/alta.',
          cta: 'Obtén tu plan completo ahora para proteger tu Bitcoin antes de que sea demasiado tarde.'
        },

        trustBadges: {
          bitcoin: 'Paga con Bitcoin',
          noKyc: 'Sin KYC',
          instant: 'Acceso Instantáneo',
          private: '100% Privado'
        }
      },

      premium: {
        downloadPdf: 'Descarga Tu Plan de Herencia (PDF)',
        pdfDescription: 'Plan completo con guías de Sparrow, Liana, configuración multisig e instrucciones paso a paso.',
        downloadButton: 'Descargar PDF',
        pdfPassword: 'Contraseña PDF',
        show: 'Mostrar',
        hide: 'Ocultar',
        copy: 'Copiar',
        copied: '¡Copiado!',
        emailNote: 'El PDF será enviado a',
        withPassword: 'con esta contraseña.',
        previewEmail: 'Vista Previa Email',
        sendingEmail: 'Enviando...',
        emailSent: '¡Email Enviado!',
        sendEmail: 'Enviar Reporte al Email'
      },

      backToDashboard: 'Volver al Panel'
    },

    // Payment Modal
    payment: {
      generating: 'Generando Pago...',
      generatingDesc: 'Creando tu dirección de pago Bitcoin',

      title: 'Pagar con Bitcoin',
      subtitle: 'Escanea el código QR o copia la dirección',

      amount: 'Monto',
      address: 'Dirección Bitcoin',

      priceUpdates: 'El precio se actualiza en:',
      priceExpired: 'Precio expirado',
      updatingPrice: 'Actualizando precio...',
      refreshNow: 'Actualizar Ahora',

      waiting: 'Esperando pago...',
      expiresIn: 'El pago expira en:',

      copyAddress: 'Copiar Dirección',
      copied: '¡Copiado!',
      simulateDemo: 'Simular Pago (Demo)',
      cancel: 'Cancelar',

      // Success
      confirmed: '¡Pago Confirmado!',
      planActive: 'Tu {plan} ya está activo',
      yourPassword: 'TU CONTRASEÑA PDF',
      savePassword: '¡Guarda esta contraseña! La necesitarás para abrir tu PDF de seguridad.',
      continueToReport: 'Continuar al Reporte',
      paymentActivatedSubscription: 'Tu suscripción mensual está activa.<br/>Ahora tienes evaluaciones ilimitadas, alertas por email y todas las funciones avanzadas.<br/>Puedes cancelar cuando quieras desde tu panel.',
      paymentActivatedOneTime: 'Tu pago único se completó correctamente.<br/>Ya tienes acceso completo a tu reporte PDF y recomendaciones.',
      essentialRepurchaseNote: '<strong>Nota:</strong> Para realizar una nueva evaluación, deberás comprar Essential nuevamente ($7.99).',
      consultationBooked: 'Tu sesión de consulta ha sido reservada.<br/>Recibirás los detalles y enlace en tu correo pronto.',

      // Expired
      expired: 'Pago Expirado',
      expiredDesc: 'La ventana de pago se ha cerrado. Por favor intenta de nuevo.',

      // Error
      error: 'Error de Pago',
      errorDesc: 'Algo salió mal. Por favor intenta de nuevo.',

      tryAgain: 'Intentar de Nuevo',
      close: 'Cerrar'
    },

    // Daily Tips
    tips: {
      seedPhrase: {
        title: 'Seguridad de Frase Semilla',
        text: 'Nunca compartas tu frase semilla de 24 palabras con nadie, incluyéndonos. Kyward nunca te pedirá tus llaves o información privada.'
      },
      hardwareWallet: {
        title: 'Mejores Prácticas de Hardware Wallet',
        text: 'Siempre verifica las direcciones de recepción en la pantalla de tu hardware wallet antes de enviar Bitcoin. Nunca confíes solo en las direcciones mostradas en tu computadora.'
      },
      backupRedundancy: {
        title: 'Redundancia de Respaldo',
        text: 'Guarda el respaldo de tu frase semilla en al menos 2 ubicaciones geográficamente separadas. Considera usar placas de metal para resistencia al fuego y agua.'
      },
      passphrase: {
        title: 'Protección con Frase de Paso',
        text: 'Considera usar una palabra 25 (frase de paso) con tu frase semilla. Guárdala separada de tu semilla para máxima seguridad.'
      },
      testRecovery: {
        title: 'Prueba Tu Recuperación',
        text: 'Periódicamente prueba el proceso de recuperación de tu wallet con una pequeña cantidad. Mejor descubrir problemas ahora que durante una emergencia.'
      },
      multisig: {
        title: 'Seguridad Multisig',
        text: 'Para cantidades significativas, considera una configuración multisig 2-de-3. Protege contra puntos únicos de falla y amenazas físicas.'
      },
      coldStorage: {
        title: 'Prioridad de Almacenamiento Frío',
        text: 'Mantén el 90%+ de tu Bitcoin en almacenamiento frío. Solo mantén pequeñas cantidades en hot wallets para transacciones regulares.'
      },
      addressPrivacy: {
        title: 'Privacidad de Direcciones',
        text: 'Nunca reutilices direcciones de Bitcoin. Usar direcciones nuevas para cada transacción mejora significativamente tu privacidad financiera.'
      },
      softwareUpdates: {
        title: 'Actualizaciones de Software',
        text: 'Siempre verifica las firmas del software antes de actualizar tu wallet. Descarga solo de fuentes oficiales y verifica firmas GPG.'
      },
      inheritance: {
        title: 'Planificación de Herencia',
        text: 'Documenta tu plan de herencia Bitcoin. Tus herederos deben saber cómo acceder a tu Bitcoin si algo te sucede.'
      },
      dedicatedDevice: {
        title: 'Dispositivo Dedicado',
        text: 'Usa un dispositivo dedicado para transacciones Bitcoin. Las computadoras air-gapped proporcionan la mayor seguridad para firmar transacciones.'
      },
      utxoManagement: {
        title: 'Gestión de UTXOs',
        text: 'Aprende control de monedas y gestión de UTXOs. Consolida UTXOs pequeños durante períodos de bajas comisiones para ahorrar en costos futuros.'
      },
      securityReview: {
        title: 'Revisión de Seguridad',
        text: 'Revisa tu configuración de seguridad trimestralmente. La tecnología y las mejores prácticas evolucionan - asegúrate de que tu configuración se mantenga actualizada.'
      },
      phishing: {
        title: 'Conciencia sobre Phishing',
        text: 'Mantente alerta sobre ataques de phishing. Guarda en favoritos los sitios oficiales de wallets y nunca hagas clic en enlaces de emails que dicen ser de servicios Bitcoin.'
      },
      physicalSecurity: {
        title: 'Seguridad Física',
        text: 'Considera las amenazas de seguridad física. No divulgues públicamente tus tenencias de Bitcoin, y ten cuidado con quién sabe que posees Bitcoin.'
      }
    },

    // Common
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      save: 'Guardar',
      cancel: 'Cancelar',
      close: 'Cerrar',
      continue: 'Continuar',
      back: 'Volver',
      next: 'Siguiente',
      previous: 'Anterior',
      submit: 'Enviar',
      download: 'Descargar',
      email: 'Email',
      copy: 'Copiar',
      copied: '¡Copiado!',
      show: 'Mostrar',
      hide: 'Ocultar',
      upgrade: 'Mejorar',
      free: 'Gratis',
      premium: 'Premium',
      month: 'mes',
      year: 'año',
      oneTime: 'único pago',
      perSession: 'por sesión',
      assessmentLimitEssential: 'Ya usaste tu única evaluación Essential. Compra de nuevo para crear una nueva.',
      subscriptionExpired: 'Tu suscripción ha expirado. Renueva para continuar con acceso completo.',
      oneTimePayment: 'Pago único',
      monthlySubscription: 'Suscripción mensual',
      saving: 'Guardando...',
      saveChanges : 'Preferencias Guardadas'
    }
  }
};

export default translations;
