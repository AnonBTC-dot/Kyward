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
      heroBadge: 'SELF-CUSTODY ₿ITCOIN SECURITY ASSESSMENT',
      heroLine1: 'Not Your Keys,',
      heroLine2: 'Not Your Bitcoin.',
      heroLine3: 'Secure Them Now.',
      heroSubtitle: 'The #1 Bitcoin self-custody security assessment. Protect your private keys, seed phrase, and cold storage setup with personalized recommendations from security experts. No wallet sales. No KYC. Just honest Bitcoin security guidance.',
      heroCta: 'Get Your Free Security Score',
      heroSecondaryCta: 'How Self-Custody Works',
      heroStats: {
        nonCustodial: 'Self-Custody',
        nonCustodialValue: '100%',
        dataStored: 'Data Stored',
        dataStoredValue: '0',
        privacyFirst: 'Privacy First',
        privacyFirstValue: '∞'
      },

      // Mockup Card
      mockup: {
        title: 'Your Bitcoin Security Score',
        rec1: 'Hardware wallet cold storage verified',
        rec2: 'Multi-signature setup recommended',
        rec3: 'Seed phrase backup strategy solid'
      },

      // Why Kyward Section (PVU)
      whyTitle: 'Why Choose Kyward for Bitcoin Self-Custody?',
      whySubtitle: "We don't sell hardware wallets or custody services. We teach you how to truly own your Bitcoin with proper self-custody security practices.",
      whyCards: {
        personalized: {
          title: 'Bitcoin Security Assessment',
          description: 'Answer 15 questions about your hardware wallet, seed phrase backup, and cold storage setup. Get a personalized security score with actionable self-custody recommendations.'
        },
        zeroData: {
          title: 'Zero Data Storage',
          description: 'True self-custody means privacy. Your answers never leave your device. We don\'t store, track, or sell your data. Ever. No KYC required.'
        },
        education: {
          title: 'Self-Custody Education',
          description: 'Learn WHY each Bitcoin security recommendation matters. Understand hardware wallets, multi-signature setups, and inheritance planning.'
        },
        noWallet: {
          title: 'No Wallet Sales',
          description: 'We\'re not affiliated with any hardware wallet provider. Our Bitcoin security recommendations are based purely on best practices.'
        }
      },

      // How It Works Section
      howTitle: 'How Bitcoin Self-Custody Security Works',
      howSubtitle: 'Three steps to protect your private keys and secure your Bitcoin',
      howSteps: {
        step1: {
          number: '01',
          title: 'Take the Security Assessment',
          description: 'Answer questions about your hardware wallet, seed phrase storage, cold storage setup, and Bitcoin security habits. Takes just 5 minutes.'
        },
        step2: {
          number: '02',
          title: 'Get Your Bitcoin Security Score',
          description: 'Receive a personalized self-custody security score from 0-100 with detailed breakdown of your private key protection and backup strategies.'
        },
        step3: {
          number: '03',
          title: 'Secure Your Bitcoin',
          description: 'Get a step-by-step action plan covering hardware wallets, multi-signature setup, seed phrase backup, and Bitcoin inheritance planning.'
        }
      },

      // Pricing Section
      pricingTitle: 'Bitcoin Security Plans',
      pricingSubtitle: 'Protect your self-custody setup. No hidden fees. Pay with Bitcoin.',
      plans: {
        subtitle: 'Choose the self-custody security plan that fits your needs',

        free: {
          badge: 'FREE',
          name: 'Free',
          price: '$0',
          period: '/forever',
          features: [
            'Bitcoin Security Assessment',
            'Self-Custody Security Score',
            '1 Critical Security Recommendation'
          ],
          cta: 'Start Free Security Assessment'
        },

        essential: {
          badge: 'MOST POPULAR',
          name: 'Essential',
          price: '$9.99',
          period: '/one-time',
          features: [
            'Complete PDF Security Report',
            'All Self-Custody Recommendations',
            'Bitcoin Inheritance Planning Guide',
            'Multi-Signature Setup Tutorial',
            'Seed Phrase Backup Strategies'
          ],
          cta: 'Get Essential ($9.99)'
        },

        sentinel: {
          badge: 'ADVANCED',
          name: 'Sentinel',
          price: '$14.99',
          period: '/month',
          features: [
            'Unlimited Security Assessments',
            'BTC Guardian Telegram Bot',
            'Real-time Bitcoin wallet alerts',
            'Transaction monitoring',
            'BTC price milestone alerts',
            'All Essential features',
            'Cancel anytime'
          ],
          cta: 'Subscribe to Sentinel'
        },

        consultation: {
          badge: 'EXPERT',
          name: 'Consultation',
          price: '$99',
          period: '+ $49/hr add',
          features: [
            '1-hour private security audit',
            'Custom self-custody strategy',
            'Multi-sig implementation help',
            'Inheritance planning assistance',
            'Hardware wallet setup guidance',
            'Additional hours at $49/hr'
          ],
          note: 'Does not include BTC Guardian bot (Sentinel exclusive)',
          cta: 'Book Security Consultation'
        }
      },

      // Testimonials Section
      testimonials: {
        title: 'What Our Users Say',
        subtitle: 'Real feedback from Bitcoiners who secured their self-custody setup with Kyward',
        privacyNote: 'Privacy Protected',
        reviews: [
          {
            name: 'Michael R.',
            role: 'Bitcoin Holder since 2017',
            stars: 5,
            text: 'Finally, a service that focuses on education rather than selling me another hardware wallet. The security assessment opened my eyes to vulnerabilities I never considered.'
          },
          {
            name: 'Sarah K.',
            role: 'Self-Custody Advocate',
            stars: 5,
            text: 'The inheritance planning guide alone was worth it. My family now knows exactly how to access my Bitcoin if something happens to me. Peace of mind achieved.'
          },
          {
            name: 'David L.',
            role: 'HODLer',
            stars: 5,
            text: 'I thought my setup was secure until I took the assessment. Score of 45/100 was a wake-up call. After following the recommendations, I\'m now at 92.'
          },
          {
            name: 'Ana M.',
            role: 'Crypto Enthusiast',
            stars: 5,
            text: 'Zero data storage policy convinced me to try it. The multi-sig tutorial was clear and easy to follow. Best investment in my Bitcoin security.'
          },
          {
            name: 'James T.',
            role: 'Long-term Investor',
            stars: 5,
            text: 'The Sentinel plan alerts have saved me multiple times. Knowing when my cold storage addresses receive transactions gives me incredible peace of mind.'
          },
          {
            name: 'Elena V.',
            role: 'Bitcoin Maximalist',
            stars: 5,
            text: 'No KYC, no data stored, just honest security advice. This is how Bitcoin services should be. Recommended the Essential plan to all my friends.'
          }
        ]
      },

      // Footer
      footer: {
        tagline: 'Bitcoin Self-Custody Security by Bitcoiners',
        copyright: '© 2025 Kyward. Bitcoin Security Assessment Platform.'
      }
    },

    // Auth Form
    auth: {
      loginTitle: 'Welcome Back',
      loginSubtitle: 'Access your Bitcoin security dashboard',
      signupTitle: 'Start Securing Your Bitcoin',
      signupSubtitle: 'Join Kyward and protect your self-custody setup',
      signupSuccess: 'Account created! Welcome to Kyward. Start your free Bitcoin security assessment now. Upgrade anytime for full self-custody recommendations.',
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
        part2: 'All users start on Free tier. Upgrade anytime to Essential ($9.99 one-time), Sentinel ($14.99/month) or Consultation.',
      }

    },

    // Dashboard
    dashboard: {
      welcome: 'Welcome back,',
      welcomeUser: 'Bitcoiner',
      subtitle: 'Track your self-custody security progress',

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
        title: 'Unlock Your Complete Self-Custody Plan',
        description: 'Get unlimited assessments, download your Bitcoin security PDF with multi-sig setup guides, and access complete inheritance planning.',
        features: {
          pdf: 'Download Security PDF',
          email: 'Email Report',
          recommendations: 'All Self-Custody Tips',
          inheritance: 'Bitcoin Inheritance Plan'
        },
        essentialButton: 'Get Essential - $9.99 one-time',
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
      title: 'Your Bitcoin Self-Custody Report',
      subtitle: "Based on your answers, here's your personalized self-custody security analysis with actionable recommendations.",
      badge: 'Bitcoin Security Assessment Complete',

      score: {
        label: 'Self-Custody Score',
        outOf: '/100',
        excellent: 'Excellent Self-Custody',
        good: 'Moderate Security',
        needsWork: 'Needs Improvement',
        critical: 'Critical Risk',
        excellentDesc: 'Your Bitcoin self-custody practices are excellent. Focus on multi-signature optimization and inheritance planning.',
        goodDesc: 'You have a solid self-custody foundation. Improve your hardware wallet setup and seed phrase backup strategy.',
        needsWorkDesc: 'Your Bitcoin is at significant risk. Implement proper cold storage and seed phrase backup immediately.'
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
        title: 'Unlock Your Complete Self-Custody & Inheritance Plan',
        subtitle: "Don't just know your score - get the complete Bitcoin security roadmap to protect your private keys for generations.",

        benefits: {
          recommendations: {
            title: 'All Self-Custody Recommendations',
            description: 'Detailed step-by-step instructions for hardware wallets, cold storage, and seed phrase security.'
          },
          pdf: {
            title: 'Password-Protected Security PDF',
            description: 'Download your complete Bitcoin self-custody guide offline. Reference anytime, no internet needed.'
          },
          inheritance: {
            title: 'Bitcoin Inheritance Planning',
            description: 'Step-by-step guide to pass your Bitcoin to heirs safely using Liana time-locks and multi-sig.'
          },
          multisig: {
            title: 'Multi-Signature Setup Guide',
            description: 'Learn 2-of-3 multisig setup with Sparrow Wallet. Eliminate single points of failure in your self-custody.'
          },
          sparrow: {
            title: 'Sparrow Wallet Tutorial',
            description: 'Complete guide to setting up Sparrow Wallet for maximum Bitcoin sovereignty and privacy.'
          },
          unlimited: {
            title: 'Unlimited Security Assessments',
            description: 'Track your self-custody progress over time. Retake the assessment as you improve your setup.'
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

        plan: {
          gridtitle: 'MOST POPULAR',
          title1: 'Essential Plan',
          price1: '$9.99',
          renew1: '/one tiem',
          explanation1: 'Just one payment',
          benefit1: 'Personalized recommendations',
          benefit2: 'Full PDF Report Download',
          benefit3: 'Inheritance Planning Guide',
          benefit4: 'Unlimited Re-downloads of your report',
          benefit5: 'One assessment only (repurchase to retake)',
          payment1: 'Just $9.99',
          title2: 'Consultation',
          price2: '$99',
          renew2: '/session',
          explanation2: 'Additional sessions: $49/hr',
          benefit11: '1-hour private audit (video call)',
          benefit21: 'Custom inheritance strategy',
          benefit31: '30-day follow-up support',
          benefit41: 'Unlimited Assessments',
          benefit51: 'Priority support',
          payment2: 'Book Consultation',
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
      essentialRepurchaseNote: '<strong>Note:</strong> To take a new assessment, you will need to purchase Essential again ($9.99).',
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

      hotStorage: {
        title: 'Hot Storage Wallet Options (Bitcoin Mainnet)',
        description: 'For long-term hot storage (minimal interaction, maximum security), consider these mobile/desktop wallets designed specifically for Bitcoin mainnet use:',
        blueWallet: 'Mobile-first, supports watch-only mode, Lightning + on-chain, easy to use for hot storage with air-gapped signing via PSBT export/import.',
        jade: 'Hardware wallet with strong hot storage capabilities (air-gapped via QR codes), fully open-source, integrates well with Green wallet or Sparrow for offline signing.',
        bullBitcoin: 'Focused on non-KYC Bitcoin privacy, supports hot storage setups with strong emphasis on self-custody and Canadian-friendly features (good for geographic diversification).',
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
        lianaMultisig: { action: 'Set up Liana wallet multisig 2-3 with time-locked recovery (primary + recovery key)', cost: '$300-500 (additional hardware)' },
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
    },

    // Legal Pages
    legal: {
      privacy: {
        title: 'Privacy Policy',
        back: 'Back',
        lastUpdated: 'Last updated: February 2025',
        highlight: 'Kyward is committed to your privacy. We practice minimal data collection and never sell your information.',
        introTitle: '1. Introduction',
        introText: 'Kyward ("we", "our", or "us") operates the kyward.com website and provides Bitcoin self-custody security assessment services. This Privacy Policy explains how we collect, use, and protect your information when you use our services.',
        introText2: 'Kyward is registered and operates from Bogota, Colombia, and complies with applicable Colombian data protection laws.',
        dataTitle: '2. Information We Collect',
        dataIntro: 'We collect minimal information necessary to provide our services:',
        dataItem1: 'Email address - Required for account creation and communication',
        dataItem2: 'Security assessment answers - Stored to generate your security score and recommendations',
        dataItem3: 'Payment information - Transaction IDs for cryptocurrency payments (we do not store private keys or wallet seeds)',
        kycTitle: '3. No KYC Policy',
        kycText: 'We do NOT require or collect: government IDs, proof of address, photos, phone numbers, or any other identity verification documents. Your privacy is paramount to us.',
        storageTitle: '4. Data Storage & Security',
        storageText: 'Your data is stored securely using Supabase, a trusted cloud database provider with encryption at rest and in transit. We implement industry-standard security measures to protect your information.',
        storageText2: 'We retain your data only as long as your account is active. You can request deletion of your account and all associated data at any time.',
        usageTitle: '5. How We Use Your Data',
        usageItem1: 'Provide and improve our security assessment services',
        usageItem2: 'Generate personalized security recommendations',
        usageItem3: 'Process payments and provide customer support',
        usageItem4: 'Send service-related communications (with your consent for marketing)',
        sharingTitle: '6. Data Sharing',
        sharingText: 'We do NOT sell, trade, or rent your personal information to third parties. We may share data only with:',
        sharingItem1: 'Service providers necessary to operate our platform (database hosting)',
        sharingItem2: 'Legal authorities if required by Colombian law',
        paymentsTitle: '7. Payment Privacy',
        paymentsText: 'We accept cryptocurrency payments (Bitcoin and USDT) directly to our wallets. We do not use third-party payment processors that could track your identity. Only transaction IDs are stored for order verification.',
        cookiesTitle: '8. Cookies & Analytics',
        cookiesText: 'We currently do not use analytics tracking tools or third-party cookies. We only use essential cookies required for the website to function (session management, language preferences).',
        rightsTitle: '9. Your Rights',
        rightsIntro: 'You have the right to:',
        rightsItem1: 'Access your personal data',
        rightsItem2: 'Request correction of inaccurate data',
        rightsItem3: 'Request deletion of your account and data',
        rightsItem4: 'Opt-out of marketing communications',
        changesTitle: '10. Changes to This Policy',
        changesText: 'We may update this Privacy Policy from time to time. We will notify users of significant changes via email or website notification. Continued use of our services after changes constitutes acceptance.',
        contactTitle: 'Questions?',
        contactText: 'For privacy-related inquiries, contact us at:'
      },
      terms: {
        title: 'Terms of Service',
        back: 'Back',
        lastUpdated: 'Last updated: February 2025',
        disclaimer: 'IMPORTANT: Kyward provides educational content about Bitcoin self-custody security. We do NOT provide financial, investment, or legal advice. You are solely responsible for your Bitcoin security decisions.',
        acceptTitle: '1. Acceptance of Terms',
        acceptText: 'By accessing or using Kyward\'s services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.',
        serviceTitle: '2. Service Description',
        serviceText: 'Kyward provides Bitcoin self-custody security assessment services, including:',
        serviceItem1: 'Security questionnaires and assessments',
        serviceItem2: 'Personalized security scores and recommendations',
        serviceItem3: 'Educational content about Bitcoin security best practices',
        serviceItem4: 'Optional monitoring and alert services (Sentinel plan)',
        serviceItem5: 'Optional consultation services',
        adviceTitle: '3. Not Financial or Investment Advice',
        adviceHighlight: 'Kyward is an EDUCATIONAL platform. Nothing on this website constitutes financial, investment, tax, or legal advice.',
        adviceText: 'Our security assessments and recommendations are educational tools to help you understand Bitcoin self-custody best practices. We do not recommend specific investments, endorse any cryptocurrency, or guarantee any outcomes.',
        adviceText2: 'You should consult with qualified professionals before making any financial decisions. Kyward and its team are not responsible for any investment decisions you make.',
        userTitle: '4. User Responsibilities',
        userIntro: 'By using our services, you agree to:',
        userItem1: 'Provide accurate information in security assessments',
        userItem2: 'Keep your account credentials secure and confidential',
        userItem3: 'Not share your account with others',
        userItem4: 'Not use our services for illegal activities',
        userItem5: 'Take full responsibility for your own Bitcoin security',
        paymentTitle: '5. Payments & Refunds',
        paymentText: 'We accept cryptocurrency payments including Bitcoin (BTC) and USDT. Prices are displayed in USD but payment is made in cryptocurrency at the current exchange rate.',
        refundPolicy: 'ALL SALES ARE FINAL. Due to the digital nature of our services and cryptocurrency payment methods, we do not offer refunds. Please review our services carefully before purchasing.',
        paymentText2: 'Subscription services (Sentinel plan) can be cancelled at any time. Cancellation stops future billing but does not refund the current billing period.',
        ipTitle: '6. Intellectual Property',
        ipText: 'All content on Kyward, including text, graphics, logos, assessments, recommendations, and software, is the property of Kyward and protected by intellectual property laws. You may not copy, reproduce, distribute, or create derivative works without our written permission.',
        liabilityTitle: '7. Limitation of Liability',
        liabilityText: 'TO THE MAXIMUM EXTENT PERMITTED BY LAW:',
        liabilityItem1: 'Kyward is NOT responsible for any loss of Bitcoin, cryptocurrency, or funds',
        liabilityItem2: 'We do NOT guarantee the security of your self-custody setup',
        liabilityItem3: 'We are NOT liable for any damages arising from use of our services',
        liabilityItem4: 'Our maximum liability is limited to the amount you paid for services',
        liabilityText2: 'You acknowledge that Bitcoin and cryptocurrency involve significant risks. You are solely responsible for securing your private keys, seed phrases, and funds.',
        terminationTitle: '8. Account Termination',
        terminationText: 'We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or abuse our services. You may delete your account at any time through the dashboard or by contacting support.',
        lawTitle: '9. Governing Law',
        lawText: 'These Terms of Service are governed by and construed in accordance with the laws of Colombia. Any disputes arising from these terms or our services shall be resolved in the courts of Bogota, Colombia.',
        changesTitle: '10. Changes to Terms',
        changesText: 'We may modify these Terms of Service at any time. Significant changes will be communicated via email or website notification. Continued use of our services after changes constitutes acceptance of the modified terms.',
        contactTitle: 'Questions?',
        contactText: 'For questions about these terms, contact us at:'
      }
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
      heroBadge: 'EVALUACIÓN DE SEGURIDAD ₿ITCOIN AUTO-CUSTODIA',
      heroLine1: 'No Son Tus Llaves,',
      heroLine2: 'No Es Tu Bitcoin.',
      heroLine3: 'Asegúralas Ahora.',
      heroSubtitle: 'La evaluación #1 de seguridad Bitcoin auto-custodia. Protege tus llaves privadas, frase semilla y almacenamiento frío con recomendaciones personalizadas de expertos en seguridad. Sin venta de wallets. Sin KYC. Solo guía honesta de seguridad Bitcoin.',
      heroCta: 'Obtén Tu Puntuación Gratis',
      heroSecondaryCta: 'Cómo Funciona la Auto-Custodia',
      heroStats: {
        nonCustodial: 'Auto-Custodia',
        nonCustodialValue: '100%',
        dataStored: 'Datos Almacenados',
        dataStoredValue: '0',
        privacyFirst: 'Privacidad Primero',
        privacyFirstValue: '∞'
      },

      // Mockup Card
      mockup: {
        title: 'Tu Puntuación de Seguridad Bitcoin',
        rec1: 'Hardware wallet y cold storage verificado',
        rec2: 'Configuración multi-firma recomendada',
        rec3: 'Estrategia de respaldo de frase semilla sólida'
      },

      // Why Kyward Section (PVU)
      whyTitle: '¿Por Qué Elegir Kyward para Auto-Custodia Bitcoin?',
      whySubtitle: 'No vendemos hardware wallets ni servicios de custodia. Te enseñamos a ser verdadero dueño de tu Bitcoin con prácticas de seguridad auto-custodia.',
      whyCards: {
        personalized: {
          title: 'Evaluación de Seguridad Bitcoin',
          description: 'Responde 15 preguntas sobre tu hardware wallet, respaldo de frase semilla y configuración de almacenamiento frío. Obtén una puntuación de seguridad personalizada con recomendaciones de auto-custodia.'
        },
        zeroData: {
          title: 'Cero Almacenamiento de Datos',
          description: 'Auto-custodia real significa privacidad. Tus respuestas nunca salen de tu dispositivo. No almacenamos ni vendemos tus datos. Sin KYC requerido.'
        },
        education: {
          title: 'Educación Auto-Custodia',
          description: 'Aprende POR QUÉ cada recomendación de seguridad Bitcoin importa. Entiende hardware wallets, configuraciones multi-firma y planificación de herencia.'
        },
        noWallet: {
          title: 'Sin Venta de Wallets',
          description: 'No estamos afiliados a ningún proveedor de hardware wallets. Nuestras recomendaciones de seguridad Bitcoin se basan únicamente en mejores prácticas.'
        }
      },

      // How It Works Section
      howTitle: 'Cómo Funciona la Seguridad Auto-Custodia Bitcoin',
      howSubtitle: 'Tres pasos para proteger tus llaves privadas y asegurar tu Bitcoin',
      howSteps: {
        step1: {
          number: '01',
          title: 'Toma la Evaluación de Seguridad',
          description: 'Responde preguntas sobre tu hardware wallet, almacenamiento de frase semilla, configuración de cold storage y hábitos de seguridad Bitcoin. Solo 5 minutos.'
        },
        step2: {
          number: '02',
          title: 'Obtén Tu Puntuación de Seguridad Bitcoin',
          description: 'Recibe una puntuación personalizada de auto-custodia del 0-100 con desglose detallado de tu protección de llaves privadas y estrategias de respaldo.'
        },
        step3: {
          number: '03',
          title: 'Asegura Tu Bitcoin',
          description: 'Obtén un plan de acción paso a paso cubriendo hardware wallets, configuración multi-firma, respaldo de frase semilla y planificación de herencia Bitcoin.'
        }
      },

      // Pricing Section
      pricingTitle: 'Planes de Seguridad Bitcoin',
      pricingSubtitle: 'Protege tu configuración auto-custodia. Sin cargos ocultos. Paga con Bitcoin.',
      plans: {
        subtitle: 'Elige el plan de seguridad auto-custodia que mejor se adapte a ti',

        free: {
          badge: 'GRATIS',
          name: 'Gratis',
          price: '$0',
          period: '/siempre',
          features: [
            'Evaluación de Seguridad Bitcoin',
            'Puntuación de Seguridad Auto-Custodia',
            '1 Recomendación Crítica de Seguridad'
          ],
          cta: 'Iniciar Evaluación de Seguridad Gratis'
        },

        essential: {
          badge: 'MÁS POPULAR',
          name: 'Essential',
          price: '$9.99',
          period: '/pago único',
          features: [
            'Reporte PDF de Seguridad Completo',
            'Todas las Recomendaciones Auto-Custodia',
            'Guía de Planificación de Herencia Bitcoin',
            'Tutorial de Configuración Multi-Firma',
            'Estrategias de Respaldo de Frase Semilla'
          ],
          cta: 'Obtener Essential ($9.99)'
        },

        sentinel: {
          badge: 'AVANZADO',
          name: 'Sentinel',
          price: '$14.99',
          period: '/mes',
          features: [
            'Evaluaciones de Seguridad Ilimitadas',
            'Bot de Telegram BTC Guardian',
            'Alertas de wallet Bitcoin en tiempo real',
            'Monitoreo de transacciones',
            'Alertas de hitos de precio BTC',
            'Todas las características de Essential',
            'Cancelar cuando quieras'
          ],
          cta: 'Suscribirse a Sentinel'
        },

        consultation: {
          badge: 'EXPERTO',
          name: 'Consulta',
          price: '$99',
          period: '+ $49/hora add',
          features: [
            'Auditoría de seguridad privada de 1 hora',
            'Estrategia personalizada de auto-custodia',
            'Ayuda con implementación multi-firma',
            'Asistencia en planificación de herencia',
            'Guía de configuración de hardware wallet',
            'Horas adicionales a $49/hora'
          ],
          note: 'No incluye el bot BTC Guardian (exclusivo de Sentinel)',
          cta: 'Reservar Consulta de Seguridad'
        }
      },

      // Testimonials Section
      testimonials: {
        title: 'Lo Que Dicen Nuestros Usuarios',
        subtitle: 'Opiniones reales de Bitcoiners que aseguraron su auto-custodia con Kyward',
        privacyNote: 'Privacidad Protegida',
        reviews: [
          {
            name: 'Michael R.',
            role: 'Holder de Bitcoin desde 2017',
            stars: 5,
            text: 'Por fin, un servicio enfocado en educación en lugar de venderme otra hardware wallet. La evaluación de seguridad me abrió los ojos a vulnerabilidades que nunca había considerado.'
          },
          {
            name: 'Sarah K.',
            role: 'Defensora de Auto-Custodia',
            stars: 5,
            text: 'Solo la guía de planificación de herencia valió la pena. Mi familia ahora sabe exactamente cómo acceder a mi Bitcoin si algo me pasa. Tranquilidad lograda.'
          },
          {
            name: 'David L.',
            role: 'HODLer',
            stars: 5,
            text: 'Pensé que mi configuración era segura hasta que hice la evaluación. Un puntaje de 45/100 fue una llamada de atención. Después de seguir las recomendaciones, ahora estoy en 92.'
          },
          {
            name: 'Ana M.',
            role: 'Entusiasta Crypto',
            stars: 5,
            text: 'La política de cero almacenamiento de datos me convenció de probarlo. El tutorial de multi-firma fue claro y fácil de seguir. La mejor inversión en mi seguridad Bitcoin.'
          },
          {
            name: 'James T.',
            role: 'Inversor a Largo Plazo',
            stars: 5,
            text: 'Las alertas del plan Sentinel me han salvado varias veces. Saber cuándo mis direcciones de cold storage reciben transacciones me da una paz mental increíble.'
          },
          {
            name: 'Elena V.',
            role: 'Maximalista Bitcoin',
            stars: 5,
            text: 'Sin KYC, sin datos almacenados, solo consejos honestos de seguridad. Así deberían ser los servicios de Bitcoin. Recomendé el plan Essential a todos mis amigos.'
          }
        ]
      },

      footer: {
        tagline: 'Seguridad Bitcoin Auto-Custodia por Bitcoiners',
        copyright: '© 2025 Kyward. Plataforma de Evaluación de Seguridad Bitcoin.'
      }
    },

    // Auth Form
    auth: {
      loginTitle: 'Bienvenido de Nuevo',
      loginSubtitle: 'Accede a tu panel de seguridad Bitcoin',
      signupTitle: 'Comienza a Asegurar Tu Bitcoin',
      signupSubtitle: 'Únete a Kyward y protege tu configuración auto-custodia',
      signupSuccess: '¡Cuenta creada! Bienvenido a Kyward. Inicia tu evaluación gratuita de seguridad Bitcoin. Mejora cuando quieras para recomendaciones completas de auto-custodia.',
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
        part2: 'Todos los usuarios comienzan en el nivel gratuito. Mejora en cualquier momento a Essential ($9.99 pago único), Sentinel ($14.99/mes) o Consulta.',
      }
    },

    // Dashboard
    dashboard: {
      welcome: 'Bienvenido de nuevo,',
      welcomeUser: 'Bitcoiner',
      subtitle: 'Sigue tu progreso de seguridad auto-custodia',

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
        title: 'Desbloquea Tu Plan Completo de Auto-Custodia',
        description: 'Obtén evaluaciones ilimitadas, descarga tu PDF de seguridad Bitcoin con guías de configuración multi-firma y planificación de herencia completa.',
        features: {
          pdf: 'Descargar PDF de Seguridad',
          email: 'Enviar Reporte por Email',
          recommendations: 'Todos los Tips Auto-Custodia',
          inheritance: 'Plan de Herencia Bitcoin'
        },
        essentialButton: 'Obtener Essential - $9.99 pago único',
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
      title: 'Tu Reporte de Auto-Custodia Bitcoin',
      subtitle: 'Basado en tus respuestas, aquí está tu análisis personalizado de seguridad auto-custodia con recomendaciones accionables.',
      badge: 'Evaluación de Seguridad Bitcoin Completada',

      score: {
        label: 'Puntuación Auto-Custodia',
        outOf: '/100',
        excellent: 'Auto-Custodia Excelente',
        good: 'Seguridad Moderada',
        needsWork: 'Necesita Mejoras',
        critical: 'Riesgo Crítico',
        excellentDesc: 'Tus prácticas de auto-custodia Bitcoin son excelentes. Enfócate en optimización multi-firma y planificación de herencia.',
        goodDesc: 'Tienes una base sólida de auto-custodia. Mejora tu configuración de hardware wallet y estrategia de respaldo de frase semilla.',
        needsWorkDesc: 'Tu Bitcoin está en riesgo significativo. Implementa almacenamiento frío y respaldo de frase semilla adecuado inmediatamente.'
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
        title: 'Desbloquea Tu Plan Completo de Auto-Custodia y Herencia',
        subtitle: 'No solo conozcas tu puntuación - obtén la hoja de ruta completa de seguridad Bitcoin para proteger tus llaves privadas por generaciones.',

        benefits: {
          recommendations: {
            title: 'Todas las Recomendaciones Auto-Custodia',
            description: 'Instrucciones detalladas paso a paso para hardware wallets, almacenamiento frío y seguridad de frase semilla.'
          },
          pdf: {
            title: 'PDF de Seguridad Protegido',
            description: 'Descarga tu guía completa de auto-custodia Bitcoin offline. Consúltala cuando quieras, sin internet.'
          },
          inheritance: {
            title: 'Planificación de Herencia Bitcoin',
            description: 'Guía paso a paso para pasar tu Bitcoin a herederos de forma segura usando Liana time-locks y multi-firma.'
          },
          multisig: {
            title: 'Guía de Configuración Multi-Firma',
            description: 'Aprende configuración multisig 2-de-3 con Sparrow Wallet. Elimina puntos únicos de falla en tu auto-custodia.'
          },
          sparrow: {
            title: 'Tutorial de Sparrow Wallet',
            description: 'Guía completa para configurar Sparrow Wallet para máxima soberanía y privacidad Bitcoin.'
          },
          unlimited: {
            title: 'Evaluaciones de Seguridad Ilimitadas',
            description: 'Sigue tu progreso de auto-custodia a lo largo del tiempo. Repite la evaluación mientras mejoras tu configuración.'
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

        plan: {
          gridtitle: 'MÁS POPULAR',
          title1: 'Plan Esencial',
          price1: '$9.99',
          renew1: '/pago único',
          explanation1: 'Solo un pago',
          benefit1: 'Recomendaciones personalizadas',
          benefit2: 'Descarga completa del informe en PDF',
          benefit3: 'Guía de planificación de herencias',
          benefit4: 'Descargas ilimitadas de tu informe',
          benefit5: 'Solo una evaluación (recomprar para repetir)',
          payment1: 'Solo $9.99',
          
          title2: 'Consulta Personalizada',
          price2: '$99',
          renew2: '/sesión',
          explanation2: 'Sesiones adicionales: $49/hora',
          benefit11: 'Auditoría privada de 1 hora (videollamada)',
          benefit21: 'Estrategia de herencia personalizada',
          benefit31: 'Soporte de seguimiento durante 30 días',
          benefit41: 'Evaluaciones ilimitadas',
          benefit51: 'Soporte prioritario',
          payment2: 'Reservar Consulta',
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
      essentialRepurchaseNote: '<strong>Nota:</strong> Para realizar una nueva evaluación, deberás comprar Essential nuevamente ($9.99).',
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
        title: 'Opciones de Wallet para Almacenamiento Caliente (Bitcoin Mainnet)',
        description: 'Para almacenamiento Caliente a largo plazo (mínima interacción, máxima seguridad), considera estas wallets móviles/escritorio diseñadas específicamente para Bitcoin mainnet:',
        blueWallet: 'Enfocada en móvil, soporta modo watch-only, Lightning + on-chain, fácil de usar para almacenamiento Caliente con firma air-gapped vía exportación/importación de PSBT.',
        jade: 'Hardware wallet con fuertes capacidades de almacenamiento Caliente (air-gapped vía códigos QR), completamente open-source, se integra bien con Green wallet o Sparrow para firma offline.',
        bullBitcoin: 'Enfocada en privacidad Bitcoin sin KYC, soporta configuraciones de almacenamiento Caliente con fuerte énfasis en auto-custodia y características amigables para Canadá (bueno para diversificación geográfica).',
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
    },

    // Legal Pages
    legal: {
      privacy: {
        title: 'Política de Privacidad',
        back: 'Volver',
        lastUpdated: 'Última actualización: Febrero 2025',
        highlight: 'Kyward está comprometido con tu privacidad. Practicamos la recolección mínima de datos y nunca vendemos tu información.',
        introTitle: '1. Introducción',
        introText: 'Kyward ("nosotros", "nuestro" o "nos") opera el sitio web kyward.com y proporciona servicios de evaluación de seguridad de auto-custodia Bitcoin. Esta Política de Privacidad explica cómo recopilamos, usamos y protegemos tu información cuando usas nuestros servicios.',
        introText2: 'Kyward está registrado y opera desde Bogotá, Colombia, y cumple con las leyes colombianas de protección de datos aplicables.',
        dataTitle: '2. Información que Recopilamos',
        dataIntro: 'Recopilamos la información mínima necesaria para proporcionar nuestros servicios:',
        dataItem1: 'Dirección de correo electrónico - Requerida para crear cuenta y comunicación',
        dataItem2: 'Respuestas de evaluación de seguridad - Almacenadas para generar tu puntuación y recomendaciones',
        dataItem3: 'Información de pago - IDs de transacciones de criptomonedas (no almacenamos llaves privadas ni frases semilla)',
        kycTitle: '3. Política Sin KYC',
        kycText: 'NO requerimos ni recopilamos: documentos de identidad, comprobante de domicilio, fotos, números de teléfono, ni ningún otro documento de verificación de identidad. Tu privacidad es fundamental para nosotros.',
        storageTitle: '4. Almacenamiento y Seguridad de Datos',
        storageText: 'Tus datos se almacenan de forma segura usando Supabase, un proveedor de base de datos en la nube confiable con cifrado en reposo y en tránsito. Implementamos medidas de seguridad estándar de la industria para proteger tu información.',
        storageText2: 'Conservamos tus datos solo mientras tu cuenta esté activa. Puedes solicitar la eliminación de tu cuenta y todos los datos asociados en cualquier momento.',
        usageTitle: '5. Cómo Usamos Tus Datos',
        usageItem1: 'Proporcionar y mejorar nuestros servicios de evaluación de seguridad',
        usageItem2: 'Generar recomendaciones de seguridad personalizadas',
        usageItem3: 'Procesar pagos y proporcionar soporte al cliente',
        usageItem4: 'Enviar comunicaciones relacionadas con el servicio (con tu consentimiento para marketing)',
        sharingTitle: '6. Compartir Datos',
        sharingText: 'NO vendemos, intercambiamos ni alquilamos tu información personal a terceros. Solo podemos compartir datos con:',
        sharingItem1: 'Proveedores de servicios necesarios para operar nuestra plataforma (alojamiento de base de datos)',
        sharingItem2: 'Autoridades legales si lo requiere la ley colombiana',
        paymentsTitle: '7. Privacidad de Pagos',
        paymentsText: 'Aceptamos pagos en criptomonedas (Bitcoin y USDT) directamente a nuestras wallets. No usamos procesadores de pago de terceros que puedan rastrear tu identidad. Solo se almacenan los IDs de transacción para verificación de pedidos.',
        cookiesTitle: '8. Cookies y Analíticas',
        cookiesText: 'Actualmente no usamos herramientas de seguimiento analítico ni cookies de terceros. Solo usamos cookies esenciales requeridas para que el sitio web funcione (gestión de sesión, preferencias de idioma).',
        rightsTitle: '9. Tus Derechos',
        rightsIntro: 'Tienes derecho a:',
        rightsItem1: 'Acceder a tus datos personales',
        rightsItem2: 'Solicitar corrección de datos inexactos',
        rightsItem3: 'Solicitar eliminación de tu cuenta y datos',
        rightsItem4: 'Darte de baja de comunicaciones de marketing',
        changesTitle: '10. Cambios a Esta Política',
        changesText: 'Podemos actualizar esta Política de Privacidad de vez en cuando. Notificaremos a los usuarios sobre cambios significativos por correo electrónico o notificación en el sitio web. El uso continuado de nuestros servicios después de los cambios constituye aceptación.',
        contactTitle: '¿Preguntas?',
        contactText: 'Para consultas relacionadas con privacidad, contáctanos en:'
      },
      terms: {
        title: 'Términos de Servicio',
        back: 'Volver',
        lastUpdated: 'Última actualización: Febrero 2025',
        disclaimer: 'IMPORTANTE: Kyward proporciona contenido educativo sobre seguridad de auto-custodia Bitcoin. NO proporcionamos asesoramiento financiero, de inversión o legal. Eres el único responsable de tus decisiones de seguridad Bitcoin.',
        acceptTitle: '1. Aceptación de Términos',
        acceptText: 'Al acceder o usar los servicios de Kyward, aceptas estar sujeto a estos Términos de Servicio. Si no estás de acuerdo con estos términos, por favor no uses nuestros servicios.',
        serviceTitle: '2. Descripción del Servicio',
        serviceText: 'Kyward proporciona servicios de evaluación de seguridad de auto-custodia Bitcoin, incluyendo:',
        serviceItem1: 'Cuestionarios y evaluaciones de seguridad',
        serviceItem2: 'Puntuaciones y recomendaciones de seguridad personalizadas',
        serviceItem3: 'Contenido educativo sobre mejores prácticas de seguridad Bitcoin',
        serviceItem4: 'Servicios opcionales de monitoreo y alertas (plan Sentinel)',
        serviceItem5: 'Servicios opcionales de consulta',
        adviceTitle: '3. No Es Asesoramiento Financiero ni de Inversión',
        adviceHighlight: 'Kyward es una plataforma EDUCATIVA. Nada en este sitio web constituye asesoramiento financiero, de inversión, fiscal o legal.',
        adviceText: 'Nuestras evaluaciones y recomendaciones de seguridad son herramientas educativas para ayudarte a entender las mejores prácticas de auto-custodia Bitcoin. No recomendamos inversiones específicas, no respaldamos ninguna criptomoneda ni garantizamos resultados.',
        adviceText2: 'Debes consultar con profesionales calificados antes de tomar cualquier decisión financiera. Kyward y su equipo no son responsables de ninguna decisión de inversión que tomes.',
        userTitle: '4. Responsabilidades del Usuario',
        userIntro: 'Al usar nuestros servicios, aceptas:',
        userItem1: 'Proporcionar información precisa en las evaluaciones de seguridad',
        userItem2: 'Mantener tus credenciales de cuenta seguras y confidenciales',
        userItem3: 'No compartir tu cuenta con otros',
        userItem4: 'No usar nuestros servicios para actividades ilegales',
        userItem5: 'Asumir toda la responsabilidad de tu propia seguridad Bitcoin',
        paymentTitle: '5. Pagos y Reembolsos',
        paymentText: 'Aceptamos pagos en criptomonedas incluyendo Bitcoin (BTC) y USDT. Los precios se muestran en USD pero el pago se realiza en criptomoneda al tipo de cambio actual.',
        refundPolicy: 'TODAS LAS VENTAS SON FINALES. Debido a la naturaleza digital de nuestros servicios y los métodos de pago en criptomonedas, no ofrecemos reembolsos. Por favor revisa nuestros servicios cuidadosamente antes de comprar.',
        paymentText2: 'Los servicios de suscripción (plan Sentinel) pueden cancelarse en cualquier momento. La cancelación detiene la facturación futura pero no reembolsa el período de facturación actual.',
        ipTitle: '6. Propiedad Intelectual',
        ipText: 'Todo el contenido en Kyward, incluyendo texto, gráficos, logotipos, evaluaciones, recomendaciones y software, es propiedad de Kyward y está protegido por leyes de propiedad intelectual. No puedes copiar, reproducir, distribuir o crear obras derivadas sin nuestro permiso escrito.',
        liabilityTitle: '7. Limitación de Responsabilidad',
        liabilityText: 'EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY:',
        liabilityItem1: 'Kyward NO es responsable de ninguna pérdida de Bitcoin, criptomonedas o fondos',
        liabilityItem2: 'NO garantizamos la seguridad de tu configuración de auto-custodia',
        liabilityItem3: 'NO somos responsables de ningún daño derivado del uso de nuestros servicios',
        liabilityItem4: 'Nuestra responsabilidad máxima se limita al monto que pagaste por los servicios',
        liabilityText2: 'Reconoces que Bitcoin y las criptomonedas implican riesgos significativos. Eres el único responsable de asegurar tus llaves privadas, frases semilla y fondos.',
        terminationTitle: '8. Terminación de Cuenta',
        terminationText: 'Nos reservamos el derecho de suspender o terminar cuentas que violen estos términos, participen en actividad fraudulenta o abusen de nuestros servicios. Puedes eliminar tu cuenta en cualquier momento a través del panel o contactando a soporte.',
        lawTitle: '9. Ley Aplicable',
        lawText: 'Estos Términos de Servicio se rigen e interpretan de acuerdo con las leyes de Colombia. Cualquier disputa que surja de estos términos o nuestros servicios se resolverá en los tribunales de Bogotá, Colombia.',
        changesTitle: '10. Cambios a los Términos',
        changesText: 'Podemos modificar estos Términos de Servicio en cualquier momento. Los cambios significativos se comunicarán por correo electrónico o notificación en el sitio web. El uso continuado de nuestros servicios después de los cambios constituye aceptación de los términos modificados.',
        contactTitle: '¿Preguntas?',
        contactText: 'Para preguntas sobre estos términos, contáctanos en:'
      }
    }
  }
};

export default translations;
