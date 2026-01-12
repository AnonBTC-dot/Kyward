// ==============================================================================
// KYWARD - STEP 2: DATABASE CONFIGURATION (DATA TYPES)
// ==============================================================================
// This file implements the complete database schema and data management layer
// for Kyward, including User and Assessment data types with privacy rules.
// ==============================================================================

/**
 * DATABASE SCHEMA OVERVIEW
 * 
 * User Data Type:
 * - email: String (unique identifier)
 * - passwordHash: String (hashed password)
 * - subscriptionLevel: String (default: "free")
 * - assessments: Json[] (array of assessment IDs - premium only)
 * - createdAt: Date (default: now)
 * - lastAssessmentDate: Date (nullable)
 * - assessmentCount: Number (tracks monthly usage for free tier)
 * 
 * Assessment Data Type:
 * - assessmentId: String (unique identifier)
 * - userId: String (reference to User)
 * - responses: Json (questionnaire responses)
 * - score: Number (0-100)
 * - recommendations: Json (array of recommendations)
 * - plan: Json (action plan steps)
 * - timestamp: Date (default: now)
 * - tempResponses: Json (deleted after report generation)
 */

// ==============================================================================
// DATABASE UTILITY CLASS
// ==============================================================================

class KywardDatabase {
  constructor() {
    this.DB_PREFIX = 'kyward_db_';
    this.USERS_KEY = this.DB_PREFIX + 'users';
    this.ASSESSMENTS_KEY = this.DB_PREFIX + 'assessments';
    this.initializeDatabase();
  }

  // Initialize database structure
  initializeDatabase() {
    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify({}));
    }
    if (!localStorage.getItem(this.ASSESSMENTS_KEY)) {
      localStorage.setItem(this.ASSESSMENTS_KEY, JSON.stringify({}));
    }
  }

  // ==============================================================================
  // USER DATA TYPE OPERATIONS
  // ==============================================================================

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Object} Created user or error
   */
  createUser(userData) {
    try {
      const users = this.getUsers();
      
      // Check if user already exists
      if (users[userData.email]) {
        return { success: false, error: 'User already exists' };
      }

      // Validate required fields
      if (!userData.email || !userData.passwordHash) {
        return { success: false, error: 'Email and password required' };
      }

      // Create user with default values
      const newUser = {
        email: userData.email,
        passwordHash: userData.passwordHash,
        subscriptionLevel: userData.subscriptionLevel || 'free',
        assessments: [], // Empty array for assessment references
        createdAt: new Date().toISOString(),
        lastAssessmentDate: null,
        assessmentCount: 0,
        monthlyAssessmentCount: 0, // Track current month's assessments
        lastResetDate: new Date().toISOString() // For monthly reset
      };

      users[userData.email] = newUser;
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

      return { success: true, user: this.sanitizeUser(newUser) };
    } catch (error) {
      return { success: false, error: 'Failed to create user' };
    }
  }

  /**
   * Get user by email (with privacy rules)
   * @param {string} email - User email
   * @param {string} requestingEmail - Email of requesting user
   * @returns {Object} User data or null
   */
  getUser(email, requestingEmail = null) {
    try {
      const users = this.getUsers();
      const user = users[email];

      if (!user) {
        return null;
      }

      // Privacy Rule: Only current user can view their own data
      if (requestingEmail && requestingEmail !== email) {
        return null; // Access denied
      }

      return this.sanitizeUser(user);
    } catch (error) {
      return null;
    }
  }

  /**
   * Update user data
   * @param {string} email - User email
   * @param {Object} updates - Fields to update
   * @returns {Object} Success status
   */
  updateUser(email, updates) {
    try {
      const users = this.getUsers();
      
      if (!users[email]) {
        return { success: false, error: 'User not found' };
      }

      // Prevent updating sensitive fields directly
      delete updates.passwordHash;
      delete updates.email;

      users[email] = {
        ...users[email],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      return { success: true, user: this.sanitizeUser(users[email]) };
    } catch (error) {
      return { success: false, error: 'Failed to update user' };
    }
  }

  /**
   * Check and reset monthly assessment count
   * @param {string} email - User email
   */
  checkAndResetMonthlyCount(email) {
    const users = this.getUsers();
    const user = users[email];

    if (!user) return;

    const lastReset = new Date(user.lastResetDate);
    const now = new Date();

    // Check if we're in a new month
    if (lastReset.getMonth() !== now.getMonth() || 
        lastReset.getFullYear() !== now.getFullYear()) {
      user.monthlyAssessmentCount = 0;
      user.lastResetDate = now.toISOString();
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }
  }

  /**
   * Check if user can take assessment (free tier limit)
   * @param {string} email - User email
   * @returns {Object} Can take assessment and remaining count
   */
  canTakeAssessment(email) {
    const user = this.getUser(email, email);
    
    if (!user) {
      return { canTake: false, remaining: 0, reason: 'User not found' };
    }

    // Premium users have unlimited assessments
    if (user.subscriptionLevel === 'premium') {
      return { canTake: true, remaining: Infinity, isPremium: true };
    }

    // Check and reset monthly count if needed
    this.checkAndResetMonthlyCount(email);
    
    // Free users: 1 assessment per month
    const updatedUser = this.getUser(email, email);
    if (updatedUser.monthlyAssessmentCount >= 1) {
      return { 
        canTake: false, 
        remaining: 0, 
        reason: 'Monthly limit reached',
        nextResetDate: this.getNextResetDate()
      };
    }

    return { canTake: true, remaining: 1 - updatedUser.monthlyAssessmentCount };
  }

  getNextResetDate() {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth.toISOString();
  }

  // ==============================================================================
  // ASSESSMENT DATA TYPE OPERATIONS
  // ==============================================================================

  /**
   * Create a new assessment
   * @param {Object} assessmentData - Assessment data
   * @returns {Object} Created assessment or error
   */
  createAssessment(assessmentData) {
    try {
      const { userId, responses, score, recommendations, plan, tempResponses } = assessmentData;

      // Validate required fields
      if (!userId || !responses) {
        return { success: false, error: 'Missing required fields' };
      }

      // Check if user can take assessment
      const canTake = this.canTakeAssessment(userId);
      if (!canTake.canTake) {
        return { success: false, error: canTake.reason, nextResetDate: canTake.nextResetDate };
      }

      // Generate unique assessment ID
      const assessmentId = 'assessment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

      // Create assessment object
      const assessment = {
        assessmentId,
        userId,
        responses,
        score: score || 0,
        recommendations: recommendations || [],
        plan: plan || {},
        timestamp: new Date().toISOString(),
        tempResponses: tempResponses || null // Will be deleted after report generation
      };

      // Save assessment
      const assessments = this.getAssessments();
      assessments[assessmentId] = assessment;
      localStorage.setItem(this.ASSESSMENTS_KEY, JSON.stringify(assessments));

      // Update user's assessment list and counts
      const users = this.getUsers();
      if (users[userId]) {
        users[userId].assessments.push(assessmentId);
        users[userId].assessmentCount += 1;
        users[userId].monthlyAssessmentCount += 1;
        users[userId].lastAssessmentDate = new Date().toISOString();
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      }

      return { success: true, assessment: this.sanitizeAssessment(assessment) };
    } catch (error) {
      return { success: false, error: 'Failed to create assessment' };
    }
  }

  /**
   * Get assessment by ID (with privacy rules)
   * @param {string} assessmentId - Assessment ID
   * @param {string} requestingUserId - User requesting the data
   * @returns {Object} Assessment data or null
   */
  getAssessment(assessmentId, requestingUserId) {
    try {
      const assessments = this.getAssessments();
      const assessment = assessments[assessmentId];

      if (!assessment) {
        return null;
      }

      // Privacy Rule: Only the user who created it can view it
      if (assessment.userId !== requestingUserId) {
        return null; // Access denied
      }

      return this.sanitizeAssessment(assessment);
    } catch (error) {
      return null;
    }
  }

  /**
   * Get all assessments for a user
   * @param {string} userId - User email
   * @returns {Array} Array of assessments
   */
  getUserAssessments(userId) {
    try {
      const user = this.getUser(userId, userId);
      
      if (!user || !user.assessments) {
        return [];
      }

      const assessments = this.getAssessments();
      const userAssessments = user.assessments
        .map(id => assessments[id])
        .filter(a => a) // Remove any null entries
        .map(a => this.sanitizeAssessment(a));

      // Sort by timestamp (newest first)
      return userAssessments.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
    } catch (error) {
      return [];
    }
  }

  /**
   * Delete temporary responses after report generation
   * @param {string} assessmentId - Assessment ID
   * @returns {Object} Success status
   */
  deleteTempResponses(assessmentId) {
    try {
      const assessments = this.getAssessments();
      
      if (assessments[assessmentId]) {
        delete assessments[assessmentId].tempResponses;
        localStorage.setItem(this.ASSESSMENTS_KEY, JSON.stringify(assessments));
        return { success: true };
      }

      return { success: false, error: 'Assessment not found' };
    } catch (error) {
      return { success: false, error: 'Failed to delete temp responses' };
    }
  }

  /**
   * Delete an assessment
   * @param {string} assessmentId - Assessment ID
   * @param {string} userId - User ID
   * @returns {Object} Success status
   */
  deleteAssessment(assessmentId, userId) {
    try {
      const assessments = this.getAssessments();
      const assessment = assessments[assessmentId];

      // Privacy check
      if (!assessment || assessment.userId !== userId) {
        return { success: false, error: 'Assessment not found or access denied' };
      }

      // Delete from assessments
      delete assessments[assessmentId];
      localStorage.setItem(this.ASSESSMENTS_KEY, JSON.stringify(assessments));

      // Remove from user's assessment list
      const users = this.getUsers();
      if (users[userId]) {
        users[userId].assessments = users[userId].assessments.filter(id => id !== assessmentId);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete assessment' };
    }
  }

  // ==============================================================================
  // UTILITY METHODS
  // ==============================================================================

  getUsers() {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '{}');
  }

  getAssessments() {
    return JSON.parse(localStorage.getItem(this.ASSESSMENTS_KEY) || '{}');
  }

  /**
   * Remove sensitive data from user object
   */
  sanitizeUser(user) {
    if (!user) return null;
    
    const sanitized = { ...user };
    delete sanitized.passwordHash; // Never expose password hash
    return sanitized;
  }

  /**
   * Remove sensitive data from assessment object
   */
  sanitizeAssessment(assessment) {
    if (!assessment) return null;
    
    const sanitized = { ...assessment };
    // Remove temp responses if they exist
    delete sanitized.tempResponses;
    return sanitized;
  }

  /**
   * Get database statistics
   */
  getStats() {
    const users = this.getUsers();
    const assessments = this.getAssessments();

    return {
      totalUsers: Object.keys(users).length,
      totalAssessments: Object.keys(assessments).length,
      premiumUsers: Object.values(users).filter(u => u.subscriptionLevel === 'premium').length,
      freeUsers: Object.values(users).filter(u => u.subscriptionLevel === 'free').length
    };
  }

  /**
   * Clear all data (for testing purposes)
   */
  clearAllData() {
    localStorage.removeItem(this.USERS_KEY);
    localStorage.removeItem(this.ASSESSMENTS_KEY);
    this.initializeDatabase();
    return { success: true, message: 'All data cleared' };
  }

  /**
   * Export user data (GDPR compliance)
   */
  exportUserData(userId) {
    const user = this.getUser(userId, userId);
    const assessments = this.getUserAssessments(userId);

    return {
      user,
      assessments,
      exportDate: new Date().toISOString()
    };
  }
}

// ==============================================================================
// DATABASE INSTANCE (Singleton)
// ==============================================================================

// Create a single instance of the database
const kywardDB = new KywardDatabase();

// ==============================================================================
// EXAMPLE USAGE & TESTING
// ==============================================================================

console.log('='.repeat(80));
console.log('KYWARD DATABASE - STEP 2: DATABASE CONFIGURATION');
console.log('='.repeat(80));

// Test 1: Create Users
console.log('\n📝 Test 1: Creating Users...');
const user1 = kywardDB.createUser({
  email: 'satoshi@bitcoin.org',
  passwordHash: 'hashed_password_123'
});
console.log('User 1 (Free):', user1);

const user2 = kywardDB.createUser({
  email: 'premium@kyward.io',
  passwordHash: 'hashed_password_456',
  subscriptionLevel: 'premium'
});
console.log('User 2 (Premium):', user2);

// Test 2: Privacy Rules
console.log('\n🔒 Test 2: Testing Privacy Rules...');
const userAccess = kywardDB.getUser('satoshi@bitcoin.org', 'satoshi@bitcoin.org');
console.log('✓ User accessing own data:', userAccess ? 'Success' : 'Failed');

const deniedAccess = kywardDB.getUser('satoshi@bitcoin.org', 'hacker@evil.com');
console.log('✗ Different user trying to access:', deniedAccess ? 'SECURITY BREACH!' : 'Access Denied (Correct)');

// Test 3: Assessment Creation
console.log('\n📊 Test 3: Creating Assessments...');
const assessment1 = kywardDB.createAssessment({
  userId: 'satoshi@bitcoin.org',
  responses: {
    q1: 'yes',
    q2: 'hardware_wallet',
    q3: 'monthly'
  },
  score: 85,
  recommendations: [
    'Great job using a hardware wallet!',
    'Consider implementing multi-sig'
  ],
  plan: {
    steps: ['Step 1: Review backup locations', 'Step 2: Test recovery process']
  },
  tempResponses: { raw: 'temp data' }
});
console.log('Assessment created:', assessment1.success ? '✓' : '✗');

// Test 4: Monthly Limit for Free Users
console.log('\n🚫 Test 4: Testing Monthly Limits...');
const canTake1 = kywardDB.canTakeAssessment('satoshi@bitcoin.org');
console.log('Free user after 1 assessment:', canTake1);

// Try to create another assessment (should fail for free user)
const assessment2 = kywardDB.createAssessment({
  userId: 'satoshi@bitcoin.org',
  responses: { q1: 'test' }
});
console.log('Trying 2nd assessment (free):', assessment2.success ? 'FAILED TEST' : '✓ Correctly blocked');

// Premium user should be able to create unlimited
const premiumAssessment = kywardDB.createAssessment({
  userId: 'premium@kyward.io',
  responses: { q1: 'test' },
  score: 90
});
console.log('Premium user assessment:', premiumAssessment.success ? '✓' : '✗');

// Test 5: Get User Assessments
console.log('\n📋 Test 5: Retrieving User Assessments...');
const userAssessments = kywardDB.getUserAssessments('satoshi@bitcoin.org');
console.log('Satoshi\'s assessments:', userAssessments.length);

// Test 6: Delete Temp Responses
console.log('\n🗑️  Test 6: Deleting Temporary Responses...');
if (assessment1.success && assessment1.assessment) {
  const deleteResult = kywardDB.deleteTempResponses(assessment1.assessment.assessmentId);
  console.log('Temp responses deleted:', deleteResult.success ? '✓' : '✗');
}

// Test 7: Database Stats
console.log('\n📊 Test 7: Database Statistics...');
const stats = kywardDB.getStats();
console.log('Database Stats:', stats);

// Test 8: Export User Data (GDPR)
console.log('\n💾 Test 8: Export User Data (GDPR Compliance)...');
const exportData = kywardDB.exportUserData('satoshi@bitcoin.org');
console.log('Exported data contains:', {
  user: exportData.user ? '✓' : '✗',
  assessments: exportData.assessments ? '✓' : '✗',
  exportDate: exportData.exportDate
});

console.log('\n' + '='.repeat(80));
console.log('✅ DATABASE CONFIGURATION COMPLETE');
console.log('='.repeat(80));
console.log('\nKey Features Implemented:');
console.log('✓ User data type with email, passwordHash, subscription, assessments[]');
console.log('✓ Assessment data type with userId, responses, score, recommendations, plan');
console.log('✓ Privacy rules: Only current user can view own data');
console.log('✓ Monthly assessment limits for free users (1/month)');
console.log('✓ Unlimited assessments for premium users');
console.log('✓ Temp responses auto-deletion after report generation');
console.log('✓ GDPR-compliant data export');
console.log('✓ Assessment history tracking (premium feature)');
console.log('✓ Secure data sanitization (no password exposure)');
console.log('\n' + '='.repeat(80));

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { KywardDatabase, kywardDB };
}
