// KYWARD RECOMMENDATIONS ENGINE
// Generates personalized security tips and inheritance plans

import { translations } from '../i18n/translations';

// All available recommendations organized by category
export const allRecommendations = {
  hardware_wallet: {
    id: 'hardware_wallet',
    category: 'Storage',
    priority: 'critical',
    title: 'Use a Hardware Wallet',
    shortTip: 'Move your Bitcoin to a hardware wallet for maximum security.',
    fullTip: `A hardware wallet keeps your private keys offline, protected from hackers and malware.

**Recommended Options:**
- **Coldcard** - Maximum security, air-gapped, Bitcoin-only
- **Jade Wallet** - Open-source, affordable, strong focus on Bitcoin (by Blockstream)
- **BitBox02** - Swiss-made, excellent security, great privacy features

**Action Steps:**
1. Purchase directly from manufacturer (never third-party)
2. Verify device authenticity upon arrival
3. Set up in a private, secure location
4. Transfer a small test amount first
5. Gradually move larger amounts after testing`,
    trigger: (answers) => answers.q1 === 'no'
  },

  seed_backup_metal: {
    id: 'seed_backup_metal',
    category: 'Backup',
    priority: 'critical',
    title: 'Create Metal Seed Backup',
    shortTip: 'Store your seed phrase on metal for fire/water protection.',
    fullTip: `Paper backups can be destroyed by fire, water, or time. Metal backups are nearly indestructible.

**Recommended Metal Backup Solutions:**
- **Cryptosteel Capsule** - Stainless steel, easy to use
- **Billfodl** - Affordable, durable
- **Seedplate** - Simple stamping method
- **DIY Steel Washers** - Budget option

**Best Practices:**
1. Use stainless steel (316 grade for corrosion resistance)
2. Store in a fireproof safe or safety deposit box
3. Consider geographic distribution (different locations)
4. Never photograph or digitize your seed
5. Test readability periodically`,
    trigger: (answers) => !answers.q3?.includes('metal')
  },

  multiple_backups: {
    id: 'multiple_backups',
    category: 'Backup',
    priority: 'high',
    title: 'Distribute Backup Locations',
    shortTip: 'Store seed phrase copies in multiple secure locations.',
    fullTip: `A single backup location creates a single point of failure. Distribute your backups strategically.

**Location Strategy:**
1. **Home Safe** - Quick access for emergencies
2. **Bank Safety Deposit** - Fire/theft protection
3. **Trusted Family Member** - Geographic distribution
4. **Secure Secondary Property** - If available

**Security Considerations:**
- Each location should be secure independently
- Document locations securely for inheritance
- Avoid obvious locations (filing cabinets, desk drawers)`,
    trigger: (answers) => answers.q2 === 'single' || answers.q2 === 'none'
  },

  passphrase_setup: {
    id: 'passphrase_setup',
    category: 'Security',
    priority: 'high',
    title: 'Add a Passphrase (25th Word)',
    shortTip: 'Add an extra layer of security with a BIP39 passphrase.',
    fullTip: `A passphrase creates an entirely separate wallet from your seed phrase. Even if someone finds your seed, they can't access funds without the passphrase.

**How It Works:**
- Creates a hidden wallet alongside your main wallet
- Can be any phrase (not just a single word)
- Case-sensitive and space-sensitive
- Creates plausible deniability

**Implementation with Sparrow Wallet:**
1. Open Sparrow Wallet
2. Go to File > New Wallet
3. Select your hardware wallet
4. Enable "Use Passphrase" option
5. Enter your passphrase (write it down securely!)
6. Verify the new addresses are different

**Critical Warning:**
- If you forget the passphrase, funds are LOST FOREVER
- Store written copy separately from seed phrase
- Use dice method for generation`,
    trigger: (answers) => answers.q4 === 'no'
  },

  recovery_test: {
    id: 'recovery_test',
    category: 'Backup',
    priority: 'high',
    title: 'Test Your Recovery Process',
    shortTip: 'Verify you can actually recover your wallet from backup.',
    fullTip: `Many people discover their backup is incomplete or incorrect only when they need it. Test before it's too late.

**How to Test Safely:**
1. **Option A - New Device:** Get a second hardware wallet, restore from seed
2. **Option B - Sparrow Wallet:** Restore as watch-only using your seed

**Verification Checklist:**
- [ ] All 24 words recorded correctly
- [ ] Word order is correct
- [ ] Passphrase (if used) is recorded
- [ ] Derivation path noted (usually BIP84 for native SegWit)
- [ ] First receiving address matches original wallet`,
    trigger: (answers) => answers.q5 === 'no'
  },

  multisig_setup: {
    id: 'multisig_setup',
    category: 'Security',
    priority: 'medium',
    title: 'Consider Multi-Signature Setup',
    shortTip: 'Require multiple keys to spend your Bitcoin for ultimate security.',
    fullTip: `Multi-signature (multisig) requires multiple private keys to authorize a transaction, eliminating single points of failure.

**Recommended Setup: 2-of-3 Multisig**
- 3 different hardware wallets
- Need any 2 to sign transactions
- One can be lost/stolen without losing funds

**Software Options:**
- **Sparrow Wallet** - Best for self-custody multisig
- **Liana** - Time-locked recovery built-in

**Setting Up with Sparrow:**
1. Create 3 separate hardware wallet keystores
2. File > New Wallet > Multi Signature
3. Set threshold to 2-of-3
4. Import each keystore's xpub
5. Verify all devices show same addresses
6. Store each seed in different locations

**Distribution Strategy:**
- Key 1: Your primary location
- Key 2: Safety deposit box or trusted family
- Key 3: Lawyer or inheritance trustee`,
    trigger: (answers) => answers.q6 === 'no' || answers.q6 === 'considering'
  },

  address_verification: {
    id: 'address_verification',
    category: 'Security',
    priority: 'high',
    title: 'Always Verify Addresses on Device',
    shortTip: 'Confirm receiving addresses on your hardware wallet screen.',
    fullTip: `Clipboard malware can replace Bitcoin addresses. Always verify on your hardware wallet's trusted display.

**Verification Process:**
1. Generate receive address in your wallet software
2. Click "Verify on Device" or similar option
3. Confirm address matches on hardware wallet screen
4. Only then share the address or send to it

**Additional Protection:**
- Use Sparrow Wallet's "Show Address" feature
- For large amounts, verify first few and last few characters
- Send a small test transaction first
- Never trust addresses from emails or messages`,
    trigger: (answers) => answers.q7 === 'copy_paste' || answers.q7 === 'dont_verify'
  },

  cold_storage: {
    id: 'cold_storage',
    category: 'Storage',
    priority: 'critical',
    title: 'Move More Bitcoin to Cold Storage',
    shortTip: 'Keep 90%+ of your Bitcoin in cold storage, not on exchanges.',
    fullTip: `Exchanges can be hacked, freeze withdrawals, or go bankrupt. Not your keys, not your coins.

**Recommended Distribution:**
- **Cold Storage (90-95%):** Long-term holdings in hardware wallet
- **Hot Wallet (5-10%):** Daily spending, Lightning channels
- **Exchange (0%):** Only temporarily for trading

**Moving to Cold Storage:**
1. Set up hardware wallet properly
2. Generate and verify receive address
3. Send small test amount first
4. Wait for confirmations, verify balance
5. Send remaining funds in batches
6. Never leave significant amounts on exchanges`,
    trigger: (answers) => answers.q8 === 'some' || answers.q8 === 'none'
  },

  address_reuse: {
    id: 'address_reuse',
    category: 'Privacy',
    priority: 'medium',
    title: 'Stop Reusing Bitcoin Addresses',
    shortTip: 'Use a new address for each transaction to protect your privacy.',
    fullTip: `Address reuse links all your transactions together, destroying privacy and potentially security.

**Why It Matters:**
- Anyone who paid you can see all your transactions
- Chain analysis can build your financial profile
- Reduces cryptographic security (theoretical attack vectors)

**How to Avoid:**
- Use wallet software that auto-generates new addresses
- Sparrow Wallet handles this automatically
- Never manually share the same address twice`,
    trigger: (answers) => answers.q7 === 'often'
  },

  verify_updates: {
    id: 'verify_updates',
    category: 'Security',
    priority: 'medium',
    title: 'Verify Software Signatures',
    shortTip: 'Always verify cryptographic signatures before updating wallet software.',
    fullTip: `Malicious software updates are a common attack vector. Verify before installing.

**Verification Process for Sparrow Wallet:**
1. Download from sparrowwallet.com only
2. Download the .asc signature file
3. Import Craig Raw's PGP key
4. Run: gpg --verify sparrow-x.x.x.asc
5. Should say "Good signature"

**For Hardware Wallets:**
- Only update from official apps
- Verify device shows update prompt
- Check firmware version after update
- Never update via email links`,
    trigger: (answers) => answers.q10 === 'auto_update' || answers.q10 === 'rarely_update'
  },

  seed_security: {
    id: 'seed_security',
    category: 'Security',
    priority: 'critical',
    title: 'Never Share Your Seed Phrase',
    shortTip: 'Your seed phrase should be known only by you.',
    fullTip: `Anyone with your seed phrase has complete control over your Bitcoin. There are NO exceptions.

**Golden Rules:**
- NEVER enter your seed into a website
- NEVER share via email, text, or phone
- NEVER take a photo of your seed
- NEVER store in cloud services
- NEVER tell "support" your seed (all scams)

**If Someone Knows Your Seed:**
1. Immediately create new wallet
2. Transfer all funds to new addresses
3. Secure new seed properly
4. Treat old seed as compromised forever`,
    trigger: (answers) => answers.q11 === 'multiple' || answers.q11 === 'online'
  },

  dedicated_device: {
    id: 'dedicated_device',
    category: 'Security',
    priority: 'medium',
    title: 'Use a Dedicated Bitcoin Device',
    shortTip: 'Use a separate device for Bitcoin transactions to minimize attack surface.',
    fullTip: `Your daily-use computer may have malware. A dedicated device reduces risk significantly.

**Options (Best to Good):**
1. **Air-gapped Computer** - Never connects to internet
2. **Dedicated Laptop** - Only for Bitcoin, nothing else
3. **Separate Phone/Tablet** - Not your daily device
4. **Virtual Machine** - Isolated environment (least secure)

**Air-gapped Setup with Sparrow:**
1. Install Sparrow on offline computer
2. Create wallet, export watch-only
3. Import watch-only on online computer
4. Sign transactions on offline device via USB/SD card
5. Broadcast from online computer`,
    trigger: (answers) => answers.q12 === 'main_device'
  },

  inheritance_plan: {
    id: 'inheritance_plan',
    category: 'Inheritance',
    priority: 'high',
    title: 'Create an Inheritance Plan',
    shortTip: 'Ensure your Bitcoin can be accessed by heirs if something happens to you.',
    fullTip: `Without proper planning, your Bitcoin could be lost forever if something happens to you.

**Inheritance Options:**

**Option 1: Letter of Instruction + Multisig**
- 2-of-3 multisig with one key held by heir
- Sealed letter with instructions in safe
- Trusted contact holds information about setup

**Option 2: Liana Wallet (Time-locked Recovery)**
- Primary key: Your hardware wallet
- Recovery key: Heir's key (activates after X months of inactivity)
- No trust required, trustless inheritance

**Option 3: Dead Man's Switch Services**
- Casa, Unchained Capital offer inheritance solutions
- Regular check-ins required
- Keys released upon non-response

**Documentation Needed:**
1. What Bitcoin is (education for non-technical heirs)
2. Approximate holdings location
3. Hardware wallet locations
4. Seed phrase locations (encrypted or split)
5. Step-by-step recovery instructions`,
    trigger: (answers) => answers.q13 === 'no_plan' || answers.q13 === 'not_considered'
  },

  utxo_management: {
    id: 'utxo_management',
    category: 'Privacy',
    priority: 'low',
    title: 'Learn UTXO Management',
    shortTip: 'Understanding coin control improves privacy and reduces fees.',
    fullTip: `UTXOs (Unspent Transaction Outputs) are the individual "coins" in your wallet. Managing them properly protects privacy.

**Why It Matters:**
- Combining UTXOs from different sources links them
- Large UTXOs can reveal your holdings
- Poor management leads to higher fees

**Using Sparrow Wallet:**
1. View UTXOs tab to see all your coins
2. Label each UTXO by source
3. Freeze sensitive UTXOs
4. Manually select coins for transactions
5. Consider coin consolidation during low-fee periods

**Best Practices:**
- Keep KYC and non-KYC coins separate
- Consolidate small UTXOs when fees are <10 sat/vB
- Use PayJoin when possible`,
    trigger: (answers) => answers.q14 === 'unfamiliar' || answers.q14 === 'heard'
  },

  security_review: {
    id: 'security_review',
    category: 'Maintenance',
    priority: 'medium',
    title: 'Schedule Regular Security Reviews',
    shortTip: 'Review your security setup at least quarterly.',
    fullTip: `Security is not set-and-forget. Regular reviews catch issues before they become problems.

**Quarterly Review Checklist:**
- [ ] Verify backup locations are secure
- [ ] Test that backups are readable
- [ ] Update wallet software (verify signatures)
- [ ] Review transaction history for anomalies
- [ ] Check hardware wallet firmware
- [ ] Update inheritance documentation if needed
- [ ] Review overall security posture

**Annual Review:**
- [ ] Full recovery test on secondary device
- [ ] Consider upgrading security (singlesig → multisig)
- [ ] Update heirs on any changes
- [ ] Review overall security posture`,
    trigger: (answers) => answers.q15 === 'rarely' || answers.q15 === 'never'
  }
};

// Generate recommendations based on answers
export const generateRecommendations = (answers, score) => {
  const recommendations = [];

  Object.values(allRecommendations).forEach(rec => {
    if (rec.trigger(answers)) {
      recommendations.push({
        id: rec.id,
        category: rec.category,
        priority: rec.priority,
        title: rec.title,
        shortTip: rec.shortTip,
        fullTip: rec.fullTip
      });
    }
  });

  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return recommendations;
};

// Get limited tips for free users (first 3)
export const getFreeTips = (recommendations) => {
  return recommendations.slice(0, 3).map(rec => ({
    id: rec.id,
    category: rec.category,
    priority: rec.priority,
    title: rec.title,
    shortTip: rec.shortTip,
    isLocked: false
  }));
};

// Get locked tips preview for free users
export const getLockedTipsPreview = (recommendations) => {
  return recommendations.slice(3).map(rec => ({
    id: rec.id,
    category: rec.category,
    priority: rec.priority,
    title: rec.title,
    isLocked: true
  }));
};

// Generate full inheritance plan based on answers (with i18n support)
export const generateInheritancePlan = (answers, score, userEmail, lang = 'en') => {
  const t = translations[lang]?.inheritancePlanGen || translations.en.inheritancePlanGen;

  const plan = {
    generatedAt: new Date().toISOString(),
    userEmail,
    score,
    executiveSummary: '',
    currentSetup: {},
    recommendedSetup: {},
    walletRecommendation: {},
    multisigPlan: {},
    backupStrategy: {},
    inheritanceStrategy: {},
    actionPlanSparrow: [],
    actionPlanLiana: []
  };

  // Analyze current setup
  plan.currentSetup = {
    hasHardwareWallet: answers.q1 === 'yes' || answers.q1 === 'sometimes',
    hasMetalBackup: answers.q3?.includes('metal'),
    hasPassphrase: answers.q4 !== 'no',
    hasMultisig: answers.q6 === 'yes_3of5' || answers.q6 === 'yes_2of3',
    hasInheritancePlan: answers.q13 === 'documented_plan',
    coldStoragePercent: answers.q8 === 'all' ? 95 : answers.q8 === 'most' ? 70 : answers.q8 === 'some' ? 30 : 5
  };

  // Executive Summary (translated)
  if (score >= 80) {
    plan.executiveSummary = t.executiveSummary.excellent.replace('{score}', score);
  } else if (score >= 50) {
    plan.executiveSummary = t.executiveSummary.moderate.replace('{score}', score);
  } else {
    plan.executiveSummary = t.executiveSummary.needsWork.replace('{score}', score);
  }

  // Wallet Recommendation (translated)
  if (!plan.currentSetup.hasMultisig && score < 80) {
    plan.walletRecommendation = {
      primary: t.walletRecommendation.primary,
      description: t.walletRecommendation.description,
      downloadUrl: t.walletRecommendation.downloadUrl,
      setupSteps: t.walletRecommendation.setupSteps
    };
  }

  // Multisig Plan (translated)
  if (!plan.currentSetup.hasMultisig) {
    plan.multisigPlan = {
      recommended: true,
      type: t.multisigPlan.type,
      description: t.multisigPlan.description,
      hardware: [
        { device: t.multisigPlan.hardware.coldcard.device, purpose: t.multisigPlan.hardware.coldcard.purpose, cost: t.multisigPlan.hardware.coldcard.cost },
        { device: t.multisigPlan.hardware.bitbox.device, purpose: t.multisigPlan.hardware.bitbox.purpose, cost: t.multisigPlan.hardware.bitbox.cost },
        { device: t.multisigPlan.hardware.jade.device, purpose: t.multisigPlan.hardware.jade.purpose, cost: t.multisigPlan.hardware.jade.cost }
      ],
      softwareSetup: {
        name: t.walletRecommendation.primary,
        steps: t.multisigPlan.setupSteps
      }
    };
  }

  // Liana recommendation (translated)
  plan.inheritanceStrategy = {
    recommended: t.inheritanceStrategy.recommended,
    description: t.inheritanceStrategy.description,
    howItWorks: t.inheritanceStrategy.howItWorks,
    setupUrl: t.inheritanceStrategy.setupUrl,
    considerations: t.inheritanceStrategy.considerations
  };

  // Backup Strategy (translated)
  plan.backupStrategy = {
    passphraseGeneration: {
      method: t.backupStrategy.passphraseGeneration.method,
      description: t.backupStrategy.passphraseGeneration.description,
      steps: t.backupStrategy.passphraseGeneration.steps
    },
    seedPhrases: {
      storage: t.backupStrategy.seedPhrases.storage,
      model: t.backupStrategy.seedPhrases.model,
      modelDescription: t.backupStrategy.seedPhrases.modelDescription,
      security: t.backupStrategy.seedPhrases.security,
      locations: t.backupStrategy.seedPhrases.locations,
      passphraseStorage: t.backupStrategy.seedPhrases.passphraseStorage
    },
    documentation: {
      items: t.backupStrategy.documentation.items,
      storage: t.backupStrategy.documentation.storage
    }
  };

  // Action Plan (translated)
  let tempActionPlan = [];

  if (!plan.currentSetup.hasHardwareWallet) {
    tempActionPlan.push({
      priority: 1,
      action: t.actionPlan.purchaseHardware.action,
      timeframe: t.actionPlan.purchaseHardware.timeframe,
      cost: t.actionPlan.purchaseHardware.cost
    });
  }

  if (!plan.currentSetup.hasMetalBackup) {
    tempActionPlan.push({
      priority: 2,
      action: t.actionPlan.createMetalBackup.action,
      timeframe: t.actionPlan.createMetalBackup.timeframe,
      cost: t.actionPlan.createMetalBackup.cost
    });
  }

  if (!plan.currentSetup.hasPassphrase) {
    tempActionPlan.push({
      priority: 3,
      action: t.actionPlan.generatePassphrase.action,
      timeframe: t.actionPlan.generatePassphrase.timeframe,
      cost: t.actionPlan.generatePassphrase.cost
    });
  }

  if (!plan.currentSetup.hasMultisig) {
    tempActionPlan.push({
      priority: 4,
      action: t.actionPlan.setupMultisig.action,
      timeframe: t.actionPlan.setupMultisig.timeframe,
      cost: t.actionPlan.setupMultisig.cost
    });
  }

  if (!plan.currentSetup.hasInheritancePlan) {
    tempActionPlan.push({
      priority: 5,
      action: t.actionPlan.implementLiana.action,
      timeframe: t.actionPlan.implementLiana.timeframe,
      cost: t.actionPlan.implementLiana.cost
    });
  }

  tempActionPlan.push({
    priority: tempActionPlan.length + 1,
    action: t.actionPlan.documentEverything.action,
    timeframe: t.actionPlan.documentEverything.timeframe,
    cost: t.actionPlan.documentEverything.cost
  });

  // Create both paths
  plan.actionPlanSparrow = tempActionPlan.map(item => ({ ...item }));

  plan.actionPlanLiana = tempActionPlan.map(item => {
    let newItem = { ...item };
    // Replace multisig step with Liana multisig
    if (newItem.action === t.actionPlan.setupMultisig.action) {
      newItem.action = t.actionPlan.lianaMultisig.action;
      newItem.cost = t.actionPlan.lianaMultisig.cost;
    }
    // Replace Liana inheritance step
    if (newItem.action === t.actionPlan.implementLiana.action) {
      newItem.action = t.actionPlan.lianaTimelock.action;
    }
    return newItem;
  });

  return plan;
};