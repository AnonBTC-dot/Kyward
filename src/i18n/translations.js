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
          description: 'Answer 15 questions about your current setup. Get a custom security score and actionable recommendations tailored to YOUR situation.'
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

    // PDF Report
    pdf: {
      title: 'Bitcoin Security & Inheritance Plan',
      confidential: 'CONFIDENTIAL - STORE SECURELY',
      generatedFor: 'Personalized for',
      generatedOn: 'Generated',

      score: {
        excellent: 'Excellent Security',
        moderate: 'Moderate Security',
        needsImprovement: 'Needs Improvement'
      },

      sections: {
        executiveSummary: 'Executive Summary',
        currentSetup: 'Current Setup Analysis',
        priorityRecommendations: 'Priority Recommendations',
        walletSetup: 'Recommended Wallet Setup',
        inheritanceStrategy: 'Inheritance Strategy',
        backupStrategy: 'Backup Strategy',
        actionPlan: 'Your Action Plan',
        securityChecklist: 'Quarterly Security Review Checklist',
        annualReview: 'Annual Review'
      },

      currentSetup: {
        hardwareWallet: 'Hardware Wallet',
        metalBackup: 'Metal Backup',
        passphrase: 'Passphrase',
        multiSignature: 'Multi-signature',
        coldStorage: 'Cold Storage',
        inheritancePlan: 'Inheritance Plan',
        yes: 'Yes',
        no: 'No',
        criticalRisk: 'No - Critical Risk',
        recommended: 'No - Recommended',
        documented: 'Documented',
        notDocumented: 'Not Documented - Critical',
        ofHoldings: 'of holdings'
      },

      sparrow: {
        title: 'Primary Wallet Recommendation: Sparrow Wallet',
        description: 'Sparrow is a desktop Bitcoin wallet focused on security, privacy, and self-custody. It excels at both single-signature and multi-signature setups.',
        download: 'Download',
        setupSteps: 'Setup Steps',
        steps: [
          'Download from official website only',
          'Verify the GPG signature before installing',
          'Connect your hardware wallet via USB',
          'Create new wallet or import existing',
          'Enable Tor for enhanced privacy (optional but recommended)',
          'Always verify addresses on your hardware wallet screen'
        ]
      },

      coldStorage: {
        title: 'Cold Storage Wallet Options (Bitcoin Mainnet)',
        description: 'For long-term cold storage (minimal interaction, maximum security), consider these mobile/desktop wallets designed specifically for Bitcoin mainnet use:',
        blueWallet: 'Mobile-first, supports watch-only mode, Lightning + on-chain, easy to use for cold storage with air-gapped signing via PSBT export/import.',
        jade: 'Hardware wallet with strong cold storage capabilities (air-gapped via QR codes), fully open-source, integrates well with Green wallet or Sparrow for offline signing.',
        bullBitcoin: 'Focused on non-KYC Bitcoin privacy, supports cold storage setups with strong emphasis on self-custody and Canadian-friendly features (good for geographic diversification).',
        bestPractice: 'Best Practice',
        bestPracticeText: 'Use in watch-only mode on online device, sign offline/air-gapped, never expose private keys online.'
      },

      paths: {
        chooseTitle: 'Choose Your Security & Inheritance Path',
        chooseDesc: 'You have two strong options depending on your needs: active management with multisig (Sparrow) or automated trustless inheritance (Liana). Both paths are detailed below so you can compare them.',

        sparrow: {
          title: 'Path 1: Multisig with Sparrow (Best for Active Management)',
          description: 'Use Sparrow to create a 2-of-3 multisig setup for maximum security against loss or theft while maintaining full control.',
          hardware: 'Recommended Hardware',
          device: 'Device',
          purpose: 'Purpose',
          location: 'Location Suggestion',
          coldcard: 'Primary signing device',
          coldcardLocation: 'With you (home safe)',
          bitbox: 'Secondary device',
          bitboxLocation: 'Bank safety deposit box/Office/Partners Office',
          jade: 'Inheritance / backup device',
          jadeLocation: 'Trusted heir/lawyer/Close Family',
          setupSteps: 'Setup Steps in Sparrow',
          steps: [
            'Create keystore for each hardware wallet',
            'File → New Wallet → Multi Signature',
            'Set threshold to 2-of-3',
            'Import all three xpubs',
            'Verify all devices show the same addresses',
            'Send a small test transaction',
            'Document everything for inheritance'
          ],
          bestFor: 'Best for',
          bestForText: 'Users who want full control, frequent transactions, and strong protection against single-point failures.'
        },

        liana: {
          title: 'Path 2: Time-locked Inheritance with Liana (Best for Hands-off Inheritance)',
          description: 'Liana adds automatic inheritance via time-locks — if you don\'t move funds for a set period, a recovery key (held by your heir) can access them. No third party required.',
          website: 'Website',
          howItWorks: 'How It Works',
          steps: [
            'Set up primary key (your hardware wallet)',
            'Set up recovery key (heir\'s hardware wallet)',
            'Define a timelock (e.g., 365 days of inactivity)',
            'After timelock expires, recovery key can spend',
            'Your regular transactions automatically reset the timer',
            'Fully trustless — no one can access funds early'
          ],
          considerations: 'Important Considerations',
          considerationsList: [
            'Recovery key holder cannot access funds before timelock',
            'You must make occasional transactions to prevent accidental activation',
            'Consider 180-day timelock with calendar reminders for check-ins',
            'Heir needs basic technical ability or very clear written instructions'
          ],
          bestFor: 'Best for',
          bestForText: 'Users who want automatic, trustless inheritance without relying on lawyers or services, even if it means less frequent manual control.'
        }
      },

      inheritance: {
        bothPathsValid: 'Both paths (Sparrow multisig or Liana time-lock) are valid and secure. Choose based on whether you prefer active control or automated inheritance protection.',
        documentation: 'Documentation for Heirs',
        documentationDesc: 'Prepare the following documents and store them securely:',
        documents: [
          'Letter of Explanation: What Bitcoin is and why it\'s valuable',
          'Asset List: Approximate holdings (not exact amounts)',
          'Hardware Locations: Where devices are stored',
          'Recovery Instructions: Step-by-step guide for non-technical heirs',
          'Contact List: Technical people who can help if needed'
        ]
      },

      backup: {
        passphraseTitle: 'Passphrase Generation (Most Secure Method)',
        passphraseDesc: 'Use physical dice for true randomness — never generate digitally.',
        passphraseSteps: [
          'Get 5 standard six-sided dice',
          'Roll all dice and note the numbers in order',
          'Concatenate into a 5-digit number (e.g., 14263)',
          'Find the matching word in the official BIP39 English wordlist (print it offline)',
          'Repeat 3–5 times to create your passphrase (e.g., "apple zebra moon river stone")',
          'Write it on paper and store securely in separate locations'
        ],
        seedStorage: 'Seed Phrase Storage - 2-of-3 Split Knowledge Model',
        seedStorageDesc: 'To achieve maximum security, we use a 2-of-3 recovery model: your seed phrase and passphrase are split across 3 separate locations. No single location contains both. If one location is lost or compromised, the other two allow full recovery. If only one is found, the funds remain inaccessible.',
        exactDistribution: 'Exact Distribution (follow this exactly):',
        location1: 'Location 1 (Home safe or personal secure spot):',
        location1Items: ['Seed phrase copy #1', 'Passphrase copy #2', 'Passphrase copy #3'],
        location2: 'Location 2 (Bank safety deposit box, office safe, or custodian):',
        location2Items: ['Seed phrase copy #2', 'Passphrase copy #3', 'Passphrase copy #1'],
        location3: 'Location 3 (Trusted family member, partner, or secondary property):',
        location3Items: ['Seed phrase copy #3', 'Passphrase copy #1', 'Passphrase copy #2'],
        recoveryWorks: 'How Recovery Works (examples):',
        recoveryExamples: [
          'If Location 1 is lost → Use Location 2 + Location 3',
          'If Location 2 is compromised → Use Location 1 + Location 3',
          'If Location 3 is inaccessible → Use Location 1 + Location 2'
        ],
        physicalSecurity: 'Physical Security Requirement',
        physicalSecurityText: 'Use tamper-evident security bags (sealed bags that break when opened) in all 3 locations. If any bag is damaged or shows signs of tampering, immediately create new backups and move funds to a new wallet.',
        additionalRecs: 'Additional Recommendations',
        additionalRecsList: [
          'Never store seed and its own passphrase in the same location',
          'Label each backup clearly (e.g., "Seed #1 - Do not open unless emergency")',
          'Use metal plates (Cryptosteel, Billfodl) or acid-free archival paper',
          'Test readability of all backups before sealing'
        ],
        passphraseStorage: 'Passphrase Storage',
        passphraseStorageList: [
          'Written on paper (never memorized only)',
          'Store backup separately from seed phrase (never in same location)',
          'Never store passphrase with seed phrase in any location'
        ],
        docStorage: 'Documentation Storage',
        docStorageList: [
          'Physical copy in sealed envelope in a secure place of your choice',
          'Check annually or when setup changes'
        ]
      },

      actionPlan: {
        description: 'Below are the detailed action plans for both paths. You can follow the one that best matches your preference (or compare them).',
        sparrowTitle: 'Path 1: Sparrow Multisig Action Plan (Active Control)',
        sparrowDesc: 'Steps if you choose multisig management with Sparrow Wallet.',
        lianaTitle: 'Path 2: Liana Time-lock Action Plan (Automated Inheritance)',
        lianaDesc: 'Steps if you choose time-locked inheritance with Liana Wallet.'
      },

      checklist: {
        quarterly: [
          'Verify backup locations are secure and accessible',
          'Test that seed phrase backups are readable',
          'Update wallet software (verify signatures first)',
          'Review transaction history for anomalies',
          'Check hardware wallet firmware is current',
          'Update inheritance documentation if needed',
          'Confirm heirs know how to reach this documentation'
        ],
        annual: [
          'Full recovery test on secondary device',
          'Consider upgrading security setup',
          'Update estate planning documents',
          'Review overall security posture'
        ]
      },

      footer: {
        tagline: 'Bitcoin Security Made Simple',
        confidentialNote: 'This document is confidential. Store it securely and never share your seed phrase.'
      },

      quickActionPlans: {
        title: 'Quick Action Plans - Sentinel',
        description: 'With Sentinel, you can add a query whenever you want to monitor your Bitcoin security setup and receive real-time alerts.',
        pricing: 'Pricing Structure',
        time: 'Time',
        cost: 'Cost',
        firstHour: 'First hour',
        subsequentHours: 'Subsequent hours',
        perHour: '/hour',
        features: 'Features included:',
        featuresList: [
          'Add custom queries anytime',
          'Real-time monitoring and alerts',
          'On-demand security analysis',
          'Flexible hourly support'
        ]
      }
    },

    // PDF Recommendations (translated)
    pdfRecommendations: {
      hardware_wallet: {
        title: 'Use a Hardware Wallet',
        shortTip: 'Move your Bitcoin to a hardware wallet for maximum security.'
      },
      seed_backup_metal: {
        title: 'Create Metal Seed Backup',
        shortTip: 'Store your seed phrase on metal for fire/water protection.'
      },
      multiple_backups: {
        title: 'Distribute Backup Locations',
        shortTip: 'Store seed phrase copies in multiple secure locations.'
      },
      passphrase_setup: {
        title: 'Add a Passphrase (25th Word)',
        shortTip: 'Add an extra layer of security with a BIP39 passphrase.'
      },
      recovery_test: {
        title: 'Test Your Recovery Process',
        shortTip: 'Verify you can actually recover your wallet from backup.'
      },
      multisig_setup: {
        title: 'Consider Multi-Signature Setup',
        shortTip: 'Require multiple keys to spend your Bitcoin for ultimate security.'
      },
      address_verification: {
        title: 'Always Verify Addresses on Device',
        shortTip: 'Confirm receiving addresses on your hardware wallet screen.'
      },
      cold_storage: {
        title: 'Move More Bitcoin to Cold Storage',
        shortTip: 'Keep 90%+ of your Bitcoin in cold storage, not on exchanges.'
      },
      address_reuse: {
        title: 'Stop Reusing Bitcoin Addresses',
        shortTip: 'Use a new address for each transaction to protect your privacy.'
      },
      verify_updates: {
        title: 'Verify Software Signatures',
        shortTip: 'Always verify cryptographic signatures before updating wallet software.'
      },
      seed_security: {
        title: 'Never Share Your Seed Phrase',
        shortTip: 'Your seed phrase should be known only by you.'
      },
      dedicated_device: {
        title: 'Use a Dedicated Bitcoin Device',
        shortTip: 'Use a separate device for Bitcoin transactions to minimize attack surface.'
      },
      inheritance_plan: {
        title: 'Create an Inheritance Plan',
        shortTip: 'Ensure your Bitcoin can be accessed by heirs if something happens to you.'
      },
      utxo_management: {
        title: 'Learn UTXO Management',
        shortTip: 'Understanding coin control improves privacy and reduces fees.'
      },
      security_review: {
        title: 'Schedule Regular Security Reviews',
        shortTip: 'Review your security setup at least quarterly.'
      },
      priority: {
        critical: 'CRITICAL',
        high: 'HIGH',
        medium: 'MEDIUM',
        low: 'LOW'
      }
    },

    // Inheritance Plan Generation (Recommendations.js)
    inheritancePlanGen: {
      executiveSummary: {
        excellent: 'Your Bitcoin security score of {score} indicates an excellent setup. This plan will help you optimize your inheritance strategy and add the final layers of protection.',
        moderate: 'Your Bitcoin security score of {score} shows a moderate foundation. This plan addresses critical gaps and establishes a proper inheritance strategy.',
        needsWork: 'Your Bitcoin security score of {score} indicates significant vulnerabilities. This plan provides a complete security overhaul and establishes proper inheritance protocols.'
      },
      walletRecommendation: {
        primary: 'Sparrow Wallet',
        description: 'Sparrow is a desktop Bitcoin wallet focused on security and privacy. It supports all hardware wallets and is perfect for both singlesig and multisig setups.',
        downloadUrl: 'https://sparrowwallet.com',
        setupSteps: [
          'Download from official website (verify signature)',
          'Connect your hardware wallet via USB',
          'Create new wallet or import existing',
          'Enable Tor for privacy (optional but recommended)',
          'Verify receiving addresses on hardware wallet'
        ]
      },
      multisigPlan: {
        type: '2-of-3',
        description: 'A 2-of-3 multisig requires any 2 of 3 private keys to authorize a transaction. This protects against loss, theft, and single points of failure.',
        hardware: {
          coldcard: { device: 'Coldcard Mk4', purpose: 'Primary signing device (with you)', cost: '$150' },
          bitbox: { device: 'BitBox02', purpose: 'Secondary device (safety deposit)', cost: '$180' },
          jade: { device: 'Jade Wallet', purpose: 'Inheritance device (with heir/lawyer)', cost: '$150' }
        },
        setupSteps: [
          'Create first keystore with Coldcard',
          'Create second keystore with BitBox02',
          'Create third keystore with Jade Wallet',
          'In Sparrow: File > New Wallet > Multi Signature',
          'Set M of N to 2-of-3',
          'Import all three xpubs',
          'Verify addresses match on all devices',
          'Send small test transaction',
          'Document everything for inheritance'
        ]
      },
      inheritanceStrategy: {
        recommended: 'Liana Wallet',
        description: "Liana is a Bitcoin wallet with built-in inheritance through time-locked recovery paths. If you don't move your coins for a specified period, a recovery key can access them.",
        howItWorks: [
          'Set up primary key (your hardware wallet)',
          'Set up recovery key (heir\'s hardware wallet)',
          'Define timelock (e.g., 365 days of inactivity)',
          'After timelock, recovery key can spend',
          'Regular transactions reset the timer',
          'No third party needed - fully trustless'
        ],
        setupUrl: 'https://wizardsardine.com/liana/',
        considerations: [
          'Recovery key holder cannot access funds before timelock',
          'You must transact periodically to reset timer',
          'Consider shorter timelock (180 days) with regular check-in reminder',
          'Heir needs technical ability or clear instructions'
        ]
      },
      backupStrategy: {
        passphraseGeneration: {
          method: 'Dice-based Passphrase Creation',
          description: 'The best way to create a secure passphrase is using dice for true randomness. Roll 5 dice, convert the numbers to a word from the BIP39 wordlist. Repeat 3 or 5 times and that will be your passphrase.',
          steps: [
            'Gather 5 dice',
            'Roll them to get 5 numbers',
            'Concatenate the numbers (e.g., 1,4,2,6,3 → 14263)',
            'Look up the corresponding BIP39 word',
            'Repeat 3 or 5 times for the full passphrase',
            'Write it on paper and store securely'
          ]
        },
        seedPhrases: {
          storage: 'Metal backup plates or paper (as preferred)',
          model: '2-of-3 Recovery Model (Split Knowledge)',
          modelDescription: 'Distribute your seed phrase and passphrase across 3 locations. No single location contains both the seed phrase and its passphrase. This way, if one location is compromised, the attacker cannot access your funds. To recover, combine information from any two locations.',
          security: 'Use tamper-evident bags that must be damaged to open. This alerts you if backups have been accessed.',
          locations: [
            "Location 1: Home safe - Store seed phrase for Wallet 1 + passphrase copy for Wallet 2",
            "Location 2: Bank or office - Store seed phrase for Wallet 2 + passphrase copy for Wallet 3",
            "Location 3: Family home or partner's house - Store seed phrase for Wallet 3 + passphrase copy for Wallet 1"
          ],
          passphraseStorage: 'Written on paper and stored separately from seed phrases in each location'
        },
        documentation: {
          items: [
            'Written instructions for heirs (non-technical)',
            'Hardware wallet serial numbers and locations',
            'Wallet software used and version',
            'Derivation paths (BIP84 for native SegWit)',
            'Approximate holdings (for estate planning)'
          ],
          storage: 'Sealed envelope with family or trusted friend/lawyer'
        }
      },
      actionPlan: {
        purchaseHardware: { action: 'Purchase hardware wallet from official manufacturer', timeframe: 'This week', cost: '$150-200' },
        createMetalBackup: { action: 'Create metal seed backup (or paper if preferred)', timeframe: 'Within 2 weeks', cost: '$30-100' },
        generatePassphrase: { action: 'Generate and add passphrase using dice method', timeframe: 'Within 1 month', cost: 'Free' },
        setupMultisig: { action: 'Set up 2-of-3 multisig with Sparrow Wallet', timeframe: 'Within 2 months', cost: '$300-500 (additional hardware)' },
        implementLiana: { action: 'Implement Liana wallet for inheritance', timeframe: 'Within 3 months', cost: 'Free' },
        documentEverything: { action: 'Document everything and inform heirs (without revealing secrets)', timeframe: 'Ongoing', cost: 'Free' },
        lianaMultisig: { action: 'Set up Liana wallet multisign 2-3 with time-locked recovery (primary + recovery key)', cost: '$300-500 (additional hardware)' },
        lianaTimelock: { action: 'Define timelock period and test recovery simulation' }
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
      saveChanges : 'Save Preferences',
      unlimitedAccess: 'Unlimited assessments & features'
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
          description: 'Responde 15 preguntas sobre tu configuración actual. Obtén una puntuación de seguridad personalizada y recomendaciones adaptadas a TU situación.'
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

    // PDF Report
    pdf: {
      title: 'Plan de Seguridad y Herencia Bitcoin',
      confidential: 'CONFIDENCIAL - GUARDAR DE FORMA SEGURA',
      generatedFor: 'Personalizado para',
      generatedOn: 'Generado',

      score: {
        excellent: 'Seguridad Excelente',
        moderate: 'Seguridad Moderada',
        needsImprovement: 'Necesita Mejoras'
      },

      sections: {
        executiveSummary: 'Resumen Ejecutivo',
        currentSetup: 'Análisis de Configuración Actual',
        priorityRecommendations: 'Recomendaciones Prioritarias',
        walletSetup: 'Configuración de Wallet Recomendada',
        inheritanceStrategy: 'Estrategia de Herencia',
        backupStrategy: 'Estrategia de Respaldo',
        actionPlan: 'Tu Plan de Acción',
        securityChecklist: 'Lista de Verificación Trimestral de Seguridad',
        annualReview: 'Revisión Anual'
      },

      currentSetup: {
        hardwareWallet: 'Hardware Wallet',
        metalBackup: 'Respaldo en Metal',
        passphrase: 'Frase de Paso',
        multiSignature: 'Multi-firma',
        coldStorage: 'Almacenamiento Frío',
        inheritancePlan: 'Plan de Herencia',
        yes: 'Sí',
        no: 'No',
        criticalRisk: 'No - Riesgo Crítico',
        recommended: 'No - Recomendado',
        documented: 'Documentado',
        notDocumented: 'No Documentado - Crítico',
        ofHoldings: 'de tenencias'
      },

      sparrow: {
        title: 'Wallet Principal Recomendada: Sparrow Wallet',
        description: 'Sparrow es una wallet Bitcoin de escritorio enfocada en seguridad, privacidad y auto-custodia. Destaca tanto en configuraciones de firma única como multi-firma.',
        download: 'Descargar',
        setupSteps: 'Pasos de Configuración',
        steps: [
          'Descargar solo del sitio oficial',
          'Verificar la firma GPG antes de instalar',
          'Conectar tu hardware wallet vía USB',
          'Crear nueva wallet o importar existente',
          'Habilitar Tor para mayor privacidad (opcional pero recomendado)',
          'Siempre verificar direcciones en la pantalla de tu hardware wallet'
        ]
      },

      coldStorage: {
        title: 'Opciones de Wallet para Almacenamiento Frío (Bitcoin Mainnet)',
        description: 'Para almacenamiento frío a largo plazo (mínima interacción, máxima seguridad), considera estas wallets móviles/escritorio diseñadas específicamente para Bitcoin mainnet:',
        blueWallet: 'Enfocada en móvil, soporta modo watch-only, Lightning + on-chain, fácil de usar para almacenamiento frío con firma air-gapped vía exportación/importación de PSBT.',
        jade: 'Hardware wallet con fuertes capacidades de almacenamiento frío (air-gapped vía códigos QR), completamente open-source, se integra bien con Green wallet o Sparrow para firma offline.',
        bullBitcoin: 'Enfocada en privacidad Bitcoin sin KYC, soporta configuraciones de almacenamiento frío con fuerte énfasis en auto-custodia y características amigables para Canadá (bueno para diversificación geográfica).',
        bestPractice: 'Mejor Práctica',
        bestPracticeText: 'Usar en modo watch-only en dispositivo online, firmar offline/air-gapped, nunca exponer llaves privadas online.'
      },

      paths: {
        chooseTitle: 'Elige Tu Camino de Seguridad y Herencia',
        chooseDesc: 'Tienes dos opciones sólidas según tus necesidades: gestión activa con multisig (Sparrow) o herencia automatizada sin confianza (Liana). Ambos caminos se detallan a continuación para que puedas compararlos.',

        sparrow: {
          title: 'Camino 1: Multisig con Sparrow (Mejor para Gestión Activa)',
          description: 'Usa Sparrow para crear una configuración multisig 2-de-3 para máxima seguridad contra pérdida o robo manteniendo control total.',
          hardware: 'Hardware Recomendado',
          device: 'Dispositivo',
          purpose: 'Propósito',
          location: 'Ubicación Sugerida',
          coldcard: 'Dispositivo de firma primario',
          coldcardLocation: 'Contigo (caja fuerte en casa)',
          bitbox: 'Dispositivo secundario',
          bitboxLocation: 'Caja de seguridad bancaria/Oficina/Oficina de socio',
          jade: 'Dispositivo de herencia / respaldo',
          jadeLocation: 'Heredero de confianza/abogado/Familia cercana',
          setupSteps: 'Pasos de Configuración en Sparrow',
          steps: [
            'Crear keystore para cada hardware wallet',
            'Archivo → Nueva Wallet → Multi Firma',
            'Establecer umbral a 2-de-3',
            'Importar los tres xpubs',
            'Verificar que todos los dispositivos muestren las mismas direcciones',
            'Enviar una pequeña transacción de prueba',
            'Documentar todo para herencia'
          ],
          bestFor: 'Mejor para',
          bestForText: 'Usuarios que quieren control total, transacciones frecuentes y fuerte protección contra fallos de punto único.'
        },

        liana: {
          title: 'Camino 2: Herencia con Time-lock usando Liana (Mejor para Herencia Automatizada)',
          description: 'Liana añade herencia automática vía time-locks — si no mueves fondos por un período establecido, una llave de recuperación (en manos de tu heredero) puede acceder a ellos. No se requiere tercero.',
          website: 'Sitio Web',
          howItWorks: 'Cómo Funciona',
          steps: [
            'Configurar llave primaria (tu hardware wallet)',
            'Configurar llave de recuperación (hardware wallet del heredero)',
            'Definir un timelock (ej., 365 días de inactividad)',
            'Después de que expire el timelock, la llave de recuperación puede gastar',
            'Tus transacciones regulares reinician automáticamente el temporizador',
            'Completamente sin confianza — nadie puede acceder a los fondos antes'
          ],
          considerations: 'Consideraciones Importantes',
          considerationsList: [
            'El poseedor de la llave de recuperación no puede acceder a los fondos antes del timelock',
            'Debes hacer transacciones ocasionales para prevenir activación accidental',
            'Considera timelock de 180 días con recordatorios de calendario para check-ins',
            'El heredero necesita habilidad técnica básica o instrucciones escritas muy claras'
          ],
          bestFor: 'Mejor para',
          bestForText: 'Usuarios que quieren herencia automática y sin confianza sin depender de abogados o servicios, aunque signifique menos control manual frecuente.'
        }
      },

      inheritance: {
        bothPathsValid: 'Ambos caminos (multisig Sparrow o time-lock Liana) son válidos y seguros. Elige basándote en si prefieres control activo o protección de herencia automatizada.',
        documentation: 'Documentación para Herederos',
        documentationDesc: 'Prepara los siguientes documentos y guárdalos de forma segura:',
        documents: [
          'Carta de Explicación: Qué es Bitcoin y por qué es valioso',
          'Lista de Activos: Tenencias aproximadas (no cantidades exactas)',
          'Ubicaciones de Hardware: Dónde están guardados los dispositivos',
          'Instrucciones de Recuperación: Guía paso a paso para herederos no técnicos',
          'Lista de Contactos: Personas técnicas que pueden ayudar si es necesario'
        ]
      },

      backup: {
        passphraseTitle: 'Generación de Frase de Paso (Método Más Seguro)',
        passphraseDesc: 'Usa dados físicos para verdadera aleatoriedad — nunca generes digitalmente.',
        passphraseSteps: [
          'Consigue 5 dados estándar de seis caras',
          'Tira todos los dados y anota los números en orden',
          'Concatena en un número de 5 dígitos (ej., 14263)',
          'Encuentra la palabra correspondiente en la lista oficial BIP39 en inglés (imprímela offline)',
          'Repite 3–5 veces para crear tu frase de paso (ej., "apple zebra moon river stone")',
          'Escríbela en papel y guárdala de forma segura en ubicaciones separadas'
        ],
        seedStorage: 'Almacenamiento de Frase Semilla - Modelo de Conocimiento Dividido 2-de-3',
        seedStorageDesc: 'Para lograr máxima seguridad, usamos un modelo de recuperación 2-de-3: tu frase semilla y frase de paso se dividen en 3 ubicaciones separadas. Ninguna ubicación contiene ambas. Si una ubicación se pierde o compromete, las otras dos permiten recuperación completa. Si solo se encuentra una, los fondos permanecen inaccesibles.',
        exactDistribution: 'Distribución Exacta (sigue esto exactamente):',
        location1: 'Ubicación 1 (Caja fuerte en casa o lugar personal seguro):',
        location1Items: ['Copia de frase semilla #1', 'Copia de frase de paso #2', 'Copia de frase de paso #3'],
        location2: 'Ubicación 2 (Caja de seguridad bancaria, caja fuerte de oficina, o custodio):',
        location2Items: ['Copia de frase semilla #2', 'Copia de frase de paso #3', 'Copia de frase de paso #1'],
        location3: 'Ubicación 3 (Familiar de confianza, pareja, o propiedad secundaria):',
        location3Items: ['Copia de frase semilla #3', 'Copia de frase de paso #1', 'Copia de frase de paso #2'],
        recoveryWorks: 'Cómo Funciona la Recuperación (ejemplos):',
        recoveryExamples: [
          'Si se pierde Ubicación 1 → Usar Ubicación 2 + Ubicación 3',
          'Si se compromete Ubicación 2 → Usar Ubicación 1 + Ubicación 3',
          'Si Ubicación 3 es inaccesible → Usar Ubicación 1 + Ubicación 2'
        ],
        physicalSecurity: 'Requisito de Seguridad Física',
        physicalSecurityText: 'Usa bolsas de seguridad con evidencia de manipulación (bolsas selladas que se rompen al abrirse) en las 3 ubicaciones. Si alguna bolsa está dañada o muestra signos de manipulación, crea inmediatamente nuevos respaldos y mueve los fondos a una nueva wallet.',
        additionalRecs: 'Recomendaciones Adicionales',
        additionalRecsList: [
          'Nunca guardes la semilla y su propia frase de paso en la misma ubicación',
          'Etiqueta cada respaldo claramente (ej., "Semilla #1 - No abrir excepto emergencia")',
          'Usa placas de metal (Cryptosteel, Billfodl) o papel de archivo libre de ácido',
          'Prueba la legibilidad de todos los respaldos antes de sellar'
        ],
        passphraseStorage: 'Almacenamiento de Frase de Paso',
        passphraseStorageList: [
          'Escrita en papel (nunca solo memorizada)',
          'Guardar respaldo separado de la frase semilla (nunca en la misma ubicación)',
          'Nunca guardar frase de paso con frase semilla en ninguna ubicación'
        ],
        docStorage: 'Almacenamiento de Documentación',
        docStorageList: [
          'Copia física en sobre sellado en un lugar seguro de tu elección',
          'Revisar anualmente o cuando cambie la configuración'
        ]
      },

      actionPlan: {
        description: 'A continuación están los planes de acción detallados para ambos caminos. Puedes seguir el que mejor se adapte a tu preferencia (o compararlos).',
        sparrowTitle: 'Camino 1: Plan de Acción Multisig Sparrow (Control Activo)',
        sparrowDesc: 'Pasos si eliges gestión multisig con Sparrow Wallet.',
        lianaTitle: 'Camino 2: Plan de Acción Time-lock Liana (Herencia Automatizada)',
        lianaDesc: 'Pasos si eliges herencia con time-lock con Liana Wallet.'
      },

      checklist: {
        quarterly: [
          'Verificar que las ubicaciones de respaldo sean seguras y accesibles',
          'Probar que los respaldos de frase semilla sean legibles',
          'Actualizar software de wallet (verificar firmas primero)',
          'Revisar historial de transacciones por anomalías',
          'Verificar que el firmware del hardware wallet esté actualizado',
          'Actualizar documentación de herencia si es necesario',
          'Confirmar que los herederos sepan cómo acceder a esta documentación'
        ],
        annual: [
          'Prueba de recuperación completa en dispositivo secundario',
          'Considerar actualizar configuración de seguridad',
          'Actualizar documentos de planificación patrimonial',
          'Revisar postura general de seguridad'
        ]
      },

      footer: {
        tagline: 'Seguridad Bitcoin Simplificada',
        confidentialNote: 'Este documento es confidencial. Guárdalo de forma segura y nunca compartas tu frase semilla.'
      },

      quickActionPlans: {
        title: 'Planes de Acción Rápida - Sentinel',
        description: 'Con Sentinel, puedes añadir una consulta cuando quieras para monitorear tu configuración de seguridad Bitcoin y recibir alertas en tiempo real.',
        pricing: 'Estructura de Precios',
        time: 'Tiempo',
        cost: 'Costo',
        firstHour: 'Primera hora',
        subsequentHours: 'Horas siguientes',
        perHour: '/hora',
        features: 'Características incluidas:',
        featuresList: [
          'Añadir consultas personalizadas en cualquier momento',
          'Monitoreo y alertas en tiempo real',
          'Análisis de seguridad bajo demanda',
          'Soporte flexible por hora'
        ]
      }
    },

    // PDF Recommendations (translated)
    pdfRecommendations: {
      hardware_wallet: {
        title: 'Usa una Hardware Wallet',
        shortTip: 'Mueve tu Bitcoin a una hardware wallet para máxima seguridad.'
      },
      seed_backup_metal: {
        title: 'Crea Respaldo de Semilla en Metal',
        shortTip: 'Guarda tu frase semilla en metal para protección contra fuego/agua.'
      },
      multiple_backups: {
        title: 'Distribuye Ubicaciones de Respaldo',
        shortTip: 'Guarda copias de la frase semilla en múltiples ubicaciones seguras.'
      },
      passphrase_setup: {
        title: 'Añade una Frase de Paso (Palabra 25)',
        shortTip: 'Añade una capa extra de seguridad con una frase de paso BIP39.'
      },
      recovery_test: {
        title: 'Prueba Tu Proceso de Recuperación',
        shortTip: 'Verifica que realmente puedas recuperar tu wallet desde el respaldo.'
      },
      multisig_setup: {
        title: 'Considera Configuración Multi-Firma',
        shortTip: 'Requiere múltiples llaves para gastar tu Bitcoin para máxima seguridad.'
      },
      address_verification: {
        title: 'Siempre Verifica Direcciones en el Dispositivo',
        shortTip: 'Confirma direcciones de recepción en la pantalla de tu hardware wallet.'
      },
      cold_storage: {
        title: 'Mueve Más Bitcoin a Almacenamiento Frío',
        shortTip: 'Mantén 90%+ de tu Bitcoin en almacenamiento frío, no en exchanges.'
      },
      address_reuse: {
        title: 'Deja de Reutilizar Direcciones Bitcoin',
        shortTip: 'Usa una nueva dirección para cada transacción para proteger tu privacidad.'
      },
      verify_updates: {
        title: 'Verifica Firmas de Software',
        shortTip: 'Siempre verifica firmas criptográficas antes de actualizar software de wallet.'
      },
      seed_security: {
        title: 'Nunca Compartas Tu Frase Semilla',
        shortTip: 'Tu frase semilla debe ser conocida solo por ti.'
      },
      dedicated_device: {
        title: 'Usa un Dispositivo Dedicado para Bitcoin',
        shortTip: 'Usa un dispositivo separado para transacciones Bitcoin para minimizar superficie de ataque.'
      },
      inheritance_plan: {
        title: 'Crea un Plan de Herencia',
        shortTip: 'Asegura que tu Bitcoin pueda ser accedido por herederos si algo te sucede.'
      },
      utxo_management: {
        title: 'Aprende Gestión de UTXOs',
        shortTip: 'Entender control de monedas mejora privacidad y reduce comisiones.'
      },
      security_review: {
        title: 'Programa Revisiones de Seguridad Regulares',
        shortTip: 'Revisa tu configuración de seguridad al menos trimestralmente.'
      },
      priority: {
        critical: 'CRÍTICO',
        high: 'ALTO',
        medium: 'MEDIO',
        low: 'BAJO'
      }
    },

    // Inheritance Plan Generation (Recommendations.js)
    inheritancePlanGen: {
      executiveSummary: {
        excellent: 'Tu puntuación de seguridad Bitcoin de {score} indica una configuración excelente. Este plan te ayudará a optimizar tu estrategia de herencia y añadir las capas finales de protección.',
        moderate: 'Tu puntuación de seguridad Bitcoin de {score} muestra una base moderada. Este plan aborda las brechas críticas y establece una estrategia de herencia adecuada.',
        needsWork: 'Tu puntuación de seguridad Bitcoin de {score} indica vulnerabilidades significativas. Este plan proporciona una revisión completa de seguridad y establece protocolos de herencia apropiados.'
      },
      walletRecommendation: {
        primary: 'Sparrow Wallet',
        description: 'Sparrow es una wallet Bitcoin de escritorio enfocada en seguridad y privacidad. Soporta todas las hardware wallets y es perfecta tanto para configuraciones singlesig como multisig.',
        downloadUrl: 'https://sparrowwallet.com',
        setupSteps: [
          'Descargar del sitio oficial (verificar firma)',
          'Conectar tu hardware wallet vía USB',
          'Crear nueva wallet o importar existente',
          'Habilitar Tor para privacidad (opcional pero recomendado)',
          'Verificar direcciones de recepción en hardware wallet'
        ]
      },
      multisigPlan: {
        type: '2-de-3',
        description: 'Un multisig 2-de-3 requiere cualquier 2 de 3 llaves privadas para autorizar una transacción. Esto protege contra pérdida, robo y puntos únicos de falla.',
        hardware: {
          coldcard: { device: 'Coldcard Mk4', purpose: 'Dispositivo de firma primario (contigo)', cost: '$150' },
          bitbox: { device: 'BitBox02', purpose: 'Dispositivo secundario (caja de seguridad)', cost: '$180' },
          jade: { device: 'Jade Wallet', purpose: 'Dispositivo de herencia (con heredero/abogado)', cost: '$150' }
        },
        setupSteps: [
          'Crear primer keystore con Coldcard',
          'Crear segundo keystore con BitBox02',
          'Crear tercer keystore con Jade Wallet',
          'En Sparrow: Archivo > Nueva Wallet > Multi Firma',
          'Establecer M de N a 2-de-3',
          'Importar los tres xpubs',
          'Verificar que las direcciones coincidan en todos los dispositivos',
          'Enviar pequeña transacción de prueba',
          'Documentar todo para herencia'
        ]
      },
      inheritanceStrategy: {
        recommended: 'Liana Wallet',
        description: 'Liana es una wallet Bitcoin con herencia integrada mediante rutas de recuperación con time-lock. Si no mueves tus monedas por un período especificado, una llave de recuperación puede acceder a ellas.',
        howItWorks: [
          'Configurar llave primaria (tu hardware wallet)',
          'Configurar llave de recuperación (hardware wallet del heredero)',
          'Definir timelock (ej., 365 días de inactividad)',
          'Después del timelock, la llave de recuperación puede gastar',
          'Las transacciones regulares reinician el temporizador',
          'No se necesita tercero - completamente sin confianza'
        ],
        setupUrl: 'https://wizardsardine.com/liana/',
        considerations: [
          'El poseedor de la llave de recuperación no puede acceder a los fondos antes del timelock',
          'Debes realizar transacciones periódicamente para reiniciar el temporizador',
          'Considera un timelock más corto (180 días) con recordatorio regular de check-in',
          'El heredero necesita habilidad técnica o instrucciones claras'
        ]
      },
      backupStrategy: {
        passphraseGeneration: {
          method: 'Creación de Frase de Paso con Dados',
          description: 'La mejor forma de crear una frase de paso segura es usando dados para verdadera aleatoriedad. Tira 5 dados, convierte los números a una palabra de la lista BIP39. Repite 3 o 5 veces y esa será tu frase de paso.',
          steps: [
            'Consigue 5 dados',
            'Tíralos para obtener 5 números',
            'Concatena los números (ej., 1,4,2,6,3 → 14263)',
            'Busca la palabra BIP39 correspondiente',
            'Repite 3 o 5 veces para la frase de paso completa',
            'Escríbela en papel y guárdala de forma segura'
          ]
        },
        seedPhrases: {
          storage: 'Placas de respaldo en metal o papel (según preferencia)',
          model: 'Modelo de Recuperación 2-de-3 (Conocimiento Dividido)',
          modelDescription: 'Distribuye tu frase semilla y frase de paso en 3 ubicaciones. Ninguna ubicación contiene tanto la frase semilla como su frase de paso. De esta forma, si una ubicación se compromete, el atacante no puede acceder a tus fondos. Para recuperar, combina información de cualquier dos ubicaciones.',
          security: 'Usa bolsas con evidencia de manipulación que deben dañarse para abrirse. Esto te alerta si los respaldos han sido accedidos.',
          locations: [
            'Ubicación 1: Caja fuerte en casa - Guardar frase semilla de Wallet 1 + copia de frase de paso de Wallet 2',
            'Ubicación 2: Banco u oficina - Guardar frase semilla de Wallet 2 + copia de frase de paso de Wallet 3',
            'Ubicación 3: Casa familiar o de pareja - Guardar frase semilla de Wallet 3 + copia de frase de paso de Wallet 1'
          ],
          passphraseStorage: 'Escrita en papel y guardada separada de las frases semilla en cada ubicación'
        },
        documentation: {
          items: [
            'Instrucciones escritas para herederos (no técnicas)',
            'Números de serie y ubicaciones de hardware wallets',
            'Software de wallet usado y versión',
            'Rutas de derivación (BIP84 para SegWit nativo)',
            'Tenencias aproximadas (para planificación patrimonial)'
          ],
          storage: 'Sobre sellado con familia o amigo/abogado de confianza'
        }
      },
      actionPlan: {
        purchaseHardware: { action: 'Comprar hardware wallet del fabricante oficial', timeframe: 'Esta semana', cost: '$150-200' },
        createMetalBackup: { action: 'Crear respaldo de semilla en metal (o papel si se prefiere)', timeframe: 'En 2 semanas', cost: '$30-100' },
        generatePassphrase: { action: 'Generar y añadir frase de paso usando método de dados', timeframe: 'En 1 mes', cost: 'Gratis' },
        setupMultisig: { action: 'Configurar multisig 2-de-3 con Sparrow Wallet', timeframe: 'En 2 meses', cost: '$300-500 (hardware adicional)' },
        implementLiana: { action: 'Implementar wallet Liana para herencia', timeframe: 'En 3 meses', cost: 'Gratis' },
        documentEverything: { action: 'Documentar todo e informar a herederos (sin revelar secretos)', timeframe: 'Continuo', cost: 'Gratis' },
        lianaMultisig: { action: 'Configurar wallet Liana multisig 2-3 con recuperación time-locked (llave primaria + de recuperación)', cost: '$300-500 (hardware adicional)' },
        lianaTimelock: { action: 'Definir período de timelock y probar simulación de recuperación' }
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
      saveChanges : 'Preferencias Guardadas',
      unlimitedAccess: 'Evaluaciones y funciones ilimitadas'
    }
  }
};

export default translations;
