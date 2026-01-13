// KYWARD DATABASE & AUTH SYSTEM

class KywardDatabase {
  constructor() {
    this.DB_PREFIX = 'kyward_db_';
    this.USERS_KEY = this.DB_PREFIX + 'users';
    this.ASSESSMENTS_KEY = this.DB_PREFIX + 'assessments';
    this.SESSIONS_KEY = this.DB_PREFIX + 'sessions';
    this.initializeDatabase();
  }

  initializeDatabase() {
    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify({}));
    }
    if (!localStorage.getItem(this.ASSESSMENTS_KEY)) {
      localStorage.setItem(this.ASSESSMENTS_KEY, JSON.stringify({}));
    }
    if (!localStorage.getItem(this.SESSIONS_KEY)) {
      localStorage.setItem(this.SESSIONS_KEY, JSON.stringify({}));
    }
  }

  getUsers() {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '{}');
  }

  getSessions() {
    return JSON.parse(localStorage.getItem(this.SESSIONS_KEY) || '{}');
  }

  createUser(userData) {
    try {
      const users = this.getUsers();
      if (users[userData.email]) {
        return { success: false, message: 'An account with this email already exists.' };
      }
      const passwordHash = hashPassword(userData.password);
      const newUser = {
        email: userData.email,
        passwordHash: passwordHash,
        subscriptionLevel: 'free', // 'free', 'complete', 'consultation'
        subscriptionDate: null,
        pdfPassword: null,
        assessments: [],
        createdAt: new Date().toISOString(),
        assessmentCount: 0,
        monthlyAssessmentCount: 0,
        lastResetDate: new Date().toISOString(),
      };
      users[userData.email] = newUser;
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      return { success: true, user: this.sanitizeUser(newUser) };
    } catch (error) {
      return { success: false, message: 'Failed to create account. Please try again.' };
    }
  }

  getUser(email) {
    const users = this.getUsers();
    const user = users[email];
    return user ? this.sanitizeUser(user) : null;
  }

  getUserWithPassword(email) {
    const users = this.getUsers();
    return users[email] || null;
  }

  sanitizeUser(user) {
    if (!user) return null;
    const sanitized = { ...user };
    delete sanitized.passwordHash;
    return sanitized;
  }

  createSession(email) {
    const sessionToken = btoa(email + Date.now() + Math.random());
    const sessions = this.getSessions();
    sessions[sessionToken] = {
      email,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
    return sessionToken;
  }

  validateSession(sessionToken) {
    const sessions = this.getSessions();
    const session = sessions[sessionToken];
    if (!session) return null;
    const expiresAt = new Date(session.expiresAt);
    if (expiresAt < new Date()) {
      delete sessions[sessionToken];
      localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
      return null;
    }
    return session.email;
  }

  deleteSession(sessionToken) {
    const sessions = this.getSessions();
    delete sessions[sessionToken];
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
  }

  login(email, password) {
    try {
      const user = this.getUserWithPassword(email);
      if (!user) {
        return { success: false, message: 'User not found. Please sign up first.' };
      }
      const hashedPassword = hashPassword(password);
      if (user.passwordHash !== hashedPassword) {
        return { success: false, message: 'Incorrect password. Please try again.' };
      }
      const token = this.createSession(email);
      return { success: true, user: this.sanitizeUser(user), token };
    } catch (error) {
      return { success: false, message: 'Login failed. Please try again.' };
    }
  }

  userExists(email) {
    const users = this.getUsers();
    return !!users[email];
  }

  resetPassword(email, newPassword) {
    try {
      const users = this.getUsers();
      if (!users[email]) {
        return { success: false, message: 'User not found.' };
      }
      users[email].passwordHash = hashPassword(newPassword);
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      return { success: true, message: 'Password reset successfully.' };
    } catch (error) {
      return { success: false, message: 'Failed to reset password.' };
    }
  }

  getUserUsageStatus(email) {
    return this.canTakeAssessment(email);
  }

  canTakeAssessment(email) {
    const user = this.getUser(email);
    if (!user) return { canTake: false, remaining: 0 };
    // Complete and Consultation users get unlimited
    if (user.subscriptionLevel === 'complete' || user.subscriptionLevel === 'consultation') {
      return { canTake: true, remaining: Infinity, isPremium: true };
    }
    // Free users get 1 per month
    const count = user.monthlyAssessmentCount || 0;
    return {
      canTake: count < 1,
      remaining: Math.max(0, 1 - count),
      isPremium: false
    };
  }

  saveAssessment(email, assessmentData) {
    const users = this.getUsers();
    if (users[email]) {
      users[email].assessmentCount += 1;
      users[email].monthlyAssessmentCount += 1;
      users[email].lastAssessmentDate = new Date().toISOString();
      if (!users[email].assessments) users[email].assessments = [];
      users[email].assessments.push(assessmentData);

      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      return true;
    }
    return false;
  }

  // Upgrade user subscription
  upgradeSubscription(email, level) {
    try {
      const users = this.getUsers();
      if (!users[email]) {
        return { success: false, message: 'User not found.' };
      }

      // Generate a secure PDF password
      const pdfPassword = this.generatePdfPassword();

      users[email].subscriptionLevel = level;
      users[email].subscriptionDate = new Date().toISOString();
      users[email].pdfPassword = pdfPassword;

      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      return { success: true, pdfPassword };
    } catch (error) {
      return { success: false, message: 'Failed to upgrade subscription.' };
    }
  }

  // Generate secure PDF password
  generatePdfPassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // Get user's PDF password
  getPdfPassword(email) {
    const users = this.getUsers();
    return users[email]?.pdfPassword || null;
  }

  // Check if user has premium access
  hasPremiumAccess(email) {
    const user = this.getUser(email);
    return user && (user.subscriptionLevel === 'complete' || user.subscriptionLevel === 'consultation');
  }

  // Check if user has consultation access
  hasConsultationAccess(email) {
    const user = this.getUser(email);
    return user && user.subscriptionLevel === 'consultation';
  }

  // Get global statistics across all users
  getGlobalStats() {
    const users = this.getUsers();
    const allScores = [];
    let totalAssessments = 0;
    let totalUsers = 0;
    let premiumUsers = 0;

    // Distribution buckets
    const distribution = {
      excellent: 0,  // 80-100
      moderate: 0,   // 50-79
      needsWork: 0   // 0-49
    };

    Object.values(users).forEach(user => {
      totalUsers++;
      if (user.subscriptionLevel === 'complete' || user.subscriptionLevel === 'consultation') {
        premiumUsers++;
      }

      if (user.assessments && user.assessments.length > 0) {
        user.assessments.forEach(assessment => {
          if (assessment.score !== undefined && assessment.score !== null) {
            allScores.push(assessment.score);
            totalAssessments++;

            // Categorize score
            if (assessment.score >= 80) {
              distribution.excellent++;
            } else if (assessment.score >= 50) {
              distribution.moderate++;
            } else {
              distribution.needsWork++;
            }
          }
        });
      }
    });

    // Calculate statistics
    const averageScore = allScores.length > 0
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : 50; // Default average if no data

    const sortedScores = [...allScores].sort((a, b) => a - b);
    const medianScore = sortedScores.length > 0
      ? sortedScores[Math.floor(sortedScores.length / 2)]
      : 50;

    const highestScore = sortedScores.length > 0 ? sortedScores[sortedScores.length - 1] : 0;
    const lowestScore = sortedScores.length > 0 ? sortedScores[0] : 0;

    return {
      totalUsers,
      totalAssessments,
      premiumUsers,
      averageScore,
      medianScore,
      highestScore,
      lowestScore,
      distribution,
      // Percentages for distribution
      distributionPercent: {
        excellent: totalAssessments > 0 ? Math.round((distribution.excellent / totalAssessments) * 100) : 33,
        moderate: totalAssessments > 0 ? Math.round((distribution.moderate / totalAssessments) * 100) : 34,
        needsWork: totalAssessments > 0 ? Math.round((distribution.needsWork / totalAssessments) * 100) : 33
      }
    };
  }

  // Compare user score to global average
  compareToAverage(userScore) {
    const stats = this.getGlobalStats();
    const difference = userScore - stats.averageScore;

    // Calculate percentile (approximate)
    let percentile;
    if (userScore >= 80) {
      percentile = 85 + (userScore - 80) * 0.75; // 85-100 percentile
    } else if (userScore >= 50) {
      percentile = 35 + ((userScore - 50) / 30) * 50; // 35-85 percentile
    } else {
      percentile = (userScore / 50) * 35; // 0-35 percentile
    }
    percentile = Math.min(99, Math.max(1, Math.round(percentile)));

    return {
      userScore,
      averageScore: stats.averageScore,
      difference,
      percentile,
      isAboveAverage: difference > 0,
      isBelowAverage: difference < 0,
      comparison: difference > 10 ? 'well above' :
                  difference > 0 ? 'above' :
                  difference === 0 ? 'at' :
                  difference > -10 ? 'below' : 'well below',
      distribution: stats.distributionPercent
    };
  }
}

// Password hashing
export const hashPassword = (password) => {
  return btoa(password + 'kyward_salt_2024_secure');
};

export const kywardDB = new KywardDatabase();
